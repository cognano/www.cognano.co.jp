import type React from 'react'
import { Page } from 'rotion/ui'
import type { ListProps } from '../lib/list-props'
import styles from '../styles/News.module.css'
import Hed from './hed'
import NewsList from './news-list'
import Pagination from './pagination'

const NewsIndex: React.FC<ListProps> = ({
  posts,
  desc,
  ogimage,
  page,
  total,
}) => {
  return (
    <main>
      <Hed
        title={desc.title}
        suffix={page > 1 ? `(${page}/${total})` : undefined}
        desc={desc.excerpt}
        ogimage={ogimage}
      />
      <div className='container'>
        <header>
          <h1>{desc.title}</h1>
          <div>
            <Page blocks={desc.blocks} />
          </div>
        </header>
      </div>

      <div className='container'>
        <div className={styles.newsList}>
          <NewsList news={posts} />
          <Pagination basePath='/news' current={page} total={total} />
        </div>
      </div>
    </main>
  )
}

export default NewsIndex
