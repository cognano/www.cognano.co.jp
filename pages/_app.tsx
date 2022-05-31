import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/header'
import Footer from '../components/footer'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="container">
      <Head>
        <title>Welcome to CogNano</title>
      </Head>

      <div className="header">
        <Header />
      </div>

      <div className="content">
        <Component {...pageProps} />
      </div>

      <div className="footer">
        <Footer />
      </div>

      <style jsx>{`
        .container {
          margin: var(--spacing-20) auto;
          max-width: 1800px;
        }
        .content {
          margin: 0 auto;
        }
      `}</style>
    </div>
  )
}

export default MyApp
