import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { FetchBlocks, type ListBlockChildrenResponseEx } from 'rotion'
import { Page } from 'rotion/ui'
import BlogHeader from '../../components/blog-header'
import Hed from '../../components/hed'
import t, { lang } from '../../i18n'
import {
  type Blog,
  GetBlogsEachLangs,
  blogQuery,
  buildExcerpt,
} from '../../lib/blog'
import { formatDate } from '../../lib/date'
import CreateOgImage from '../../lib/ogimage'
import styles from '../../styles/Blog.module.css'

type Props = {
  blog: Blog
  blocks: ListBlockChildrenResponseEx
  excerpt: string
  ogimage: string
}

type Params = {
  slug: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const blog = await GetBlogsEachLangs(blogQuery)
  const paths = blog[lang].map((v) => {
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

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const blogBilingal = await GetBlogsEachLangs(blogQuery)
  const blog = blogBilingal[lang].find((v) => v.slug === params?.slug)

  if (blog) {
    const blocks = await FetchBlocks({
      block_id: blog.id,
      last_edited_time: blog.last_edited_time,
    })
    const excerpt = buildExcerpt(blocks)
    const ogimage = await CreateOgImage({
      id: `blog-${params?.slug}-${lang}`,
      title: blog.title,
      desc:
        lang === 'en'
          ? `by ${blog?.writers.map((u) => u.name).join(', ')} at ${formatDate(blog?.date)}`
          : `${formatDate(blog?.date)} - ${blog?.writers.map((u) => u.name).join(' ')}`,
    })

    return {
      props: {
        blog,
        blocks,
        excerpt,
        ogimage,
      },
    }
  }

  return {
    redirect: {
      destination: '/404',
      permanent: false,
    },
  }
}

const BlogPost: NextPage<Props> = ({ blog, blocks, excerpt, ogimage }) => {
  return (
    <article className='container blog'>
      <Hed
        title={blog.title}
        desc={excerpt}
        suffix={t('header.blog')}
        ogimage={ogimage}
      />
      <header className={styles.header}>
        <p className={styles.category}>
          <Link href='/blog'>{t('header.blog')}</Link>
        </p>
        <BlogHeader blog={blog} tag='h1' />
      </header>
      <section className={styles.blocks}>
        <Page blocks={blocks} />
      </section>
    </article>
  )
}

export default BlogPost
