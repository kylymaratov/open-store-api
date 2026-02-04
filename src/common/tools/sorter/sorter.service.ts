import { TOrderBy, TSortOption } from '@/@types/shared/sort.types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SorterService {
  sortProductBy = (sort?: TSortOption): TOrderBy | undefined => {
    const mapping: Record<TSortOption, TOrderBy> = {
      views: { viewsCount: 'desc' },
      newest: { createdAt: 'desc' },
      older: { createdAt: 'asc' },
    }

    return sort ? mapping[sort] : undefined
  }

  omitFields<T extends Record<string, any>>(
    items: T[],
    fields: (keyof T)[],
  ): Partial<T>[] {
    return items.map((item) => {
      const clone = { ...item }
      for (const field of fields) {
        delete clone[field]
      }
      return clone
    })
  }
}
