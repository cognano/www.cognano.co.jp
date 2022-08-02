import {
  FetchDatabase,
  DateResponse,
  RichText,
  SelectPropertyResponse,
  GetPageResponseEx,
  DBPageBase,
} from 'notionate'

export type Blog = {
  id: string
  title: string
  date: string
  edited: string
  slug: string
  createdTs: number
  lastEditedTs: number
  tags: string[]
  writers: string[]
  excerpt: string
}

type DBPage = DBPageBase & {
  properties: {
    Name: {
      type: "title"
      title: Array<RichText>
      id: string
    }
    Slug: {
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
      multi_select: Array<SelectPropertyResponse>
      id: string
    }
    Writers: {
      type: "people"
      people: Array
      id: string
    }
    Excerpt: {
      type: "rich_text"
      rich_text: Array<RichText>
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
    title: props.Name.title.map(v => v.text.content).join(',') || '',
    slug: props.Slug.select.name || '',
    date: props.Date.date?.start,
    edited: page.last_edited_time,
    createdTs: Date.parse(page.created_time),
    lastEditedTs: Date.parse(page.last_edited_time),
    tags: props.Tags.multi_select.map(v => v.name) || [],
    writers: props.Writers.people.map(v => v.name) || [],
    excerpt: props.Excerpt.rich_text.map(v => v.text.content).join(',') || '',
  }
}

export const GetBlogs = async (): Blog[] => {
  const { results } = await FetchDatabase(process.env.NOTION_BLOG_DB_ID as string)
  return results.map(v => {
    return build(v)
  })
}
