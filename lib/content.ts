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
  PageObjectResponseEx,
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
  title: string
  cover: string
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
    if (!pageEn) {
      console.log(`english page with slug "${slug}" not found`)
    }
    if (!pageJa) {
      console.log(`japanese page with slug "${slug}" not found`)
    }
    return undefined
  }

  const propsEn = pageEn as DBPage
  const porEn = pageEn as PageObjectResponseEx
  const en = {
    title: propsEn.properties.Name.title.map(v => v.plain_text).join(','), 
    cover: porEn.cover !== null ? porEn.cover.src : '',
    page: await FetchPage(pageEn.id),
    blocks: await FetchBlocks(pageEn.id),
  }
  const propsJa = pageJa as DBPage
  const porJa = pageJa as PageObjectResponseEx
  const ja = {
    title: propsJa.properties.Name.title.map(v => v.plain_text).join(','),
    cover: porJa.cover !== null ? porJa.cover.src : '',
    page: await FetchPage(pageJa.id),
    blocks: await FetchBlocks(pageJa.id),
  }

  return { en, ja }
}
