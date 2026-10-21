import type { GetStaticPaths, GetStaticProps } from 'next'
import BlogIndex from '../../../components/blog-index'
import {
  getListProps,
  getPageCount,
  type ListProps,
} from '../../../lib/list-props'

type Params = {
  page: string
}

// Page 1 is served by /blog, so only pages 2 and later are generated here.
export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const total = await getPageCount('blog')
  const paths = Array.from({ length: total - 1 }, (_, i) => ({
    params: { page: `${i + 2}` },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<ListProps, Params> = async ({
  params,
}) => {
  return { props: await getListProps('blog', Number(params?.page)) }
}

export default BlogIndex
