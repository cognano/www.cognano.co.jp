import {
  FetchDatabase,
  RichTextItemResponse,
  SelectPropertyResponse,
  DBPageBase,
  QueryDatabaseParameters,
  ListBlockChildrenResponseEx,
  FetchBlocks,
  PersonUserObjectResponseEx,
  PageObjectResponseEx,
} from 'rotion'

type User = {
  name: string
  avatar: string
}

export type LocalizedMember = {
  id: string
  name: string
  title: string
  roles: string[]
  user: User | null
  cover: string | null
  excerpt: string | null
  last_edited_time: string
}

export type LocalizedMemberWithBlocks = {
  props: LocalizedMember
  blocks: ListBlockChildrenResponseEx
}

export type Members = {
  en: LocalizedMemberWithBlocks[]
  ja: LocalizedMemberWithBlocks[]
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
    Title: {
      type: "rich_text"
      rich_text: RichTextItemResponse[]
      id: string
    }
    Roles: {
      type: "multi_select"
      multi_select: SelectPropertyResponse[]
      id: string
    }
    User: {
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

const build = (page: DBPage): LocalizedMember => {
  const props = page.properties
  const p = page as unknown as PageObjectResponseEx

  return {
    id: page.id,
    name: props.Name.title.map(v => v.plain_text).join(',') || '',
    roles: props.Roles.multi_select.map(v => v.name) || [],
    title: props.Title.rich_text.map(v => v.plain_text).join(',') || '',
    user: props.User.people.length > 0 ? props.User.people.map(v => {
      return { name: v.name, avatar: v.avatar } as User
    })[0] : null,
    cover: (p.icon?.type === 'file' && 'src' in p.icon ? p.icon.src as string : null) || null,
    excerpt: null,
    last_edited_time: page.last_edited_time,
  }
}

export const buildPlainText = (b: ListBlockChildrenResponseEx): string => {
  const richText = b.results.map(v => 'type' in v && v.type === 'paragraph' ? v.paragraph.rich_text : [] )
  const text = richText.map(v => v.map(vv => vv.plain_text)).flat().join('')
  return text
}

const buildExcerpt = (b: ListBlockChildrenResponseEx): string => {
  const max = 60
  const text = buildPlainText(b)
  const excerpt = text.substring(0, max)
  const ellipsis = text.length > max ? '...' : ''
  return `${excerpt}${ellipsis}`
}

export const memberQuery = {
  database_id: process.env.NOTION_MEMBER_DB_ID,
  filter: {
    and: [
      {
        property: 'Published',
        checkbox: {
          equals: true
        }
      }
    ]
  },
  sorts: [
    {
      property: 'Number',
      direction: 'ascending'
    },
    {
      property: 'Language',
      direction: 'descending'
    },
  ]
} as QueryDatabaseParameters

export const GetMembers = async (): Promise<Members> => {
  const { results } = await FetchDatabase(memberQuery)

  const jaProps = results.filter(v => {
    const p = v as DBPage
    if (p.properties.Language.select.name === 'Japanese') {
      return v
    }
  }).map(v => {
    const p = v as DBPage
    return build(p)
  })

  const ja = await Promise.all(jaProps.map(async (v: LocalizedMember) => {
    const blocks = await FetchBlocks({ block_id: v.id, last_edited_time: v.last_edited_time })
    v.excerpt = buildExcerpt(blocks)
    return {
      props: v,
      blocks,
    }
  }))

  const enProps = results.filter(v => {
    const p = v as DBPage
    if (p.properties.Language.select.name === 'English') {
      return v
    }
  }).map(v => {
    const p = v as DBPage
    return build(p)
  })

  const en = await Promise.all(enProps.map(async (v: LocalizedMember) => {
    const blocks = await FetchBlocks({ block_id: v.id, last_edited_time: v.last_edited_time })
    v.excerpt = buildExcerpt(blocks)
    return {
      props: v,
      blocks,
    }
  }))

  return { ja, en }
}
