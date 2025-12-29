import {
  type DBPageBase,
  type DateResponse,
  FetchDatabase,
  type GetDatabaseParameters,
  type PageObjectResponseEx,
  type QueryDatabaseResponseEx,
  type RichTextItemResponse,
  type SelectPropertyResponse,
} from 'rotion'

export type LocalizedProject = {
  id: string
  title: string
  date: string
  edited: string
  createdTs: number
  lastEditedTs: number
  tags: string[]
  host: string
}

export type Projects = {
  en: LocalizedProject[]
  ja: LocalizedProject[]
}

export type ProjectsOriginal = {
  en: QueryDatabaseResponseEx
  ja: QueryDatabaseResponseEx
}

export type DBPage = DBPageBase & {
  properties: {
    Name: {
      type: 'title'
      title: RichTextItemResponse[]
      id: string
    }
    Language: {
      type: 'select'
      select: SelectPropertyResponse
      id: string
    }
    Date: {
      type: 'date'
      date: DateResponse | null
      id: string
    }
    Tags: {
      type: 'multi_select'
      multi_select: SelectPropertyResponse[]
      id: string
    }
    Host: {
      type: 'rich_text'
      rich_text: RichTextItemResponse[]
      id: string
    }
    Published: {
      type: 'checkbox'
      checkbox: boolean
      id: string
    }
  }
}

const build = (page: DBPage): LocalizedProject => {
  const props = page.properties
  return {
    id: page.id,
    title: props.Name.title.map((v) => v.plain_text).join(',') || '',
    date: props.Date.date?.start || '',
    edited: page.last_edited_time,
    createdTs: Date.parse(page.created_time),
    lastEditedTs: Date.parse(page.last_edited_time),
    tags: props.Tags.multi_select.map((v) => v.name) || [],
    host: props.Host.rich_text.map((v) => v.plain_text).join(',') || '',
  }
}

export const projectsQuery = {
  database_id: process.env.NOTION_PROJECT_DB_ID,
  filter: {
    and: [
      {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      {
        property: 'Tags',
        multi_select: {
          does_not_contain: 'News',
        },
      },
    ],
  },
  sorts: [
    {
      property: 'Date',
      direction: 'descending',
    },
  ],
} as GetDatabaseParameters

// Double value because it is bilingual, Actually 5
export const projectsQueryLatest = { ...projectsQuery, page_size: 10 }

export const GetProjects = async (
  q: GetDatabaseParameters,
): Promise<Projects> => {
  const { results } = await FetchDatabase(q)

  const ja = results
    .filter((v) => {
      const p = v as DBPage
      if (p.properties.Language.select.name === 'Japanese') {
        return v
      }
    })
    .map((v) => {
      const p = v as DBPage
      return build(p)
    })

  const en = results
    .filter((v) => {
      const p = v as DBPage
      if (p.properties.Language.select.name === 'English') {
        return v
      }
    })
    .map((v) => {
      const p = v as DBPage
      return build(p)
    })

  return { ja, en }
}

export const GetProjectsOriginal = async (
  q: GetDatabaseParameters,
): Promise<ProjectsOriginal> => {
  const jadb = await FetchDatabase(q)
  const endb = await FetchDatabase(q)

  jadb.results = jadb.results
    .filter((v) => {
      const p = v as DBPage
      if (p.properties.Language.select.name === 'Japanese') {
        return v
      }
    })
    .filter((v) => v) as PageObjectResponseEx[]

  endb.results = endb.results
    .filter((v) => {
      const p = v as DBPage
      if (p.properties.Language.select.name === 'English') {
        return v
      }
    })
    .filter((v) => v) as PageObjectResponseEx[]

  return { ja: jadb, en: endb }
}
