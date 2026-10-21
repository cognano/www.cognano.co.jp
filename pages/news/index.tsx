import type { GetStaticProps } from 'next'
import NewsIndex from '../../components/news-index'
import { getListProps, type ListProps } from '../../lib/list-props'

export const getStaticProps: GetStaticProps<ListProps> = async () => {
  return { props: await getListProps('news', 1) }
}

export default NewsIndex
