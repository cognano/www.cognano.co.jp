import type { FC, ReactNode } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSelectedLanguage } from '../i18n' 

type Props = {
  title: string
  desc: string
  ogimage?: string
  children?: ReactNode
}

const Hed: FC<Props> = ({ title, desc, ogimage, children }) => {
  const router = useRouter()
  const { lang } = useSelectedLanguage()
  const t = router.pathname === '/' ? `${title}` : `${title} - COGNANO`
  const defaultUrl = process.env.NODE_ENV === 'development' ? `http://localhost:3000` : `https://www.cognano.co.jp`
  const url = `${defaultUrl}${router.asPath}`

  return (
    <Head>
      <title>{t}</title>
      <meta name="description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={t} />
      <meta property="og:description" content={desc} />
      {ogimage && <meta property="og:image" content={`${defaultUrl}/ogimages/${lang}/${ogimage}`} />}
      {ogimage && <meta property="og:image:width" content="1600" />}
      {ogimage && <meta property="og:image:height" content="630" />}
      <meta property="og:url" content={url} />
      <link rel="canonical" href={url} />
      {children}
    </Head>
  )
}

export default Hed