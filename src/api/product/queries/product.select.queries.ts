import { Prisma } from '@prisma/client'

const defaultProductFeilds = {
  id: true,
  sku: true,
  slug: true,
  name: true,
  categoryId: true,
  inStock: true,
  price: true,
  discountedPrice: true,
  discountPercent: true,
  viewsCount: true,
  archived: true,
  specs: true,
}

export const getProductBySlugSelectQuery = () => ({
  ...defaultProductFeilds,
  category: {
    select: {
      name: true,
      slug: true,
      description: true,
      viewsCount: true,
    },
  },
  images: {
    select: {
      id: true,
      imageId: true,
      position: true,
      originalName: true,
      mimeType: true,
      fileSize: true,
    },
  },
  descriptions: true,
})

export const getProductsSelectQuery = (
  withImage: boolean,
): Prisma.ProductSelect => ({
  ...defaultProductFeilds,
  category: {
    select: { name: true, slug: true },
  },
  images: withImage
    ? {
        select: {
          id: true,
          imageId: true,
          position: true,
          originalName: true,
          mimeType: true,
          fileSize: true,
        },
      }
    : false,
})

export const getProductsByCategorySelectQuery = (): Prisma.ProductSelect => ({
  ...defaultProductFeilds,
  category: {
    select: { name: true, slug: true },
  },
  images: {
    select: {
      id: true,
      imageId: true,
      position: true,
      originalName: true,
      mimeType: true,
      fileSize: true,
    },
  },
})

export const getSameProductSelectQuery = (withImage: boolean) => ({
  ...defaultProductFeilds,
  category: { select: { name: true, slug: true } },
  images: withImage
    ? {
        select: {
          position: true,
          originalName: true,
          mimeType: true,
          fileSize: true,
        },
      }
    : false,
})
