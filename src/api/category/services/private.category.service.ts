import {
  httpErrorMessages,
  httpSuccessMessages,
} from '@/common/constants/http.messages.constnats'
import { CacherService } from '@/common/tools/cacher/cacher.service'
import { GenerateService } from '@/common/tools/generate/generate.service'
import { SorterService } from '@/common/tools/sorter/sorter.service'
import { PrismaService } from '@/databases/prisma/prisma.service'
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateCategoryDto } from '../dto/createCategory.dto'
import { UpdateCategoryByIdDto } from '../dto/updateCategoryById.dto'

@Injectable()
export class PrivateCategoryService {
  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(GenerateService) private generate: GenerateService,
    @Inject(SorterService) private sorter: SorterService,
    @Inject(CacherService) private cacher: CacherService,
  ) {}

  async getCategoriesList() {
    const categories = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        parentId: true,
      },
    })

    const formated = categories.map((item) => ({
      label: item.name,
      value: item.id,
      parentId: item.parentId,
    }))

    if (!formated.length)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Categories'))

    return formated
  }

  async createCategory(body: CreateCategoryDto) {
    const { name, description, parentId } = body

    const slug = await this.generate.categorySlug(name)

    if (parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: parentId },
      })
      if (!parent)
        throw new NotFoundException(
          httpErrorMessages.NOT_FOUND('Parent category'),
        )
    }

    const categoryExists = await this.prisma.category.findUnique({
      where: { slug },
    })

    if (categoryExists)
      throw new ConflictException(
        httpErrorMessages.ALREADY_EXISTS('Category by this name'),
      )

    const savedCategory = await this.prisma.category.create({
      data: {
        name,
        description,
        slug,
        parentId,
        viewsCount: 0,
      },
    })

    return {
      message: httpSuccessMessages.CREATED('Category'),
      categoryId: savedCategory.id,
    }
  }

  async updateCategoryById(body: UpdateCategoryByIdDto) {
    const { categoryId, data } = body

    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category)
      throw new NotFoundException(
        httpErrorMessages.NOT_FOUND('Category by this id'),
      )

    const nextData: Record<string, unknown> = { ...data }

    if (Object.prototype.hasOwnProperty.call(data, 'parentId')) {
      const nextParentId = data.parentId ?? null

      if (nextParentId === categoryId)
        throw new ConflictException(
          httpErrorMessages.ALREADY_EXISTS('Category cannot be its own parent'),
        )

      if (typeof nextParentId === 'number') {
        const parent = await this.prisma.category.findUnique({
          where: { id: nextParentId },
        })

        if (!parent)
          throw new NotFoundException(
            httpErrorMessages.NOT_FOUND('Parent category'),
          )

        const visited = new Set<number>([categoryId])
        let cursor: number | null = nextParentId
        while (typeof cursor === 'number') {
          if (visited.has(cursor))
            throw new ConflictException(
              httpErrorMessages.ALREADY_EXISTS('Category parent cycle detected'),
            )
          visited.add(cursor)

          const node = await this.prisma.category.findUnique({
            where: { id: cursor },
            select: { parentId: true },
          })
          cursor = node?.parentId ?? null
        }
      }

      nextData.parentId = nextParentId
    }

    if (typeof data.name === 'string' && data.name.trim().length) {
      const slug = await this.generate.categorySlug(data.name)

      const existsCategoryBySlug = await this.prisma.category.findUnique({
        where: { slug },
      })

      if (existsCategoryBySlug && existsCategoryBySlug.id !== categoryId)
        throw new ConflictException(
          httpErrorMessages.ALREADY_EXISTS('Category by this name'),
        )

      nextData.slug = slug
    } else {
      delete nextData.name
    }

    await this.prisma.category.update({
      where: { id: categoryId },
      data: nextData,
    })

    return { message: httpSuccessMessages.UPDATED('Category') }
  }

  async deleteCategodyById(categoryId: number) {
    return await this.prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: { id: categoryId },
        include: { icon: true },
      })

      if (!category) throw new NotFoundException(httpErrorMessages.NOT_FOUND)

      await tx.deletedQueue.create({
        data: {
          fileId: category.icon?.imageId || '',
          itemId: String(categoryId),
          type: 'category',
        },
      })

      await tx.category.delete({ where: { id: categoryId } })

      return { message: httpSuccessMessages.DELETED('Category') }
    })
  }
}
