import type { NextPage, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Blocks } from 'notionate/dist/components'
import BlogList from '../../components/blog-list'
import { GetContent, ContentBilingual } from '../../lib/content'
import { useSelectedLanguage } from '../../i18n'
import { BlogEachLangs, blogQuery, buildExcerpt, GetBlogsEachLangs } from '../../lib/blog'
import styles from '../../styles/Blog.module.css'
import Hed from '../../components/hed'
import CreateOgImage from '../../lib/ogimage'

type Props = {
  blog: BlogEachLangs
  desc: ContentBilingual
  ogimage: string
}

export const getStaticProps: GetStaticProps<{}> = async () => {
  const blog = await GetBlogsEachLangs(blogQuery)
  const desc = await GetContent('blog')
  const ogimage = await CreateOgImage({
    id: 'blog',
    title: {
      en: desc!.en.title,
      ja: desc!.ja.title,
    },
    desc: {
      en: desc!.en.excerpt,
      ja: desc!.ja.excerpt,
    },
  })

  return {
    props: {
      blog,
      desc,
      ogimage,
    }
  }
}

const BlogIndex: NextPage<Props> = ({ blog, desc, ogimage }) => {
  const { lang } = useSelectedLanguage()
  const posts = lang === 'en' ? blog.en : blog.ja
  const d = lang === 'en' ? desc.en : desc.ja

  return (
    <main>
      <Hed title={d.title} desc={d.excerpt} ogimage={ogimage} />

      <div className="container">
        <header className={styles.listHeader}>
          <h1>
            {d.title}
          </h1>
          <div>
            <Blocks blocks={d.blocks} />
          </div>
        </header>
      </div>

      <div className="container">
        <BlogList blog={posts} lang={lang} />
      </div>
    </main>
  )
}

export default BlogIndex
