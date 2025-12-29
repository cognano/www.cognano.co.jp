import Image from 'next/image'
import Link from 'next/link'
import type React from 'react'
import type { Blog } from '../lib/blog'
import { formatDate } from '../lib/date'
import styles from '../styles/Blog.module.css'

type Props = {
  blog: Blog
  tag?: string
}

const BlogHeader: React.FC<Props> = ({ blog, tag }) => {
  const HeaderTag = (tag || 'p') as keyof JSX.IntrinsicElements
  return (
    <div className={styles.blog}>
      <Link href={`/blog/${blog.slug}`}>
        <HeaderTag className={styles.title}>{blog.title}</HeaderTag>
        <div className={styles.meta}>
          <span className={styles.date}>{formatDate(blog.date)}</span>
          <p className={styles.authors}>
            {blog.writers.map((u, i) => (
              <span className={styles.author} key={i}>
                <Image src={u.avatar} width={30} height={30} alt={u.name} />
                <span
                  className={`${styles.authorName} ${i === 0 ? styles.firstAuthor : styles.nofirstAuthor}`}
                >
                  {u.name}
                </span>
              </span>
            ))}
          </p>
        </div>
      </Link>
    </div>
  )
}

export default BlogHeader
