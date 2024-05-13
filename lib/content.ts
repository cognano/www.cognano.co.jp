import {
  FetchDatabase,
  FetchBlocks,
  FetchPage,
  DateResponse,
  RichTextItemResponse,
  SelectPropertyResponse,
  DBPageBase,
  GetPageResponseEx,
  ListBlockChildrenResponseEx,
  QueryDatabaseParameters,
} from 'notionate'
import { buildPlainText } from './member'

type DBPage = DBPageBase & {
  properties: {
    Name: {
      type: "title"
      title: RichTextItemResponse[]
      id: string
    }
    Category: {
      type: "select"
      select: SelectPropertyResponse
      id: string
    }
    Slug: {
      type: "select"
      select: SelectPropertyResponse
      id: string
    }
    Language: {
      type: "select"
      select: SelectPropertyResponse
      id: string
    }
    Date: {
      type: "date"
      date: DateResponse | null
      id: string
    }
    Tags: {
      type: "multi_select"
      multi_select: SelectPropertyResponse[]
      id: string
    }
    Published: {
      type: "checkbox"
      checkbox: boolean
      id: string
    }
    'Last updated at': {
      type: "date"
      date: DateResponse | null
      id: string
    }
  }
}

export type Content = {
  id: string
  title: string
  cover: string
  page: GetPageResponseEx
  blocks: ListBlockChildrenResponseEx
  excerpt: string
  last_edited_time: string
}

export type ContentBilingual = {
  en: Content
  ja: Content
}

const buildExcerpt = (b: ListBlockChildrenResponseEx): string => {
  const max = 400
  const text = buildPlainText(b)
  const excerpt = text.substring(0, max)
  const ellipsis = text.length > max ? '...' : ''
  return `${excerpt}${ellipsis}`
}

const query = {
  database_id: process.env.NOTION_PAGES_DB_ID,
  filter: {
    property: 'Published',
    checkbox: {
      equals: true
    },
  },
  sorts: [
    {
      property: 'Date',
      direction: 'descending'
    },
  ]
} as QueryDatabaseParameters

export const GetContent = async (slug: string): Promise<ContentBilingual|undefined> => {
  const { results } = await FetchDatabase(query)

  const pageEn = results.find(vv => {
    const v = vv as unknown as DBPage
    return v.properties.Slug.select.name === slug
      && v.properties.Language.select.name === 'English'
  }) as DBPage

  const pageJa = results.find(vv => {
    const v = vv as unknown as DBPage
    return v.properties.Slug.select.name === slug
      && v.properties.Language.select.name === 'Japanese'
  }) as DBPage

  if (!pageEn || !pageJa) {
    if (!pageEn) {
      console.log(`english page with slug "${slug}" not found`)
    }
    if (!pageJa) {
      console.log(`japanese page with slug "${slug}" not found`)
    }
    return undefined
  }

  const blocksEn = await FetchBlocks(pageEn.id, pageEn.last_edited_time)
  const en = {
    title: pageEn.properties.Name.title.map(v => v.plain_text).join(','),
    cover: (pageEn.cover && 'src' in pageEn.cover) ? pageEn.cover.src : '',
    page: await FetchPage(pageEn.id, pageEn.last_edited_time),
    blocks: blocksEn,
    excerpt: buildExcerpt(blocksEn),
  } as Content
  const blocksJa = await FetchBlocks(pageJa.id, pageJa.last_edited_time)
  const ja = {
    title: pageJa.properties.Name.title.map(v => v.plain_text).join(','),
    cover: (pageJa.cover && 'src' in pageJa.cover) ? pageJa.cover.src : '',
    page: await FetchPage(pageJa.id, pageJa.last_edited_time),
    blocks: blocksJa,
    excerpt: buildExcerpt(blocksJa),
  } as Content

  return { en, ja }
}
