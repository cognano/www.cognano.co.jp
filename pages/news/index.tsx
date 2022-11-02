import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Blocks } from 'notionate/dist/components'
import NewsList from '../../components/news-list'
import { useSelectedLanguage } from '../../i18n'
import { newsQuery, BlogEachLangs, GetBlogsEachLangs } from '../../lib/blog'
import { GetContent, ContentBilingual } from '../../lib/content'
import styles from '../../styles/News.module.css'
import Hed from '../../components/hed'

type Props = {
  news: BlogEachLangs
  desc: ContentBilingual
}

export const getStaticProps: GetStaticProps<{}> = async () => {
  const news = await GetBlogsEachLangs(newsQuery)
  const desc = await GetContent('news')
  return {
    props: {
      news,
      desc,
    }
  }
}

const NewsIndex: NextPage<Props> = ({ news, desc }) => {
  const { lang } = useSelectedLanguage()
  const posts = lang === 'en' ? news.en : news.ja
  const d = lang === 'en' ? desc.en : desc.ja

  return (
    <main>
      <Hed title={d.title} desc={d.excerpt} />
      <div className="container">
        <header>
          <h1>
            {d.title}
          </h1>
          <div>
            <Blocks blocks={d.blocks} />
          </div>
        </header>
      </div>

      <div className="container">
        <div className={styles.newsList}>
          <NewsList news={posts} lang={lang} />
        </div>
      </div>
    </main>
  )
}

export default NewsIndex
