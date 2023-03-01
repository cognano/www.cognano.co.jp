import type { NextPage, GetStaticProps } from 'next'
import Image from 'next/image'
import { lang } from '../i18n'
import { Content, GetContent } from '../lib/content'
import { Blocks } from 'notionate/dist/components'
import styles from '../styles/Research.module.css'
import Unsplash from '../components/unsplash'
import Hed from '../components/hed'
import CreateOgImage from '../lib/ogimage'

type Props = {
  research: Content
  tnbc: Content
  vhh: Content
  covid: Content
  ogimage: string
}

export const getStaticProps: GetStaticProps<{}> = async () => {
  const research = await GetContent('research')
  const tnbc = await GetContent('tnbc')
  const vhh = await GetContent('vhh-antibody')
  const covid = await GetContent('covid-19')

  const ogimage = await CreateOgImage({
    id: 'research',
    title: research![lang].title,
    desc: research![lang].excerpt,
  })

  return {
    props: {
      research: research![lang],
      tnbc: tnbc![lang],
      vhh: vhh![lang],
      covid: covid![lang],
      ogimage,
    }
  }
}

const Research: NextPage<Props> = ({ research, tnbc, vhh, covid, ogimage }) => {
  return (
    <main>
      <Hed title={research.title} desc={research.excerpt} ogimage={ogimage} />
      <div className="container">
        <h1>
          {research.title}
        </h1>
        <div>
          <Blocks blocks={research.blocks} />
        </div>
      </div>

      <div className="container">
        <div className={styles.researches}>
          <div className={styles.research}>
            <div className={styles.researchTitle}>
              <h2>{vhh.title}</h2>
              <span></span>
            </div>
            <p className={styles.researchCover}>
              <span className={styles.vhhCover}>
                <Image src={vhh.cover} fill={true} alt={vhh.title} />
              </span>
            </p>
            <div className={styles.researchDesc}>
              <Blocks blocks={vhh.blocks} />
            </div>
          </div>

          <div className={styles.research}>
            <div className={styles.researchTitle}>
              <h2>{covid.title}</h2>
              <span></span>
            </div>
            <p className={styles.researchCover}>
              <Image src={covid.cover} fill={true} alt={covid.title} />
            </p>
            <div className={styles.researchDesc}>
              <Blocks blocks={covid.blocks} />
            </div>
          </div>

          <div className={styles.research}>
            <div className={styles.researchTitle}>
              <h2>{tnbc.title}</h2>
              <span></span>
            </div>
            <p className={styles.researchCover}>
              <Image src={tnbc.cover} fill={true} alt={tnbc.title} />
            </p>
            <div className={styles.researchDesc}>
              <Blocks blocks={tnbc.blocks} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Research
