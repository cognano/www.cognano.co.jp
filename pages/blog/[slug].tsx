import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import type { ParsedUrlQuery } from 'node:querystring'
import { useTranslation, useSelectedLanguage } from '../../i18n'
import { Blog, GetBlogs } from '../../lib/blog'
import { formatDate } from '../../lib/date'

type Props = {
  post?: Blog
}

type Params = {
  slug: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const posts = await GetBlogs()
  const paths = posts.map(v => {
    const slug = v.slug
    return { params: { slug } }
  })

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
  const posts = await GetBlogs()
  const post = posts.find(v => v.slug === params!.slug)
  if (post) {
    return {
      props: {
        post
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

const BlogPost: NextPage<Props> = (context) => {
  const post = context.post!
  return (
    <>
      <h1>{post.title}</h1>
    </>
  )
}

export default BlogPost
