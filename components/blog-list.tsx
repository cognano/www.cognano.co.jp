import React from 'react'
import BlogHeader from './blog-header'
import styles from '../styles/Home.module.css'
import { Blog } from '../lib/blog'

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