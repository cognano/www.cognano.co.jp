import type React from 'react'
import type { Blog } from '../lib/blog'
import styles from '../styles/Home.module.css'
import BlogHeader from './blog-header'

type Props = {
  blog: Blog[]
}

const BlogList: React.FC<Props> = ({ blog }) => {
  return (
    <div className={styles.postContainer}>
      {blog.map((post, i) => (
        <BlogHeader blog={post} key={i} />
      ))}
    </div>
  )
}

export default BlogList
