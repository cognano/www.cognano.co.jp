import {
  type DBPageBase,
  FetchDatabase,
  type GetDatabaseParameters,
  type ListBlockChildrenResponseEx,
  type RichTextItemResponse,
  type SelectPropertyResponse,
} from 'rotion'

export type LocalizedQE = {
  id: string
  title: string
  number: string
  unit: string
  slug: string
}

export type LocalizedQEWithBlocks = {
  props: LocalizedQE
  blocks: ListBlockChildrenResponseEx
}

export type QE = {
  en: LocalizedQE[]
  ja: LocalizedQE[]
}

export type QEWithBlocks = {
  en: LocalizedQEWithBlocks
  ja: LocalizedQEWithBlocks
}

export type DBPage = DBPageBase & {
  properties: {
    Name: {
      type: 'title'
      title: RichTextItemResponse[]
      id: string
    }
    Number: {
      type: 'rich_text'
      rich_text: RichTextItemResponse[]
      id: string
    }
    Unit: {
      type: 'rich_text'
      rich_text: RichTextItemResponse[]
      id: string
    }
    Language: {
      type: 'select'
      select: SelectPropertyResponse
      id: string
    }
    Slug: {
      type: 'select'
      select: SelectPropertyResponse
      id: string
    }
  }
}

const build = (page: DBPage): LocalizedQE => {
  const props = page.properties
  return {
    id: page.id,
    title: props.Name.title.map((v) => v.plain_text).join(',') || '',
    number: props.Number.rich_text.map((v) => v.plain_text).join(',') || '',
    unit: props.Unit.rich_text.map((v) => v.plain_text).join(',') || '',
    slug: props.Slug.select.name || '',
  }
}

export const qeQuery = {
  database_id: process.env.NOTION_QE_DB_ID,
  sorts: [
    {
      property: 'Slug',
      direction: 'ascending',
    },
    {
      property: 'Language',
      direction: 'ascending',
    },
  ],
} as GetDatabaseParameters

export const GetQEs = async (): Promise<QE> => {
  const { results } = await FetchDatabase(qeQuery)

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
