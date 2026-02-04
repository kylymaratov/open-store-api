import { TSession } from '@/@types/shared/session.types'
import {
  httpErrorMessages,
  httpSuccessMessages,
} from '@/common/constants/http.messages.constnats'
import { CATEGORY_VIEW_LOCK_TIME_MS } from '@/common/constants/time.constants'
import { CacherService } from '@/common/tools/cacher/cacher.service'
import { GenerateService } from '@/common/tools/generate/generate.service'
import { SorterService } from '@/common/tools/sorter/sorter.service'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { GetCategoriesDto } from './dto/getCategories.dto'
import { GetCategoryBySlugDto } from './dto/getCategoryBySlug.dto'
import { IncCategoryViewDto } from './dto/incCategoryView.dto'
import { getCategoriesSelectQuery } from './queries/category.select.queries'

@Injectable()
export class CategoryService {
  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(GenerateService) private generate: GenerateService,
    @Inject(SorterService) private sorter: SorterService,
    @Inject(CacherService) private cacher: CacherService,
  ) {}

  async getCategories(query: GetCategoriesDto) {
    const { limit = 10, page = 1, sort, q } = query

    const skip = (page - 1) * limit
    const orderBy = this.sorter.sortProductBy(sort)

    const qTrimmed = typeof q === 'string' ? q.trim() : ''

    const all = await this.prisma.category.findMany({
      select: getCategoriesSelectQuery(),
    })

    const byId = new Map<number, (typeof all)[number]>()
    for (const c of all) byId.set(c.id, c)

    let rootCandidates = all.filter((c) => c.parentId == null)

    if (qTrimmed.length) {
      const lower = qTrimmed.toLowerCase()
      const matched = all.filter((c) => {
        const name = String(c.name ?? '').toLowerCase()
        const slug = String(c.slug ?? '').toLowerCase()
        return name.includes(lower) || slug.includes(lower)
      })

      const keepIds = new Set<number>()
      for (const m of matched) {
        let cur: any = m
        while (cur && typeof cur.id === 'number' && !keepIds.has(cur.id)) {
          keepIds.add(cur.id)
          const parentId = cur.parentId
          if (typeof parentId !== 'number') break
          cur = byId.get(parentId)
        }
      }

      const kept = all.filter((c) => keepIds.has(c.id))
      const keptByParentId = new Map<number | null, typeof kept>()
      for (const c of kept) {
        const key = (c.parentId ?? null) as number | null
        const list = keptByParentId.get(key)
        if (list) list.push(c)
        else keptByParentId.set(key, [c])
      }

      const attachKeptChildren = (node: any, visited: Set<number>) => {
        if (visited.has(node.id)) return
        visited.add(node.id)
        const kids = keptByParentId.get(node.id) ?? []
        node.children = kids
          .slice()
          .sort((a: any, b: any) => (a.name ?? '').localeCompare(b.name ?? ''))
          .map((child: any) => {
            const next = { ...child }
            attachKeptChildren(next, new Set(visited))
            return next
          })
      }

      rootCandidates = kept
        .filter((c) => c.parentId == null)
        .slice()
        .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))

      const pagedRoots = rootCandidates.slice(skip, skip + limit)
      const categories = pagedRoots.map((root) => {
        const next: any = { ...root }
        attachKeptChildren(next, new Set<number>())
        return next
      })

      const totalCategories = rootCandidates.length

      if (!categories.length)
        throw new NotFoundException(httpErrorMessages.NOT_FOUND('Categories'))

      return {
        categories,
        currentPage: page,
        totalPages: Math.ceil(totalCategories / limit) || 1,
        totalCategories,
      }
    }

    const roots = await this.prisma.category.findMany({
      where: { parent: null },
      take: limit,
      skip: skip > 0 ? skip : undefined,
      orderBy,
      select: getCategoriesSelectQuery(),
    })

    const byParentId = new Map<number | null, typeof all>()
    for (const c of all) {
      const key = (c.parentId ?? null) as number | null
      const list = byParentId.get(key)
      if (list) list.push(c)
      else byParentId.set(key, [c])
    }

    const attachChildren = (node: any, visited: Set<number>) => {
      if (visited.has(node.id)) return
      visited.add(node.id)
      const kids = byParentId.get(node.id) ?? []
      node.children = kids
        .slice()
        .sort((a: any, b: any) => (a.name ?? '').localeCompare(b.name ?? ''))
        .map((child: any) => {
          const next = { ...child }
          attachChildren(next, new Set(visited))
          return next
        })
    }

    const categories = roots.map((root) => {
      const next: any = { ...root }
      attachChildren(next, new Set<number>())
      return next
    })

    const totalCategories = await this.prisma.category.count({
      where: { parent: null },
    })

    if (!categories.length)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Categories'))

    return {
      categories,
      currentPage: page,
      totalPages: Math.ceil(totalCategories / limit),
      totalCategories,
    }
  }

  async getCategoryBySlug(param: GetCategoryBySlugDto) {
    const { categorySlug } = param

    const category = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
      include: { parent: true },
    })

    if (!category)
      throw new NotFoundException(
        httpErrorMessages.NOT_FOUND('Category by this slug'),
      )

    return category
  }

  async incCategoryView(query: IncCategoryViewDto, session: TSession) {
    const { categorySlug } = query

    const key = `lock:productView:${categorySlug}:${session.sessionId}`

    const alreadyViewed = await this.cacher.get(key)
    if (alreadyViewed) return

    await this.prisma.category.update({
      where: { slug: categorySlug },
      data: {
        viewsCount: { increment: 1 },
      },
    })

    await this.cacher.set(key, 'lock', CATEGORY_VIEW_LOCK_TIME_MS)

    return { message: httpSuccessMessages.UPDATED('Category view count') }
  }
}
