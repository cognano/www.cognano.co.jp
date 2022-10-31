import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { useTranslation, useSelectedLanguage, useLanguageQuery } from '../../i18n'
import { Blog, newsQuery, newsQueryLatest, GetBlogsEachLangs, BlogEachLangs } from '../../lib/blog'
import { FetchBlocks } from 'notionate'
import { Blocks, ListBlockChildrenResponseEx } from 'notionate/dist/components'
import { formatDate } from '../../lib/date'
import { GetContent, ContentBilingual } from '../../lib/content'
import { tagIcon } from '../../components/news-list'
import styles from '../../styles/News.module.css'
import { calendarIcon, pensquareIcon } from '../../components/icons'

type Props = {
  blog?: {
    en?: Blog
    ja?: Blog
  }
  blocks?: {
    en?: ListBlockChildrenResponseEx
    ja?: ListBlockChildrenResponseEx
  }
  desc: ContentBilingual
  latestNews: BlogEachLangs
}

type Params = {
  slug: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const blog = await GetBlogsEachLangs(newsQuery)
  const paths = blog.en.map(v => {
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
  const en = blog.en.find(v => v.slug === params!.slug)
  const ja = blog.ja.find(v => v.slug === params!.slug)

  if (en && ja) {
    const blocksEn = await FetchBlocks(en.id)
    const blocksJa = await FetchBlocks(ja.id)
    const latestNews = await GetBlogsEachLangs(newsQueryLatest)

    return {
      props: {
        blog: { en, ja },
        blocks: {
          en: blocksEn,
          ja: blocksJa,
        },
        desc,
        latestNews,
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

const NewsPost: NextPage<Props> = ({ blog, blocks, desc, latestNews }) => {
  const { t } = useTranslation()
  const [query] = useLanguageQuery()
  const { lang } = useSelectedLanguage()
  const post = lang === 'en' ? blog!.en! : blog!.ja!
  const postBlocks = lang === 'en' ? blocks!.en! : blocks!.ja!
  const d = lang === 'en' ? desc.en : desc.ja
  const ln = lang === 'en' ? latestNews.en : latestNews.ja

  return (
    <main>
      <div className={styles.articleWrapper}>
        <div className={styles.newsHeader}>
          <p className={styles.category}>
            <Link href={{ pathname: '/news', query }}>
              {t('header.news')}
            </Link>
          </p>
          <h1 className={styles.newsTitle}>
            {post.title}
          </h1>
          <div className={styles.newsMeta}>
            <p className={styles.publishedAt}>
              <span className={styles.calendarIcon}>{calendarIcon()}</span>
              <span className={styles.date}>{formatDate(post.date, lang)}</span>
            </p>
            <ul className={styles.newsTags}>
              {post.tags.map((tag, i) => (
                tag !== 'News' && <li key={i}>
                  {tagIcon(tag)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <article className={styles.newsBody}>
          <section className={styles.blocks}>
            <Blocks blocks={postBlocks} />
          </section>
        </article>

        <div className={styles.latestNews}>
          <p className={styles.latestNewsHead}>
            {t('news.latestNews')}
          </p>
          <div className={styles.latestBody}>
            <ul>
              {ln.map((post, i) => (
                <li className={styles.latestPost} key={i}>
                  <Link href={{ pathname: `/news/${post.slug}`, query }}>
                    <a>
                      <span className={styles.latestPostDate}>
                        {formatDate(post.date, lang)}
                      </span>
                      <span className={styles.latestPostTitle}>
                        {post.title}
                      </span>
                    </a>
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
