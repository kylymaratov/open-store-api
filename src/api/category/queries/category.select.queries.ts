export const getCategoriesSelectQuery = () => ({
  id: true,
  name: true,
  viewsCount: true,
  description: true,
  slug: true,
  _count: {
    select: { products: true },
  },
  parentId: true,
  icon: true
})

export const getCategoriesTreeSelectQuery = () => ({
  ...getCategoriesSelectQuery(),
  children: {
    select: {
      id: true,
      name: true,
      viewsCount: true,
      description: true,
      slug: true,
      _count: {
        select: { products: true },
      },
      parentId: true,
      icon: true,
    },
  },
})
