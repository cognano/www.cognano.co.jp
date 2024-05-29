import 'rotion/style-without-dark.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Cookie from '../components/cookie'
import Header from '../components/header'
import Footer from '../components/footer'
import { notosans, notoserif } from '../lib/fonts'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>COGNANO is VHH antibody designing and manufacturing</title>
        <meta name="description" content="COGNANO is VHH antibody designing and manufacturing" />
        <link rel="manifest" href="/favicons/site.webmanifest"></link>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="icon" type="image/x-icon" sizes="16x16" href="data:image/png;base64,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"></link>
        <link rel="icon" type="image/x-icon" sizes="32x32" href="data:image/png;base64,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"></link>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
      </Head>
      <Header />
      <Component {...pageProps} />
      <Footer />
      <Cookie />
      <style jsx global>{`
        :root {
          --fontFamily-sans: ${notosans.style.fontFamily};
          --fontFamily-serif: ${notoserif.style.fontFamily};
        }
      `}</style>
    </>
  )
}

export default MyApp
