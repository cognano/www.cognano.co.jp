import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/header'
import Footer from '../components/footer'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>CogNano 🦙</title>
        <meta name="description" content="CogNano is VHH antibody designing and manufacturing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="header container">
        <Header />
      </div>

      <div className="content container">
        <Component {...pageProps} />
      </div>

      <Footer />

      <style jsx>{`
        .content {
          margin: 0 auto;
        }
      `}</style>
    </div>
  )
}

export default MyApp
