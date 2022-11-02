import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { useSelectedLanguage, useLanguageQuery } from '../../i18n'
import { Blog, blogQuery, buildExcerpt, GetBlogsEachLangs } from '../../lib/blog'
import { FetchBlocks } from 'notionate'
import { Blocks, ListBlockChildrenResponseEx } from 'notionate/dist/components'
import { formatDate } from '../../lib/date'
import styles from '../../styles/Blog.module.css'
import { calendarIcon, pensquareIcon } from '../../components/icons'
import Hed from '../../components/hed'

type Props = {
  blog?: {
    en?: Blog
    ja?: Blog
  }
  blocks?: {
    en?: ListBlockChildrenResponseEx
    ja?: ListBlockChildrenResponseEx
  }
  excerpt?: {
    en: string
    ja: string
  }
}

type Params = {
  slug: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const blog = await GetBlogsEachLangs(blogQuery)
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

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
  const blog = await GetBlogsEachLangs(blogQuery)
  const en = blog.en.find(v => v.slug === params!.slug)
  const ja = blog.ja.find(v => v.slug === params!.slug)
  if (en && ja) {
    const blocksEn = await FetchBlocks(en.id)
    const excerptEn = buildExcerpt(blocksEn)
    const blocksJa = await FetchBlocks(ja.id)
    const excerptJa = buildExcerpt(blocksJa)
    return {
      props: {
        blog: { en, ja },
        blocks: {
          en: blocksEn,
          ja: blocksJa,
        },
        excerpt: {
          en: excerptEn,
          ja: excerptJa,
        },
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

const BlogPost: NextPage<Props> = ({ blog, blocks, excerpt }) => {
  const [query] = useLanguageQuery()
  const { lang } = useSelectedLanguage()
  const post = lang === 'en' ? blog!.en! : blog!.ja!
  const postBlocks = lang === 'en' ? blocks!.en! : blocks!.ja!
  const postExcerpt = lang === 'en' ? excerpt!.en : excerpt!.ja
  return (
    <article className="container">
      <Hed title={post.title} desc={postExcerpt} />
      <header className={styles.header}>
        <p className={styles.category}>
          <Link href={{ pathname: '/blog', query }}>Blog</Link>
        </p>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <p className={styles.publishedAt}>
            <span className={styles.calendarIcon}>{calendarIcon()}</span>
            <span className={styles.date}>{formatDate(post.date, lang)}</span>
          </p>
          <p className={styles.authors}>
            <span className={styles.writtenByIcon}>{pensquareIcon()}</span>
            {post.writers.map((u, i) => (
              <span className={styles.author} key={i}>
                {u.name}
                <img src={u.avatar} />
              </span>
            ))}
          </p>
        </div>
      </header>
      <section className={styles.blocks}>
        <Blocks blocks={postBlocks} />
      </section>
    </article>
  )
}

export default BlogPost
