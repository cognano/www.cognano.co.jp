import type { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import { Page } from 'rotion/ui'
import Hed from '../components/hed'
import { lang } from '../i18n'
import { type Content, GetContent } from '../lib/content'
import CreateOgImage from '../lib/ogimage'
import styles from '../styles/Research.module.css'

type Props = {
  research: Content
  tnbc: Content
  vhh: Content
  covid: Content
  ogimage: string
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [research, tnbc, vhh, covid] = await Promise.all([
    GetContent('research'),
    GetContent('tnbc'),
    GetContent('vhh-antibody'),
    GetContent('covid-19'),
  ])

  const researchContent = research![lang]!
  const tnbcContent = tnbc![lang]!
  const vhhContent = vhh![lang]!
  const covidContent = covid![lang]!

  const ogimage = await CreateOgImage({
    id: `research-${lang}`,
    title: researchContent.title,
    desc: researchContent.excerpt,
  })

  return {
    props: {
      research: researchContent,
      tnbc: tnbcContent,
      vhh: vhhContent,
      covid: covidContent,
      ogimage,
    },
  }
}

const Research: NextPage<Props> = ({ research, tnbc, vhh, covid, ogimage }) => {
  return (
    <main>
      <Hed title={research.title} desc={research.excerpt} ogimage={ogimage} />
      <div className='container'>
        <h1>{research.title}</h1>
        <div>
          <Page blocks={research.blocks} />
        </div>
      </div>

      <div className='container'>
        <div className={styles.researches}>
          <div className={styles.research}>
            <div className={styles.researchTitle}>
              <h2>{vhh.title}</h2>
              <span />
            </div>
            <p className={styles.researchCover}>
              <span className={styles.vhhCover}>
                <Image src={vhh.cover} fill={true} alt={vhh.title} />
              </span>
            </p>
            <div className={styles.researchDesc}>
              <Page blocks={vhh.blocks} />
            </div>
          </div>

          <div className={styles.research}>
            <div className={styles.researchTitle}>
              <h2>{covid.title}</h2>
              <span />
            </div>
            <p className={styles.researchCover}>
              <Image src={covid.cover} fill={true} alt={covid.title} />
            </p>
            <div className={styles.researchDesc}>
              <Page blocks={covid.blocks} />
            </div>
          </div>

          <div className={styles.research}>
            <div className={styles.researchTitle}>
              <h2>{tnbc.title}</h2>
              <span />
            </div>
            <p className={styles.researchCover}>
              <Image src={tnbc.cover} fill={true} alt={tnbc.title} />
            </p>
            <div className={styles.researchDesc}>
              <Page blocks={tnbc.blocks} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Research
