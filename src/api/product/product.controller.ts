import { TSession } from '@/@types/shared/session.types'
import { CurrentSession } from '@/common/decorators/session.decorator'
import { AdminGuard } from '@/common/guards/admin.guard'
import { SessionGuard } from '@/common/guards/session.guard'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CreateProductDto } from './dto/createProduct.dto'
import { CreateProductDescriptionDto } from './dto/createProductDescription.dto'
import { CreateProductSpecsDataDto } from './dto/createProductSpecs.dto'
import { DeleteProductByIdDto } from './dto/deleteProductById.dto'
import { GetProductByIdDto } from './dto/getProductById.dto'
import { GetProductBySlugDto } from './dto/getProductBySlug.dto'
import { GetProductDescriptionDto } from './dto/getProductDescription.dto'
import { GetProductsDto } from './dto/getProducts.dto'
import { GetProductsByCategoryDto } from './dto/getProductsByCategory.dto'
import { GetSameProductsDto } from './dto/getSameProducts.dto'
import { IncProductViewDto } from './dto/incProductView.dto'
import { UpdateProductDtoById } from './dto/updateProductById.dto'
import { UpdateProductDescriptionDto } from './dto/updateProductDescription.dto'
import { UpdateProductSpecsDto } from './dto/updateProductSpecs.dto'
import { ProductService } from './product.service'
import { PrivateProductService } from './services/private.product.service'

@Controller('product')
export class ProductController {
  constructor(
    private productService: ProductService,
    private privateProductService: PrivateProductService,
  ) {}

  @UseGuards(AdminGuard)
  @Get('counts')
  getProductCounts() {
    return this.productService.getProductCounts()
  }

  @Get('products')
  getProducts(@Query() query: GetProductsDto) {
    return this.productService.getProducts(query)
  }

  @Get('same/products')
  getSameProducts(@Query() query: GetSameProductsDto) {
    return this.productService.getSameProducts(query)
  }

  @Get('description/:productSlug')
  getProductDescription(@Param() param: GetProductDescriptionDto) {
    return this.productService.getProductDescription(param)
  }

  @Get('category-products')
  getProductsByCategory(@Query() query: GetProductsByCategoryDto) {
    return this.productService.getProductsByCategory(query)
  }

  @Get('/slug/:productSlug')
  getProductBySlug(@Param() param: GetProductBySlugDto) {
    return this.productService.getProductBySlug(param)
  }

  @UseGuards(SessionGuard)
  @Put('inc-views')
  incProductView(
    @Query() query: IncProductViewDto,
    @CurrentSession() session: TSession,
  ) {
    return this.productService.incProductView(query, session)
  }

  @UseGuards(AdminGuard)
  @Get('/id/:productId')
  getProductById(@Param() param: GetProductByIdDto) {
    return this.privateProductService.getProductById(param)
  }

  @UseGuards(AdminGuard)
  @HttpCode(201)
  @Post('create-product')
  createProduct(@Body() body: CreateProductDto) {
    return this.privateProductService.createProduct(body)
  }

  @UseGuards(AdminGuard)
  @Post('create-product-specs')
  createProductSpecs(@Body() body: CreateProductSpecsDataDto) {
    return this.privateProductService.createProductSpecs(body)
  }

  @UseGuards(AdminGuard)
  @Post('update-product-specs')
  updateProductSpecs(@Body() body: UpdateProductSpecsDto) {
    return this.privateProductService.updateProductSpecs(body)
  }

  @UseGuards(AdminGuard)
  @HttpCode(201)
  @Post('create-description')
  addDescription(@Body() body: CreateProductDescriptionDto) {
    return this.privateProductService.createProductDescription(body)
  }

  @UseGuards(AdminGuard)
  @Put('update-product')
  updateProductById(@Body() body: UpdateProductDtoById) {
    return this.privateProductService.updateProductById(body)
  }

  @UseGuards(AdminGuard)
  @Put('update-description')
  updateDescription(@Body() body: UpdateProductDescriptionDto) {
    return this.privateProductService.updateProductDescription(body)
  }

  @UseGuards(AdminGuard)
  @Delete('delete/:productId')
  deleteProductById(@Param() param: DeleteProductByIdDto) {
    return this.privateProductService.deleteProductById(param)
  }
}
