import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getPages, WPPage } from '../lib/data'
import { formatDate } from '../lib/date'
import { useTranslation, useSelectedLanguage } from '../i18n'

type Props = {
  enPage?: WPPage
  jaPage?: WPPage
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const pages = await getPages()
  const enPage = pages.find(p => p.node.slug === `en-privacy`)
  const jaPage = pages.find(p => p.node.slug === `ja-privacy`)

  if (enPage || jaPage) {
    return {
      props: {
        enPage,
        jaPage,
      }
    }
  }

  return {
    props: {},
    redirect: {
      destination: '/404'
    }
  }
}

const Privacy: NextPage<Props> = ({ enPage, jaPage }) => {
  const { t } = useTranslation()
  const { lang } = useSelectedLanguage()

  const p = lang === 'en' ? enPage! : jaPage!
  const date = formatDate(p.node.modified, lang)
  const modifiedDate = t('privacy.modified').replace('%s', date)

  return (
    <>
      <div className="privacy">
        <h1>{p.node.title}</h1>
        <p className="callout"><span role="img" aria-label="bulb">💡</span> {modifiedDate}</p>
        <div className="privacy-content">
          <div dangerouslySetInnerHTML={{ __html: p.node.content }} />
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
