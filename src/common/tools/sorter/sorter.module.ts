import { Module } from '@nestjs/common'
import { SorterService } from './sorter.service'

@Module({
  providers: [SorterService],
  exports: [SorterService],
})
export class SorterModule {}
