import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '../lib/date'
import { useTranslation, useSelectedLanguage } from '../i18n'
import { GetContent, ContentBilingual } from '../lib/content'
import { Blocks } from 'notionate/dist/components'
import styles from '../styles/Privacy.module.css'
import CreateOgImage from '../lib/ogimage'
import Hed from '../components/hed'

type Props = {
  content: ContentBilingual
  ogimage: string
}

type Privacy = {
  Name: string
}

export const getStaticProps: GetStaticProps = async () => {
  const content = await GetContent('privacy')

  const ogimage = await CreateOgImage({
    id: 'privacy',
    title: {
      en: content!.en.title,
      ja: content!.ja.title,
    },
    desc: {
      en: content!.en.excerpt,
      ja: content!.ja.excerpt,
    },
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
      content,
      ogimage,
    }
  }
}

const Privacy: NextPage<Props> = ({ content, ogimage }) => {
  const { t } = useTranslation()
  const { lang } = useSelectedLanguage()

  const privacy = lang === 'en' ? content.en : content.ja
  const page = privacy.page
  // @ts-ignore
  const date = formatDate(page.last_edited_time, lang)
  const modifiedDate = t('privacy.modified').replace('%s', date)
  // @ts-ignore
  const title = ('properties' in page && page.properties.Name) ? page.properties.Name.title.map(v => v.text.content).join(',') : ''

  return (
    <main className="container">
      <Hed title={privacy.title} desc={privacy.excerpt} ogimage={ogimage} />
      <div className={styles.privacy}>
        <h1>{title}</h1>
        <div className={styles.privacyContent}>
          <Blocks blocks={privacy.blocks} />
        </div>
      </div>
    </main>
  )
}

export default Privacy
