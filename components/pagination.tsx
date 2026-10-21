import Link from 'next/link'
import type React from 'react'
import t from '../i18n'
import { pageHref } from '../lib/pagination'
import styles from '../styles/Pagination.module.css'

type Props = {
  basePath: string
  current: number
  total: number
}

const Pagination: React.FC<Props> = ({ basePath, current, total }) => {
  if (total <= 1) {
    return null
  }

  const pages = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <nav className={styles.pagination} aria-label={t('pagination.label')}>
      {current > 1 ? (
        <Link
          className={styles.step}
          href={pageHref(basePath, current - 1)}
          rel='prev'
        >
          &larr; {t('pagination.prev')}
        </Link>
      ) : (
        <span className={`${styles.step} ${styles.disabled}`}>
          &larr; {t('pagination.prev')}
        </span>
      )}

      <ol className={styles.pages}>
        {pages.map((page) => (
          <li key={page}>
            {page === current ? (
              <span className={styles.current} aria-current='page'>
                {page}
              </span>
            ) : (
              <Link className={styles.page} href={pageHref(basePath, page)}>
                {page}
              </Link>
            )}
          </li>
        ))}
      </ol>

      {current < total ? (
        <Link
          className={styles.step}
          href={pageHref(basePath, current + 1)}
          rel='next'
        >
          {t('pagination.next')} &rarr;
        </Link>
      ) : (
        <span className={`${styles.step} ${styles.disabled}`}>
          {t('pagination.next')} &rarr;
        </span>
      )}
    </nav>
  )
}

export default Pagination
