import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { useTranslation, useSelectedLanguage, useLanguageQuery } from '../../i18n'
import { Blog, blogQuery, buildExcerpt, GetBlogsEachLangs } from '../../lib/blog'
import { FetchBlocks } from 'notionate'
import { Blocks, ListBlockChildrenResponseEx } from 'notionate/dist/components'
import { formatDate } from '../../lib/date'
import styles from '../../styles/Blog.module.css'
import { calendarIcon, pensquareIcon } from '../../components/icons'
import Hed from '../../components/hed'
import BlogHeader from '../../components/blog-header'
import CreateOgImage from '../../lib/ogimage'

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
  ogimage?: string
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
    const ogimage = await CreateOgImage({
      id: `blog-${params!.slug}`,
      title: {
        en: en.title,
        ja: ja.title,
      },
      desc: {
        en: `by ${en?.writers.map(u => u.name).join(', ')} at ${formatDate(en?.date, 'en')}`,
        ja: `${formatDate(en?.date, 'ja')} - ${ja?.writers.map(u => u.name).join(' ')}`,
      },
    })
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

const BlogPost: NextPage<Props> = ({ blog, blocks, excerpt, ogimage }) => {
  const { t } = useTranslation()
  const [query] = useLanguageQuery()
  const { lang } = useSelectedLanguage()
  const post = lang === 'en' ? blog!.en! : blog!.ja!
  const postBlocks = lang === 'en' ? blocks!.en! : blocks!.ja!
  const postExcerpt = lang === 'en' ? excerpt!.en : excerpt!.ja
  return (
    <article className="container">
      <Hed title={post.title} desc={postExcerpt} ogimage={ogimage} />
      <header className={styles.header}>
        <p className={styles.category}>
          <Link href={{ pathname: '/blog', query }}>
            {t('header.blog')}
          </Link>
        </p>
        <BlogHeader blog={post} lang={lang} tag="h1" />
      </header>
      <section className={styles.blocks}>
        <Blocks blocks={postBlocks} />
      </section>
    </article>
  )
}

export default BlogPost
