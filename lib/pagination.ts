export const PER_PAGE = 10

export const totalPages = (count: number): number =>
  Math.max(1, Math.ceil(count / PER_PAGE))

export const paginate = <T>(items: T[], page: number): T[] =>
  items.slice((page - 1) * PER_PAGE, page * PER_PAGE)

// Page 1 lives at the base path; later pages live under /page/N.
export const pageHref = (basePath: string, page: number): string =>
  page <= 1 ? basePath : `${basePath}/page/${page}`
