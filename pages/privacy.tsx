import type { GetStaticProps, NextPage } from 'next'
import { Page } from 'rotion/ui'
import Hed from '../components/hed'
// import { formatDate } from '../lib/date'
import t, { lang } from '../i18n'
import { type Content, type DBPage, GetContent } from '../lib/content'
import CreateOgImage from '../lib/ogimage'

type Props = {
  content: Content
  ogimage: string
}

type Privacy = {
  Name: string
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = await GetContent('privacy')

  if (!content || !content[lang]) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }

  const pageContent = content[lang]!

  const ogimage = await CreateOgImage({
    id: `privacy-${lang}`,
    title: pageContent.title,
    desc: pageContent.excerpt,
  })

  return {
    props: {
      content: pageContent,
      ogimage,
    },
  }
}

const Privacy: NextPage<Props> = ({ content, ogimage }) => {
  const { page } = content
  const { properties } = page as unknown as DBPage
  // const date = formatDate(page.last_edited_time)
  // const modifiedDate = t('privacy.modified').replace('%s', date)
  const title = properties.Name.title
    ? properties.Name.title.map((v) => v.plain_text).join(' ')
    : ''

  return (
    <>
      <Hed title={content.title} desc={content.excerpt} ogimage={ogimage} />

      <header className='container'>
        <h1>{title}</h1>
      </header>

      <section className='container'>
        <Page blocks={content.blocks} />
      </section>
    </>
  )
}

export default Privacy
