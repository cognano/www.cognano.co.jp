import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getPages } from '../lib/data'

export const getStaticProps: GetStaticProps<{
  pages: WPPage[]
}> = async () => {
  const pages = await getPages()
  return {
    props: {
      pages
    }
  }
}

const text = {
  en: `This privacy policy was last modified on %s.`,
  ja: `このプライバシーポリシーの最終更新日は%sです。`,
}

const Privacy: NextPage = ({ pages }) => {
  const { locale } = useRouter()
  const page = pages.find(p => p.node.slug === `${locale}-privacy`).node
  const msec = Date.parse(page.modified)
  const d = new Date(msec)
  const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dateformat = locale === 'en' ? `${d.getDate()}st ${m[d.getMonth()]} ${d.getFullYear()}` : `${d.getFullYear()}年${d.getMonth()}月${d.getDate()}日`
  const modifiedDate = text[locale].replace('%s', dateformat)

  return (
    <>
      <div className="privacy">
        <h1>{page.title}</h1>
        <p className="callout"><span role="img" aria-label="bulb">💡</span> {modifiedDate}</p>
        <div className="privacy-content">
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
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
