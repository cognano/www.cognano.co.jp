import React from 'react'
import Link from 'next/link'
import styles from '../styles/Blog.module.css'
import { formatDate } from '../lib/date'
import { Blog } from '../lib/blog'
import { useLanguageQuery } from '../i18n'

type Props = {
  blog: Blog
  lang: string
  tag?: string
}

const BlogHeader: React.FC<Props> = ({ blog, lang, tag }) => {
  const [query] = useLanguageQuery()
  const HeaderTag = (tag || 'p') as keyof JSX.IntrinsicElements
  return (
    <div className={styles.blog}>
      <Link href={{ pathname: `/blog/${blog.slug}`, query }}>
        <HeaderTag className={styles.title}>
          {blog.title}
        </HeaderTag>
        <div className={styles.meta}>
          <span className={styles.date}>
            {formatDate(blog.date, lang)}
          </span>
          <p className={styles.authors}>
            {blog.writers.map((u, i) => (
              <span key={i}>
                <img src={u.avatar} />
                {u.name}
              </span>
            ))}
          </p>
        </div>
      </Link>
    </div>
  )
}

export default BlogHeader