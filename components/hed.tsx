import type { FC, ReactNode } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { lang } from '../i18n' 

type Props = {
  title: string
  desc: string
  suffix?: string
  ogimage?: string
  children?: ReactNode
}

const Hed: FC<Props> = ({ title, suffix, desc, ogimage, children }) => {
  const router = useRouter()
  const t = router.pathname === '/' ? `${title}` : `${title} - COGNANO${suffix ? ` ${suffix}` : ''}`
  const usdomain = `cognanous.com`
  const jpdomain = `www.cognano.co.jp`
  const defaultUrl = process.env.NODE_ENV === 'development' ? `http://localhost:3000` :  `https://${lang === 'en' ? usdomain : jpdomain}`
  const url = `${defaultUrl}${router.asPath}`
  const image = `${defaultUrl}/ogimages/${ogimage}`

  return (
    <Head>
      <title>{t}</title>
      <meta name="description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={t} />
      <meta property="og:description" content={desc} />
      {ogimage && <meta property="og:image" content={image} />}
      {ogimage && <meta property="og:image:width" content="1200" />}
      {ogimage && <meta property="og:image:height" content="630" />}
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@cognano_inc" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={url} />
      {children}
    </Head>
  )
}

export default Hed