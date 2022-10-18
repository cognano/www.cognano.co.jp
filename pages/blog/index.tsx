import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import BlogList from '../../components/blog-list'
import { useSelectedLanguage } from '../../i18n'
import { BlogEachLangs, blogQuery, GetBlogsEachLangs } from '../../lib/blog'

type Props = {
  blog: BlogEachLangs
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const blog = await GetBlogsEachLangs(blogQuery)
  return {
    props: {
      blog
    }
  }
}

const BlogIndex: NextPage<Props> = ({ blog }) => {
  const { lang } = useSelectedLanguage()
  const posts = lang === 'en' ? blog.en : blog.ja

  return (
    <>
      <main>
        <header className="container">
          <h1>
            Blog
          </h1>
          <p>
            This is blog.
          </p>
        </header>

        <div className="container">
          <BlogList blog={posts} lang={lang} />
        </div>
      </main>
    </>
  )
}

export default BlogIndex
