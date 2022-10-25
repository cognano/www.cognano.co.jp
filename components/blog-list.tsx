import React from 'react'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { formatDate } from '../lib/date'
import { Blog } from '../lib/blog'
import { useLanguageQuery } from '../i18n'

type Props = {
  blog: Blog[]
  lang: string
}

const BlogList: React.FC<Props> = ({ blog, lang }) => {
  const [query] = useLanguageQuery()
  return (
    <div className={styles.postContainer}>
      {blog.map((post, i) => (
        <div className={styles.post} key={i}>
          <Link href={{ pathname: `/blog/${post.slug}`, query }}>
            <a>
              <h3 className={styles.postTitle}>
                {post.title}
              </h3>
              <div className={styles.postMeta}>
                <span className={styles.postDate}>{formatDate(post.date, lang)}</span>
                <p className={styles.postAuthor}>
                  {post.writers.map((u, i) => (
                    <span key={i}>
                      <img src={u.avatar} />
                      {u.name}
                    </span>
                  ))}
                </p>
              </div>
            </a>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default BlogList