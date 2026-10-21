import { lang } from '../i18n'
import { type Blog, blogQuery, GetBlogsEachLangs, newsQuery } from './blog'
import { type Content, GetContent } from './content'
import CreateOgImage from './ogimage'
import { paginate, totalPages } from './pagination'

export type ListProps = {
  posts: Blog[]
  desc: Content
  ogimage: string
  page: number
  total: number
}

type Kind = 'blog' | 'news'

const queries = {
  blog: blogQuery,
  news: newsQuery,
}

export const getPageCount = async (kind: Kind): Promise<number> => {
  const posts = await GetBlogsEachLangs(queries[kind])
  return totalPages(posts[lang].length)
}

export const getListProps = async (
  kind: Kind,
  page: number,
): Promise<ListProps> => {
  const [posts, desc] = await Promise.all([
    GetBlogsEachLangs(queries[kind]),
    GetContent(kind),
  ])

  if (!desc || !desc[lang]) {
    throw new Error(`${kind} content not found for language: ${lang}`)
  }

  const content = desc[lang]!

  const ogimage = await CreateOgImage({
    id: `${kind}-${lang}`,
    title: content.title,
    desc: content.excerpt,
  })

  return {
    posts: paginate(posts[lang], page),
    desc: content,
    ogimage,
    page,
    total: totalPages(posts[lang].length),
  }
}
