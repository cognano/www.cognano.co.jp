import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import type { ParsedUrlQuery } from 'node:querystring'
import { getPosts, WPPost } from '../../lib/data'

type Props = {
  post?: WPPost
}

type Params = ParsedUrlQuery & {
  slug: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const posts = await getPosts()
  const paths = posts.map(v => {
    const slug = v.node.slug
    return { params: { slug } }
  })

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
  const posts = await getPosts()
  const post = posts.find(v => v.node.slug === params!.slug)
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
      <h1>{post.node.title}</h1>
    </>
  )
}

export default BlogPost
