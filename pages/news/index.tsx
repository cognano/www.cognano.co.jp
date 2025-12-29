import type { GetStaticProps, NextPage } from 'next'
import { Page } from 'rotion/ui'
import Hed from '../../components/hed'
import NewsList from '../../components/news-list'
import { lang } from '../../i18n'
import { type Blog, GetBlogsEachLangs, newsQuery } from '../../lib/blog'
import { type Content, GetContent } from '../../lib/content'
import CreateOgImage from '../../lib/ogimage'
import styles from '../../styles/News.module.css'

type Props = {
  news: Blog[]
  desc: Content
  ogimage: string
}

export const getStaticProps: GetStaticProps<{}> = async () => {
  const [news, desc] = await Promise.all([
    GetBlogsEachLangs(newsQuery),
    GetContent('news'),
  ])

  if (!desc || !desc[lang]) {
    throw new Error(`News content not found for language: ${lang}`)
  }

  const content = desc[lang]!

  const ogimage = await CreateOgImage({
    id: `news-${lang}`,
    title: content.title,
    desc: content.excerpt,
  })

  return {
    props: {
      news: news[lang],
      desc: content,
      ogimage,
    },
  }
}

const NewsIndex: NextPage<Props> = ({ news, desc, ogimage }) => {
  return (
    <main>
      <Hed title={desc.title} desc={desc.excerpt} ogimage={ogimage} />
      <div className='container'>
        <header>
          <h1>{desc.title}</h1>
          <div>
            <Page blocks={desc.blocks} />
          </div>
        </header>
      </div>

      <div className='container'>
        <div className={styles.newsList}>
          <NewsList news={news} />
        </div>
      </div>
    </main>
  )
}

export default NewsIndex
