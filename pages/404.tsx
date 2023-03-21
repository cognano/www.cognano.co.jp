import type { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Hed from '../components/hed'
import t from '../i18n'
import CreateOgImage from '../lib/ogimage'
import styles from '../styles/Home.module.css'
import Unsplash from '../components/unsplash'
import { lang } from '../i18n'

type Props = {
  title: string
  desc: string
  ogimage?: string
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const ogimage = await CreateOgImage({
    id: `404-${lang}`,
    title: t('404.title'),
  })
  return {
    props: {
      ogimage,
      title: t('error404.title'),
      desc: t('error404.description'),
    },
    revalidate: 10
  }
}

const Notfound: NextPage<Props> = ({ ogimage, title, desc }) => {
  return (
    <>
      <Hed title={title} desc={desc} ogimage={ogimage} />
      <header className="container">
        <h1>{title}</h1>
        <p>{desc}</p>
      </header>

      <section className={styles.error404}>
        <div className={styles.error404Image}>
          <Image src="images/shark-crossing.jpg" fill={true} alt="shark crossing" />
          <div className={styles.error404ImageCopy}>
            <Unsplash href="https://unsplash.com/@nerikaren?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" name="Karen Neri"/>
          </div>
        </div>
        <p className={styles.error404BackHome}>
          <Link href="/">
            {t('error404.gohome')}
          </Link>
        </p>
      </section>
    </>
  )
}

export default Notfound
