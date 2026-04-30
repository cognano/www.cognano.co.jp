import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const target = '/collaboration-sample-data-request'

const AntibodiesRedirect: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace(target)
  }, [router])

  return (
    <>
      <Head>
        <meta httpEquiv='refresh' content={`0; url=${target}`} />
        <meta name='robots' content='noindex' />
        <link rel='canonical' href={target} />
      </Head>
      <p className='container'>
        <Link href={target}>{target}</Link>
      </p>
    </>
  )
}

export default AntibodiesRedirect
