import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import t, { lang } from '../../i18n'
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
  blog?: Blog
  blocks?: ListBlockChildrenResponseEx
  excerpt?: string
  ogimage?: string
}

type Params = {
  slug: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const blog = await GetBlogsEachLangs(blogQuery)
  const paths = blog[lang].map(v => {
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
  const blogBilingal = await GetBlogsEachLangs(blogQuery)
  const blog = blogBilingal[lang].find(v => v.slug === params!.slug)

  if (blog) {
    const blocks = await FetchBlocks(blog.id, blog.last_edited_time)
    const excerpt = buildExcerpt(blocks)
    const ogimage = await CreateOgImage({
      id: `blog-${params!.slug}-${lang}`,
      title: blog.title,
      desc: lang === 'en' ? `by ${blog?.writers.map(u => u.name).join(', ')} at ${formatDate(blog?.date)}` : `${formatDate(blog?.date)} - ${blog?.writers.map(u => u.name).join(' ')}`,
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
    props: {},
    redirect: {
      destination: '/404'
    }
  }
}

const BlogPost: NextPage<Props> = ({ blog, blocks, excerpt, ogimage }) => {
  return (
    <article className="container blog">
      <Hed title={blog!.title} desc={excerpt!} suffix={t('header.blog')} ogimage={ogimage} />
      <header className={styles.header}>
        <p className={styles.category}>
          <Link href="/blog">
            {t('header.blog')}
          </Link>
        </p>
        <BlogHeader blog={blog!} tag="h1" />
      </header>
      <section className={styles.blocks}>
        <Blocks blocks={blocks!} />
      </section>
    </article>
  )
}

export default BlogPost
