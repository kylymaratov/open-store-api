import {
  avatarImageOptions,
  bannerImageOptions,
  categoryIconOptions,
  productImageOptions,
} from '@/api/storage/options/storage.options'
import { AdminGuard } from '@/common/guards/admin.guard'
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { DeleteBannerImageByIdDto } from './dto/deleteBannerImageById.dto'
import { DeleteProductImageByIdDto } from './dto/deleteProductImageById.dto'
import { GetProductImageBySlug } from './dto/getProductImageBySlug.dto'
import { SetMainProductImageDto } from './dto/setMainProductImage.dto'
import { UploadBannerImageDto } from './dto/uploadBannerImage.dto'
import { UploadCategoryIconDto } from './dto/uploadCategoryIcon.dto'
import { UploadProductImageDto } from './dto/uploadProductImage.dto'
import { FileRequiredPipe } from './pipes/file.required.pipe'
import { PrivateStorageService } from './services/private.storage.service'
import { StorageService } from './storage.service'

@Controller('storage')
export class StorageController {
  constructor(
    private readonly storageService: StorageService,
    private readonly privateStorageService: PrivateStorageService,
  ) {}

  @Get('product/:productSlug/images/:position')
  getProductImageBySlug(
    @Param() param: GetProductImageBySlug,
    @Res() res: Response,
  ) {
    return this.storageService.getProductImageBySlug(param, res)
  }

  @Get('category/icons/:categorySlug')
  getcategoryIconBySlug(
    @Param('categorySlug') categorySlug: string,
    @Res() res: Response,
  ) {
    return this.storageService.getCategoryIconBySlug(categorySlug, res)
  }

  @Get('banner/images/:bannerSlug')
  getBannerImageBySlug(
    @Param('bannerSlug') bannerSlug: string,
    @Res() res: Response,
  ) {
    return this.storageService.getBannerImageBySlug(bannerSlug, res)
  }

  @UseGuards(AdminGuard)
  @Post('category/icons/upload')
  @UseInterceptors(FileInterceptor('image', categoryIconOptions))
  uploadCategoryICon(
    @UploadedFile(FileRequiredPipe) image: Express.Multer.File,
    @Body() body: UploadCategoryIconDto,
  ) {
    return this.privateStorageService.uploadCategoryIcon(image, body)
  }

  @UseGuards(AdminGuard)
  @Post('product/images/upload')
  @UseInterceptors(FilesInterceptor('images', 10, productImageOptions))
  uploadProductImage(
    @UploadedFiles(FileRequiredPipe) images: Express.Multer.File[],
    @Body() body: UploadProductImageDto,
  ) {
    return this.privateStorageService.uploadProductImage(body, images)
  }

  @UseGuards(AdminGuard)
  @Post('banner/images/upload')
  @UseInterceptors(FileInterceptor('image', bannerImageOptions))
  uploadBannerImage(
    @UploadedFile(FileRequiredPipe) image: Express.Multer.File,
    @Body() body: UploadBannerImageDto,
  ) {
    return this.privateStorageService.uploadBannerImage(body, image)
  }

  @Post('user/avatar/upload')
  @UseInterceptors(FileInterceptor('avatar', avatarImageOptions))
  uploadUserAvatar(@UploadedFile(FileRequiredPipe) image: Express.Multer.File) {
    return this.privateStorageService.uploadUserAvatar(image)
  }

  @UseGuards(AdminGuard)
  @Delete('banner/delete/images/:bannerImageId')
  deleteBannerImageById(@Param() param: DeleteBannerImageByIdDto) {
    return this.privateStorageService.deleteBannerImageById(param)
  }

  @UseGuards(AdminGuard)
  @Delete('product/delete/:productId/images/:productImageId')
  deleteProductImageById(@Param() param: DeleteProductImageByIdDto) {
    return this.privateStorageService.deleteProductImageById(param)
  }

  @UseGuards(AdminGuard)
  @Patch('product/main/:productId/images/:productImageId')
  setMainProductImage(@Param() param: SetMainProductImageDto) {
    return this.privateStorageService.setMainProductImage(param)
  }
}
