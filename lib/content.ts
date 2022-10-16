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

type DBPage = DBPageBase & {
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
    Published: {
      type: "checkbox"
      checkbox: boolean
      id: string
    }
  }
}

type Content = {
  page: GetPageResponseEx
  blocks: ListBlockChildrenResponseEx
}

export type ContentBilingual = {
  en: Content
  ja: Content
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
  })

  const pageJa = results.find(vv => {
    const v = vv as unknown as DBPage
    return v.properties.Slug.select.name === slug
    && v.properties.Language.select.name === 'Japanese'
    })

  if (!pageEn || !pageJa) {
    return undefined
  }

  const en = {
    page: await FetchPage(pageEn.id),
    blocks: await FetchBlocks(pageEn.id),
  }

  const ja = {
    page: await FetchPage(pageJa.id),
    blocks: await FetchBlocks(pageJa.id),
  }

  return { en, ja }
}
