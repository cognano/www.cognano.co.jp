import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { formatDate } from '../lib/date'
import { useTranslation, useSelectedLanguage } from '../i18n'
import { GetContent } from '../lib/content'
import { Blocks } from 'notionate/dist/components'
import { GetPageResponseEx } from 'notionate'

type Props = {
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = await GetContent('privacy')
  console.log(content.en.blocks)

  return {
    props: {
      content,
    }
  }

  return {
    props: {},
    redirect: {
      destination: '/404'
    }
  }
}

const Privacy: NextPage<Props> = ({ content }) => {
  const { t } = useTranslation()
  const { lang } = useSelectedLanguage()

  const privacy = lang === 'en' ? content.en : content.ja
  const date = formatDate(privacy.page.last_edited_time, lang)
  const modifiedDate = t('privacy.modified').replace('%s', date)

  return (
    <>
      <div className="privacy">
        <h1>{privacy.page.properties.Name.title.map(v => v.text.content).join(',')}</h1>
        <p className="callout"><span role="img" aria-label="bulb">💡</span> {modifiedDate}</p>
        <div className="privacy-content">
          <Blocks blocks={privacy.blocks} />
        </div>
      </div>

      <style jsx>{`
        .callout {
          background-color: #eee;
          padding: var(--spacing-6);
          font-family: var(--fontFamily-sans);
        }
        .callout span {
          margin-right: var(--spacing-2);
        }
        .privacy {
          margin: var(--spacing-20) var(--spacing-20);
          padding: var(--spacing-20) 0 var(--spacing-20);
        }
      `}</style>
    </>
  )
}

export default Privacy
