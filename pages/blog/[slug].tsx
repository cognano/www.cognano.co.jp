import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { useSelectedLanguage, useLanguageQuery } from '../../i18n'
import { Blog, blogQuery, GetBlogsEachLangs } from '../../lib/blog'
import { FetchBlocks } from 'notionate'
import { Blocks, ListBlockChildrenResponseEx } from 'notionate/dist/components'
import { formatDate } from '../../lib/date'
import styles from '../../styles/Blog.module.css'
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
    const blocksJa = await FetchBlocks(ja.id)
    return {
      props: {
        blog: { en, ja },
        blocks: {
          en: blocksEn,
          ja: blocksJa,
        }
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

const BlogPost: NextPage<Props> = ({ blog, blocks }) => {
  const [query] = useLanguageQuery()
  const { lang } = useSelectedLanguage()
  const post = lang === 'en' ? blog!.en! : blog!.ja!
  const postBlocks = lang === 'en' ? blocks!.en! : blocks!.ja!
  return (
    <article className="container">
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
