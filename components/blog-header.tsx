import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Blog.module.css'
import { formatDate } from '../lib/date'
import { Blog } from '../lib/blog'

type Props = {
  blog: Blog
  tag?: string
}

const BlogHeader: React.FC<Props> = ({ blog, tag }) => {
  const HeaderTag = (tag || 'p') as keyof JSX.IntrinsicElements
  return (
    <div className={styles.blog}>
      <Link href={`/blog/${blog.slug}`}>
        <HeaderTag className={styles.title}>
          {blog.title}
        </HeaderTag>
        <div className={styles.meta}>
          <span className={styles.date}>
            {formatDate(blog.date)}
          </span>
          <p className={styles.authors}>
            {blog.writers.map((u, i) => (
              <span key={i}>
                <Image src={u.avatar} width={30} height={30} alt={u.name} />
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