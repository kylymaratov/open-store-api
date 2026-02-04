import { httpErrorMessages } from '@/common/constants/http.messages.constnats'
import { BadRequestException } from '@nestjs/common'
import * as multer from 'multer'
import {
  bannerImageFilter,
  categoryImageFilter,
  productImageFilter,
} from '../helpers/storage.option.filter'

export const productImageOptions: multer.Options = {
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, callback) => {
    if (!productImageFilter.includes(file.mimetype)) {
      return callback(
        new BadRequestException(
          httpErrorMessages.ONLY_IMAGE_ALLOWED(productImageFilter.join(', ')),
        ) as any,
        false,
      )
    }
    callback(null, true)
  },
}

export const avatarImageOptions: multer.Options = {
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      return callback(
        new BadRequestException(
          httpErrorMessages.ONLY_IMAGE_ALLOWED(''),
        ) as any,
        false,
      )
    }
    callback(null, true)
  },
}

export const bannerImageOptions: multer.Options = {
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, callback) => {
    if (!bannerImageFilter.includes(file.mimetype)) {
      return callback(
        new BadRequestException(
          httpErrorMessages.ONLY_IMAGE_ALLOWED(bannerImageFilter.join(', ')),
        ) as any,
        false,
      )
    }

    callback(null, true)
  },
}

export const categoryIconOptions: multer.Options = {
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, callback) => {
    if (!categoryImageFilter.includes(file.mimetype)) {
      return callback(
        new BadRequestException(
          httpErrorMessages.ONLY_IMAGE_ALLOWED(categoryImageFilter.join(', ')),
        ) as any,
        false,
      )
    }

    callback(null, true)
  },
}
