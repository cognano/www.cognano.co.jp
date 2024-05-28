import type { NextPage, GetStaticProps } from 'next'
import { formatDate } from '../lib/date'
import t, { lang } from '../i18n'
import { GetContent, Content } from '../lib/content'
import { Blocks } from 'notionate/dist/components'
import CreateOgImage from '../lib/ogimage'
import Hed from '../components/hed'

type Props = {
  content: Content
  ogimage: string
}

type Privacy = {
  Name: string
}

export const getStaticProps: GetStaticProps = async () => {
  const content = await GetContent('privacy')

  const ogimage = await CreateOgImage({
    id: `privacy-${lang}`,
    title: content![lang]!.title,
    desc: content![lang]!.excerpt,
  })

  if (!content) {
    return {
      props: {},
      redirect: {
        destination: '/404'
      }
    }
  }

  return {
    props: {
      content: content![lang],
      ogimage,
    }
  }
}

const Privacy: NextPage<Props> = ({ content, ogimage }) => {
  const page = content.page
  // @ts-ignore
  const date = formatDate(page.last_edited_time)
  const modifiedDate = t('privacy.modified').replace('%s', date)
  // @ts-ignore
  const title = ('properties' in page && page.properties.Name) ? page.properties.Name.title.map(v => v.text.content).join(',') : ''

  return (
    <>
      <Hed title={content.title} desc={content.excerpt} ogimage={ogimage} />

      <header className="container">
        <h1>{title}</h1>
      </header>

      <section className="container">
        <Blocks blocks={content.blocks} />
      </section>
    </>
  )
}

export default Privacy
