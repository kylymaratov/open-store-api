import { AdminGuard } from '@/common/guards/admin.guard'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { BannerService } from './banner.service'
import { CreateBannerDto } from './dto/createBanner.dto'
import { DeleteBannerDto } from './dto/deleteBanner.dto'
import { GetBannerAllDto } from './dto/getBannerAll.dto'
import { UpdateBannerDto } from './dto/updateBanner.dto'
import { PrivateBannerService } from './services/private.banner.service'

@Controller('banner')
export class BannerController {
  constructor(
    private readonly bannerService: BannerService,
    private readonly privateBannerService: PrivateBannerService,
  ) {}

  @Get('banners')
  getBanners(@Query() query: GetBannerAllDto) {
    return this.bannerService.getBanners(query)
  }

  @UseGuards(AdminGuard)
  @Post('create-banner')
  createBanner(@Body() body: CreateBannerDto) {
    return this.privateBannerService.createBanner(body)
  }

  @UseGuards(AdminGuard)
  @Patch('update')
  updateBanner(@Body() body: UpdateBannerDto) {
    return this.privateBannerService.updateBanner(body)
  }

  @UseGuards(AdminGuard)
  @Delete('delete/:bannerId')
  deleteBannerById(@Param() param: DeleteBannerDto) {
    return this.privateBannerService.deleteBannerById(param)
  }
}
