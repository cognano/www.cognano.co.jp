import type { NextPage, GetStaticProps } from 'next'
import { Page } from 'rotion/ui'
import BlogList from '../../components/blog-list'
import { GetContent, Content } from '../../lib/content'
import { Blog, blogQuery, GetBlogsEachLangs } from '../../lib/blog'
import styles from '../../styles/Blog.module.css'
import Hed from '../../components/hed'
import CreateOgImage from '../../lib/ogimage'
import { lang } from '../../i18n'

type Props = {
  blog: Blog[]
  desc: Content
  ogimage: string
}

export const getStaticProps: GetStaticProps<{}> = async () => {
  const blog = await GetBlogsEachLangs(blogQuery)
  const desc = await GetContent('blog')
  const ogimage = await CreateOgImage({
    id: `blog-${lang}`,
    title: desc![lang]!.title,
    desc: desc![lang]!.excerpt,
  })

  return {
    props: {
      blog: blog[lang],
      desc: desc![lang],
      ogimage,
    }
  }
}

const BlogIndex: NextPage<Props> = ({ blog, desc, ogimage }) => {
  return (
    <main>
      <Hed title={desc.title} desc={desc.excerpt} ogimage={ogimage} />

      <div className="container">
        <header className={styles.listHeader}>
          <h1>
            {desc.title}
          </h1>
          <div>
            <Page blocks={desc.blocks} />
          </div>
        </header>
      </div>

      <div className="container">
        <BlogList blog={blog} />
      </div>
    </main>
  )
}

export default BlogIndex
