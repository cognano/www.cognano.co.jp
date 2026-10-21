import type { GetStaticPaths, GetStaticProps } from 'next'
import NewsIndex from '../../../components/news-index'
import {
  getListProps,
  getPageCount,
  type ListProps,
} from '../../../lib/list-props'

type Params = {
  page: string
}

// Page 1 is served by /news, so only pages 2 and later are generated here.
export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const total = await getPageCount('news')
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
  return { props: await getListProps('news', Number(params?.page)) }
}

export default NewsIndex
