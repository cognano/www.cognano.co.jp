import type { GetStaticProps } from 'next'
import BlogIndex from '../../components/blog-index'
import { getListProps, type ListProps } from '../../lib/list-props'

export const getStaticProps: GetStaticProps<ListProps> = async () => {
  return { props: await getListProps('blog', 1) }
}

export default BlogIndex
