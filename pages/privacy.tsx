import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { formatDate } from '../lib/date'
import { useTranslation, useSelectedLanguage } from '../i18n'
import { GetContent, ContentBilingual } from '../lib/content'
import { Blocks } from 'notionate/dist/components'
import { GetPageResponse, PageObjectResponse } from 'notionate'
import styles from '../styles/Privacy.module.css'

type Props = {
  content: ContentBilingual
}

type Privacy = {
  Name: string
}

export const getStaticProps: GetStaticProps = async () => {
  const content = await GetContent('privacy')

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
    }
  }
}

const Privacy: NextPage<Props> = ({ content }) => {
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
