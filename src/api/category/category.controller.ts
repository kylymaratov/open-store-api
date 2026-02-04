import { TSession } from '@/@types/shared/session.types'
import { CurrentSession } from '@/common/decorators/session.decorator'
import { AdminGuard } from '@/common/guards/admin.guard'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/createCategory.dto'
import { GetCategoriesDto } from './dto/getCategories.dto'
import { GetCategoryBySlugDto } from './dto/getCategoryBySlug.dto'
import { IncCategoryViewDto } from './dto/incCategoryView.dto'
import { UpdateCategoryByIdDto } from './dto/updateCategoryById.dto'
import { PrivateCategoryService } from './services/private.category.service'

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly privateCategoryService: PrivateCategoryService,
  ) {}

  @Get('categories')
  getCategories(@Query() query: GetCategoriesDto) {
    return this.categoryService.getCategories(query)
  }

  @Get('/slug/:categorySlug')
  getCategoryBySlug(@Param() param: GetCategoryBySlugDto) {
    return this.categoryService.getCategoryBySlug(param)
  }

  @UseGuards(AdminGuard)
  @Get('categories/list')
  getCategoriesList() {
    return this.privateCategoryService.getCategoriesList()
  }

  @UseGuards(AdminGuard)
  @Post('create-category')
  createCategory(@Body() body: CreateCategoryDto) {
    return this.privateCategoryService.createCategory(body)
  }

  @UseGuards(AdminGuard)
  @Patch('update-category')
  editCategory(@Body() body: UpdateCategoryByIdDto) {
    return this.privateCategoryService.updateCategoryById(body)
  }

  @Put('inc-view')
  incCategoryView(
    @Query() query: IncCategoryViewDto,
    @CurrentSession() session: TSession,
  ) {
    return this.categoryService.incCategoryView(query, session)
  }

  @UseGuards(AdminGuard)
  @Delete('delete/:categoryId')
  deleteCategoryById(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.privateCategoryService.deleteCategodyById(categoryId)
  }
}
