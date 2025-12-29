import type { GetStaticProps, NextPage } from 'next'
import { Page } from 'rotion/ui'
import BlogList from '../../components/blog-list'
import Hed from '../../components/hed'
import { lang } from '../../i18n'
import { type Blog, GetBlogsEachLangs, blogQuery } from '../../lib/blog'
import { type Content, GetContent } from '../../lib/content'
import CreateOgImage from '../../lib/ogimage'
import styles from '../../styles/Blog.module.css'

type Props = {
  blog: Blog[]
  desc: Content
  ogimage: string
}

export const getStaticProps: GetStaticProps<{}> = async () => {
  const [blog, desc] = await Promise.all([
    GetBlogsEachLangs(blogQuery),
    GetContent('blog'),
  ])

  if (!desc || !desc[lang]) {
    throw new Error(`Blog content not found for language: ${lang}`)
  }

  const content = desc[lang]!

  const ogimage = await CreateOgImage({
    id: `blog-${lang}`,
    title: content.title,
    desc: content.excerpt,
  })

  return {
    props: {
      blog: blog[lang],
      desc: content,
      ogimage,
    },
  }
}

const BlogIndex: NextPage<Props> = ({ blog, desc, ogimage }) => {
  return (
    <main>
      <Hed title={desc.title} desc={desc.excerpt} ogimage={ogimage} />

      <div className='container'>
        <header className={styles.listHeader}>
          <h1>{desc.title}</h1>
          <div>
            <Page blocks={desc.blocks} />
          </div>
        </header>
      </div>

      <div className='container'>
        <BlogList blog={blog} />
      </div>
    </main>
  )
}

export default BlogIndex
