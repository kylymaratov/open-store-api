import { Controller, Post, Query } from '@nestjs/common'
import { SearchProductsByNameDto } from './dto/searchProductsByName.dto'
import { SearchService } from './search.service'

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('product')
  searchProduct(@Query() query: SearchProductsByNameDto) {
    return this.searchService.searchProduct(query)
  }
}
