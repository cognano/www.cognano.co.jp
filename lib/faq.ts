import {
  FetchDatabase,
  FetchBlocks,
  RichTextItemResponse,
  SelectPropertyResponse,
  DBPageBase,
  QueryDatabaseParameters,
  ListBlockChildrenResponseEx,
} from 'rotion'

export type LocalizedFAQ = {
  id: string
  question: string
  slug: string
  last_edited_time: string
}

export type LocalizedFAQWithBlocks = LocalizedFAQ & {
  blocks: ListBlockChildrenResponseEx
}

export type FAQ = {
  en: LocalizedFAQWithBlocks[]
  ja: LocalizedFAQWithBlocks[]
}

export type DBPage = DBPageBase & {
  properties: {
    Question: {
      type: "title"
      title: RichTextItemResponse[]
      id: string
    }
    Language: {
      type: "select"
      select: SelectPropertyResponse
      id: string
    }
    Slug: {
      type: "select"
      select: SelectPropertyResponse
      id: string
    }
  }
}

const build = (page: DBPage): LocalizedFAQ => {
  const props = page.properties
  return {
    id: page.id,
    question: props.Question.title.map(v => v.plain_text).join(',') || '',
    slug: props.Slug.select.name || '',
    last_edited_time: page.last_edited_time,
  }
}

export const faqQuery = {
  database_id: process.env.NOTION_FAQ_DB_ID,
  sorts: [
    {
      property: 'Slug',
      direction: 'ascending'
    },
    {
      property: 'Language',
      direction: 'ascending'
    },
  ]
} as QueryDatabaseParameters

export const GetFAQs = async (): Promise<FAQ> => {
  const { results } = await FetchDatabase(faqQuery)

  const jaP = results.filter(v => {
    const p = v as DBPage
    if (p.properties.Language.select.name === 'Japanese') {
      return v
    }
  }).map(v => {
    const p = v as DBPage
    return build(p)
  })

  const ja: LocalizedFAQWithBlocks[] = []
  for (const p of jaP) {
    const blocks = await FetchBlocks({ block_id: p.id, last_edited_time: p.last_edited_time })
    ja.push({ ...p, ...{ blocks }})
  }

  const enP = results.filter(v => {
    const p = v as DBPage
    if (p.properties.Language.select.name === 'English') {
      return v
    }
  }).map(v => {
    const p = v as DBPage
    return build(p)
  })

  const en: LocalizedFAQWithBlocks[] = []
  for (const p of enP) {
    const blocks = await FetchBlocks({ block_id: p.id, last_edited_time: p.last_edited_time })
    en.push({ ...p, ...{ blocks }})
  }

  return { ja, en }
}
