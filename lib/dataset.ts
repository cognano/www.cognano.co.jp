import {
  FetchDatabase,
  GetDatabaseParameters,
  QueryDatabaseResponseEx,
  RichTextItemResponse,
  SelectPropertyResponse,
  DBPageBase,
  FetchBlocks,
  BlockObjectResponse,
  CodeBlockObjectResponse,
} from 'rotion'
import { Dataset, WithContext } from 'schema-dts'

const momlibid = process.env.NOTION_MOTHERLIBRARIES_DB_ID
const sublibid = process.env.NOTION_SUBLIBRARIES_DB_ID
const linkschemaid = process.env.NOTION_EXTERNALLINKS_AND_SCHEMA_DB_ID

export const Pages = [
  { slug: 'avida-htnfa' },
  { slug: 'avida-hil6' },
  { slug: 'avida-sars-cov-2' },
  { slug: 'vhh-corpus' },
]

export const GetMomLibs = async (name: string): Promise<QueryDatabaseResponseEx> => {
  const q = {
    database_id: momlibid,
    filters: {
      Dataset: { equal: name },
    },
    sorts: [
      { property: 'Name', direction: 'ascending' },
    ]
  } as GetDatabaseParameters
  return FetchDatabase(q)
}

export const GetSubLibs = async (name: string): Promise<QueryDatabaseResponseEx> => {
  const q = {
    database_id: sublibid,
    filters: {
      Dataset: { equal: name },
    },
    sorts: [
      { property: 'Name', direction: 'ascending' },
    ]
  } as GetDatabaseParameters
  return FetchDatabase(q)
}

const GetExternalLinksAndSchemas = async (name: string): Promise<QueryDatabaseResponseEx> => {
  const q = {
    database_id: linkschemaid,
    filters: {
      Dataset: { equal: name },
    },
    sorts: [
      { property: 'Name', direction: 'ascending' },
    ]
  } as GetDatabaseParameters
  return FetchDatabase(q)
}

type ExtLinkSlugs = 'fasta' | 'tables' | 'scripts' | 'dataset'

type ExtLink = {
  name: string
  url: string
  size: string
  text: string
  slug: ExtLinkSlugs
}

export type ExtLinks = Record<ExtLinkSlugs, ExtLink>

export interface DatasetMetas {
  links: ExtLinks
  schema: WithContext<Dataset>
}

type DBProps = DBPageBase & {
  properties: {
    Name: {
      type: "title"
      title: RichTextItemResponse[]
      id: string
    }
    URL: {
      type: "url"
      url: string
      id: string
    }
    Size: {
      type: "rich_text"
      rich_text: RichTextItemResponse[]
      id: string
    }
    Text: {
      type: "rich_text"
      rich_text: RichTextItemResponse[]
      id: string
    }
    Slug: {
      type: "select"
      select: SelectPropertyResponse | null
      id: string
    }
    Dataset: {
      type: "select"
      select: SelectPropertyResponse | null
      id: string
    }
  }
}

const GetSchema = async (block_id: string, last_edited_time: string): Promise<WithContext<Dataset>> => {
  const blocks = await FetchBlocks({ block_id, last_edited_time })
  const { results } = blocks

  const b = results.find(vv => {
    const v = vv as unknown as BlockObjectResponse
    return v.type === 'code'
  }) as CodeBlockObjectResponse | undefined

  if (!b) {
    return {} as WithContext<Dataset>
  }

  const str = b.code.rich_text.map(v => v.plain_text).join('')
    .replaceAll('\n', '')
    .replaceAll(/\s{2,}/g, '')
    .replaceAll(/,}/g, '}')
    .replaceAll(/,]/g, ']')
    .replaceAll(/([a-z][A-z]+):([A-z0-9\s"])/g, '"$1":$2')

  return JSON.parse(str)
}

export const GetDatasetMetas = async (dataset_name: string): Promise<DatasetMetas> => {
  const { results } = await GetExternalLinksAndSchemas(dataset_name)
  let schema = {} as WithContext<Dataset>
  let links = {} as ExtLinks

  for (const vv of results) {
    const v = vv as unknown as DBProps
    const dataset = v.properties.Dataset.select?.name || ''
    if(dataset !== dataset_name) continue

    const slug = v.properties.Slug.select?.name || ''
    if (slug === 'schema') {
      schema = await GetSchema(v.id, v.last_edited_time)
      continue
    }
    const name = v.properties.Name.title.map(v => v.plain_text).join('')
    const url = v.properties.URL.url
    const size = v.properties.Size.rich_text.map(v => v.plain_text).join('')
    const text = v.properties.Text.rich_text.map(v => v.plain_text).join('')

    // @ts-ignore
    links[slug] = { name: name, url, size, slug, text }
  }

  return {
    links,
    schema,
  }
}
