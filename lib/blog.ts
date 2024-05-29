import {
  FetchDatabase,
  DateResponse,
  RichTextItemResponse,
  SelectPropertyResponse,
  DBPageBase,
  QueryDatabaseParameters,
  PersonUserObjectResponseEx,
  ListBlockChildrenResponseEx,
} from 'rotion'
import { buildPlainText } from './member'

type Writer = {
  name: string
  avatar: string
}

export type Blog = {
  id: string
  title: string
  date: string
  edited: string
  slug: string
  createdTs: number
  lastEditedTs: number
  last_edited_time: string
  tags: string[]
  writers: Writer[]
  language: string
}

export type BlogEachLangs = {
  en: Blog[]
  ja: Blog[]
}

export type DBPage = DBPageBase & {
  properties: {
    Name: {
      type: "title"
      title: RichTextItemResponse[]
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
    Writers: {
      type: "people"
      people: PersonUserObjectResponseEx[]
      id: string
    }
    Published: {
      type: "checkbox"
      checkbox: boolean
      id: string
    }
  }
}

const build = (page: DBPage): Blog => {
  const props = page.properties
  return {
    id: page.id,
    title: props.Name.title.map(v => v.plain_text).filter(v => v).join(',') || '',
    slug: props.Slug.select.name || '',
    date: props.Date.date?.start || '',
    edited: page.last_edited_time,
    createdTs: Date.parse(page.created_time),
    lastEditedTs: Date.parse(page.last_edited_time),
    last_edited_time: page.last_edited_time,
    tags: props.Tags.multi_select.map(v => v.name) || [],
    writers: props.Writers.people.map(v => {
      return { name: v.name, avatar: v.avatar } as Writer
    }) || [],
    language: props.Language.select.name || '',
  }
}

export const buildExcerpt = (b: ListBlockChildrenResponseEx): string => {
  const max = 400
  const text = buildPlainText(b)
  const excerpt = text.substring(0, max)
  const ellipsis = text.length > max ? '...' : ''
  return `${excerpt}${ellipsis}`
}

// YYYY-MM-DD
const today = process.env.BUILD_ENV as string === 'staging' || process.env.NODE_ENV as string === 'development' ? '2123-01-01' : new Date().toLocaleString('sv-SE')

export const blogQuery = {
  database_id: process.env.NOTION_BLOG_DB_ID,
  filter: {
    and: [
      {
        property: 'Date',
        date: {
          before: today,
        }
      },
      {
        property: 'Published',
        checkbox: {
          equals: true
        }
      },
      {
        property: 'Tags',
        multi_select: {
          does_not_contain: 'News'
        }
      }
    ]
  },
  sorts: [
    {
      property: 'Date',
      direction: 'descending'
    },
  ]
} as QueryDatabaseParameters

// Double value because it is bilingual, Actually 5
export const blogQueryLatest = { ...blogQuery, page_size: 10 }

export const newsQuery = {
  database_id: process.env.NOTION_BLOG_DB_ID,
  filter: {
    and: [
      {
        property: 'Date',
        date: {
          before: today,
        }
      },
      {
        property: 'Published',
        checkbox: {
          equals: true
        }
      },
      {
        property: 'Tags',
        multi_select: {
          contains: 'News'
        }
      }
    ]
  },
  sorts: [
    {
      property: 'Date',
      direction: 'descending'
    },
  ]
} as QueryDatabaseParameters

// Double value because it is bilingual, Actually 5
export const newsQueryLatest = { ...newsQuery, page_size: 10 }

export const GetBlogsEachLangs = async (q: QueryDatabaseParameters): Promise<BlogEachLangs> => {
  const { results } = await FetchDatabase(q)

  const ja = results.filter(v => {
    const p = v as DBPage
    if (p.properties.Language.select.name === 'Japanese') {
      return v
    }
  }).map(v => {
    const p = v as DBPage
    return build(p)
  })

  const en = results.filter(v => {
    const p = v as DBPage
    if (p.properties.Language.select.name === 'English') {
      return v
    }
  }).map(v => {
    const p = v as DBPage
    return build(p)
  })

  return { ja, en }
}

export const GetBlogs = async (q: QueryDatabaseParameters): Promise<Blog[]> => {
  const { results } = await FetchDatabase(q)
  return results.map(v => {
    const p = v as DBPage
    return build(p)
  })
}
