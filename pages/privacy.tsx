import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getPages, WPPage } from '../lib/data'

type Props = {
  page?: WPPage
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const pages = await getPages()
  const page = pages.find(p => p.node.slug === `${locale}-privacy`)
  if (page) {
    return {
      props: {
        page
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

type Tex = {
  [key: string]: string
}
const text: Tex = {
  en: `This privacy policy was last modified on %s.`,
  ja: `このプライバシーポリシーの最終更新日は%sです。`,
}

const Privacy: NextPage<Props> = ({ page }) => {
  const p = page!
  const { locale } = useRouter()
  const msec = Date.parse(p.node.modified)
  const d = new Date(msec)
  const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dateformat = locale === 'en' ? `${d.getDate()}st ${m[d.getMonth()]} ${d.getFullYear()}` : `${d.getFullYear()}年${d.getMonth()}月${d.getDate()}日`
  const modifiedDate = text[`${locale}`].replace('%s', dateformat)

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
