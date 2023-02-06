import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '../lib/date'
import t, { lang } from '../i18n'
import { GetContent, Content } from '../lib/content'
import { Blocks } from 'notionate/dist/components'
import styles from '../styles/Privacy.module.css'
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
    id: 'privacy',
    title: content![lang].title,
    desc: content![lang].excerpt,
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
    <main className="container">
      <Hed title={content.title} desc={content.excerpt} ogimage={ogimage} />
      <div className={styles.privacy}>
        <h1>{title}</h1>
        <div className={styles.privacyContent}>
          <Blocks blocks={content.blocks} />
        </div>
      </div>
    </main>
  )
}

export default Privacy
