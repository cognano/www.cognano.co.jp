import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import t, { lang } from '../../i18n'
import { Blog, newsQuery, newsQueryLatest, GetBlogsEachLangs, BlogEachLangs, buildExcerpt } from '../../lib/blog'
import { FetchBlocks } from 'notionate'
import { Blocks, ListBlockChildrenResponseEx } from 'notionate/dist/components'
import { formatDate } from '../../lib/date'
import { GetContent, Content } from '../../lib/content'
import { tagIcon } from '../../components/news-list'
import styles from '../../styles/News.module.css'
import { calendarIcon, pensquareIcon } from '../../components/icons'
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
    const blocks = await FetchBlocks(news.id)
    const excerpt = buildExcerpt(blocks)
    const latestNews = await GetBlogsEachLangs(newsQueryLatest)

    const ogimage = await CreateOgImage({
      id: `news-${params!.slug}`,
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
      revalidate: 60,
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
      <Hed title={news!.title} desc={excerpt!} ogimage={ogimage} />
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
          <section className={styles.blocks}>
            <Blocks blocks={blocks!} />
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
