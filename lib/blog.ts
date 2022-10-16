import {
  FetchDatabase,
  DateResponse,
  RichTextItemResponse,
  SelectPropertyResponse,
  DBPageBase,
  QueryDatabaseParameters,
  PersonUserObjectResponseEx,
} from 'notionate'

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
  tags: string[]
  writers: Writer[]
  excerpt: string
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
    Excerpt: {
      type: "rich_text"
      rich_text: RichTextItemResponse[]
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
    title: props.Name.title.map(v => v.plain_text).join(',') || '',
    slug: props.Slug.select.name || '',
    date: props.Date.date?.start || '',
    edited: page.last_edited_time,
    createdTs: Date.parse(page.created_time),
    lastEditedTs: Date.parse(page.last_edited_time),
    tags: props.Tags.multi_select.map(v => v.name) || [],
    writers: props.Writers.people.map(v => {
      return { name: v.name, avatar: v.avatar } as Writer
    }) || [],
    excerpt: props.Excerpt.rich_text.map(v => v.plain_text).join(',') || '',
    language: props.Language.select.name || '',
  }
}

export const blogQuery = {
  database_id: process.env.NOTION_BLOG_DB_ID,
  filter: {
    and: [
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
