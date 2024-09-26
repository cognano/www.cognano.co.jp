import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import t, { lang } from '../../i18n'
import { Blog, newsQuery, newsQueryLatest, GetBlogsEachLangs, buildExcerpt } from '../../lib/blog'
import { FetchBlocks, ListBlockChildrenResponseEx } from 'rotion'
import { Page } from 'rotion/ui'
import { formatDate } from '../../lib/date'
import { GetContent, Content } from '../../lib/content'
import { tagIcon } from '../../components/news-list'
import styles from '../../styles/News.module.css'
import { calendarIcon } from '../../components/icons'
import Hed from '../../components/hed'
import CreateOgImage from '../../lib/ogimage'

type Props = {
  news?: Blog
  blocks?: ListBlockChildrenResponseEx
  excerpt?: string
  desc: Content
  latestNews: Blog[]
  ogimage: string
}

type Params = {
  slug: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const news = await GetBlogsEachLangs(newsQuery)
  const paths = news[lang].map(v => {
    const slug = v.slug
    return {
      params: { slug },
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<{}> = async ({ params }) => {
  const desc = await GetContent('news')
  const blog = await GetBlogsEachLangs(newsQuery)
  const news = blog[lang].find(v => v.slug === params!.slug)

  if (news) {
    const blocks = await FetchBlocks({ block_id: news.id, last_edited_time: news.last_edited_time })
    const excerpt = buildExcerpt(blocks)
    const latestNews = await GetBlogsEachLangs(newsQueryLatest)

    const ogimage = await CreateOgImage({
      id: `news-${params!.slug}-${lang}`,
      title: news.title,
      desc: lang === 'en' ? `at ${formatDate(news?.date)}` : formatDate(news?.date),
    })

    return {
      props: {
        news,
        blocks,
        excerpt,
        desc,
        latestNews: latestNews[lang],
        ogimage,
      },
    }
  }

  return {
    props: {},
    redirect: {
      destination: '/404'
    }
  }
}

const NewsPost: NextPage<Props> = ({ news, blocks, excerpt, desc, latestNews, ogimage }) => {
  return (
    <main>
      <Hed title={news!.title} desc={excerpt!} suffix={t('header.news')} ogimage={ogimage} />
      <div className={styles.articleWrapper}>
        <div className={styles.newsHeader}>
          <p className={styles.category}>
            <Link href="/news">
              {t('header.news')}
            </Link>
          </p>
          <h1 className={styles.newsTitle}>
            {news!.title}
          </h1>
          <div className={styles.newsMeta}>
            <p className={styles.publishedAt}>
              <span className={styles.calendarIcon}>{calendarIcon()}</span>
              <span className={styles.date}>{formatDate(news!.date)}</span>
            </p>
            <ul className={styles.newsTags}>
              {news!.tags.map((tag, i) => (
                tag !== 'News' && <li key={i}>
                  {tagIcon(tag)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <article className={styles.newsBody}>
          <section className={`news-body ${styles.blocks}`}>
            <Page blocks={blocks!} />
          </section>
        </article>

        <div className={styles.latestNews}>
          <p className={styles.latestNewsHead}>
            {t('news.latestNews')}
          </p>
          <div className={styles.latestBody}>
            <ul>
              {latestNews.map((post, i) => (
                <li className={styles.latestPost} key={i}>
                  <Link href={`/news/${post.slug}`}>
                    <span className={styles.latestPostDate}>
                      {formatDate(post.date)}
                    </span>
                    <span className={styles.latestPostTitle}>
                      {post.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

export default NewsPost
