import { FetchBlocks } from 'rotion'
import { lang } from '../i18n'
import {
  type Blog,
  blogQuery,
  findFirstImage,
  GetBlogsEachLangs,
  newsQuery,
} from './blog'
import { type Content, GetContent } from './content'
import CreateOgImage from './ogimage'
import { PER_PAGE, paginate, totalPages } from './pagination'

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

// Posts that should not get a card background image (Notion page IDs).
const noCoverIds = new Set([
  // ai-drug-discovery-ukraine-cee
  '32acd24a-0b2b-80ae-88aa-dd1b5af9c491', // en
  '320cd24a-0b2b-8071-95d0-e33d7507a161', // ja
])

// Blocks are cached by last_edited_time, so this reuses the fetch done for
// each post page.
const withCovers = (posts: Blog[]): Promise<Blog[]> =>
  Promise.all(
    posts.map(async (post) => {
      if (noCoverIds.has(post.id)) {
        return { ...post, cover: null }
      }
      const blocks = await FetchBlocks({
        block_id: post.id,
        last_edited_time: post.last_edited_time,
      })
      return { ...post, cover: findFirstImage(blocks) }
    }),
  )

export const getPageCount = async (kind: Kind): Promise<number> => {
  const posts = await GetBlogsEachLangs(queries[kind])
  return totalPages(posts[lang].length, PER_PAGE[kind])
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

  const paged = paginate(posts[lang], page, PER_PAGE[kind])

  return {
    posts: kind === 'blog' ? await withCovers(paged) : paged,
    desc: content,
    ogimage,
    page,
    total: totalPages(posts[lang].length, PER_PAGE[kind]),
  }
}
