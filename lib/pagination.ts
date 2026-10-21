export const PER_PAGE = {
  blog: 15,
  news: 10,
} as const

export const totalPages = (count: number, perPage: number): number =>
  Math.max(1, Math.ceil(count / perPage))

export const paginate = <T>(items: T[], page: number, perPage: number): T[] =>
  items.slice((page - 1) * perPage, page * perPage)

// Page 1 lives at the base path; later pages live under /page/N.
export const pageHref = (basePath: string, page: number): string =>
  page <= 1 ? basePath : `${basePath}/page/${page}`
