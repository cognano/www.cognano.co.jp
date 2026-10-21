import type React from 'react'
import { Page } from 'rotion/ui'
import type { ListProps } from '../lib/list-props'
import styles from '../styles/Blog.module.css'
import BlogList from './blog-list'
import Hed from './hed'
import Pagination from './pagination'

const BlogIndex: React.FC<ListProps> = ({
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
        <header className={styles.listHeader}>
          <h1>{desc.title}</h1>
          <div>
            <Page blocks={desc.blocks} />
          </div>
        </header>
      </div>

      <div className='container'>
        <BlogList blog={posts} />
        <Pagination basePath='/blog' current={page} total={total} />
      </div>
    </main>
  )
}

export default BlogIndex
