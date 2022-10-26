import {
  FetchDatabase,
  RichTextItemResponse,
  SelectPropertyResponse,
  DBPageBase,
  QueryDatabaseParameters,
  ListBlockChildrenResponseEx,
  FetchBlocks,
  PersonUserObjectResponseEx,
} from 'notionate'

type User = {
  name: string
  avatar: string
}

export type LocalizedMember = {
  id: string
  name: string
  role: string
  jobs: string[]
  user: User | null
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
    Role: {
      type: "rich_text"
      rich_text: RichTextItemResponse[]
      id: string
    }
    'Job Categories': {
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
  return {
    id: page.id,
    name: props.Name.title.map(v => v.plain_text).join(',') || '',
    jobs: props['Job Categories'].multi_select.map(v => v.name) || [],
    role: props.Role.rich_text.map(v => v.plain_text).join(',') || '',
    user: props.User.people.length > 0 ? props.User.people.map(v => {
      return { name: v.name, avatar: v.avatar } as User
    })[0] : null,
  }
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
      property: 'Job Categories',
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
  const ja = await Promise.all(jaProps.map(async (v) => {
    const blocks = await FetchBlocks(v.id)
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
  const en = await Promise.all(enProps.map(async (v) => {
    const blocks = await FetchBlocks(v.id)
    return {
      props: v,
      blocks,
    }
  }))

  return { ja, en }
}