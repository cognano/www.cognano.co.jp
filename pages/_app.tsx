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
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
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
