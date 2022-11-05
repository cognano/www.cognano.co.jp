import React from 'react'
import BlogHeader from './blog-header'
import styles from '../styles/Home.module.css'
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
        <BlogHeader blog={post} lang={lang} key={i} />
      ))}
    </div>
  )
}

export default BlogList