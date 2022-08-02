import {
  FetchDatabase,
  FetchBlocks,
  FetchPage,
} from 'notionate'

export const GetContent = async (slug: string) => {
  const { results } = await FetchDatabase(process.env.NOTION_PAGES_DB_ID as string)

  const pageEn = results.find(v => {
    return v.properties.Slug.select.name === slug
    && v.properties.Language.select.name === 'English'
  })

  const pageJa = results.find(v => {
    return v.properties.Slug.select.name === slug
    && v.properties.Language.select.name === 'Japanese'
  })

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
