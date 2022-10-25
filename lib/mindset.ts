import {
  FetchDatabase,
  RichTextItemResponse,
  SelectPropertyResponse,
  DBPageBase,
  QueryDatabaseParameters,
  ListBlockChildrenResponseEx,
  QueryDatabaseResponseEx,
  FetchBlocks,
} from 'notionate'

export type LocalizedMindset = {
  id: string
  title: string
  slug: string
}

export type LocalizedMindsetWithBlocks = {
  props: LocalizedMindset
  blocks: ListBlockChildrenResponseEx
}

export type Mindsets = {
  en: LocalizedMindset[]
  ja: LocalizedMindset[]
}

export type Mindset = {
  en: LocalizedMindsetWithBlocks
  ja: LocalizedMindsetWithBlocks
}

export type DBPage = DBPageBase & {
  properties: {
    Name: {
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

const build = (page: DBPage): LocalizedMindset => {
  const props = page.properties
  return {
    id: page.id,
    title: props.Name.title.map(v => v.plain_text).join(',') || '',
    slug: props.Slug.select.name || '',
  }
}

export const mindsetQuery = {
  database_id: process.env.NOTION_MINDSET_DB_ID,
  sorts: [
    {
      property: 'Slug',
      direction: 'ascending'
    },
    {
      property: 'Language',
      direction: 'descending'
    },
  ]
} as QueryDatabaseParameters

export const GetMindsets = async (): Promise<Mindsets> => {
  const { results } = await FetchDatabase(mindsetQuery)

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

export const GetMindset = async (slug: string): Promise<Mindset> => {
  const { ja, en } = await GetMindsets()
  const jaM = ja.find(m => m.slug === slug)
  const enM = en.find(m => m.slug === slug)
  const jaBlocks = await FetchBlocks(jaM!.id)
  const enBlocks = await FetchBlocks(enM!.id)

  return {
    ja: {
      props: jaM!,
      blocks: jaBlocks,
    },
    en: {
      props: enM!,
      blocks: enBlocks,
    }
  }
}