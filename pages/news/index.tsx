import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import NewsList from '../../components/news-list'
import { useSelectedLanguage } from '../../i18n'
import { newsQuery, BlogEachLangs, GetBlogsEachLangs } from '../../lib/blog'

type Props = {
  news: BlogEachLangs
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const news = await GetBlogsEachLangs(newsQuery)
  return {
    props: {
      news
    }
  }
}

const NewsIndex: NextPage<Props> = ({ news }) => {
  const { lang } = useSelectedLanguage()
  const posts = lang === 'en' ? news.en : news.ja

  return (
    <>
      <main>
        <header className="container">
          <h1>
            News
          </h1>
          <p>
            This is news.
          </p>
        </header>

        <div className="container">
          <NewsList news={posts} lang={lang} />
        </div>
      </main>
    </>
  )
}

export default NewsIndex
