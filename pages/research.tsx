import type { NextPage, GetStaticProps } from 'next'
import { useTranslation, useSelectedLanguage, useLanguageQuery } from '../i18n'
import { ContentBilingual, GetContent } from '../lib/content'
import { Blocks } from 'notionate/dist/components'
import { GetMembers, Members } from '../lib/member'
import styles from '../styles/Research.module.css'
import Unsplash from '../components/unsplash'
import Hed from '../components/hed'
import CreateOgImage from '../lib/ogimage'

type Props = {
  research: ContentBilingual
  tnbc: ContentBilingual
  vhh: ContentBilingual
  covid: ContentBilingual
  ogimage: string
}

export const getStaticProps: GetStaticProps<{}> = async () => {
  const research = await GetContent('research')
  const tnbc = await GetContent('tnbc')
  const vhh = await GetContent('vhh-antibody')
  const covid = await GetContent('covid-19')

  const ogimage = await CreateOgImage({
    id: 'research',
    title: {
      en: research!.en.title,
      ja: research!.ja.title,
    },
    desc: {
      en: research!.en.excerpt,
      ja: research!.ja.excerpt,
    },
  })

  return {
    props: {
      research,
      tnbc,
      vhh,
      covid,
      ogimage,
    }
  }
}

const Research: NextPage<Props> = ({ research, tnbc, vhh, covid, ogimage }) => {
  const { t } = useTranslation()
  const { lang } = useSelectedLanguage()
  const r = lang === 'en' ? research.en : research.ja
  const tn = lang === 'en' ? tnbc.en : tnbc.ja
  const v = lang === 'en' ? vhh.en : vhh.ja
  const c = lang === 'en' ? covid.en : covid.ja

  return (
    <main>
      <Hed title={r.title} desc={r.excerpt} ogimage={ogimage} />
      <div className="container">
        <h1>
          {r.title}
        </h1>
        <div>
          <Blocks blocks={r.blocks} />
        </div>
      </div>

      <div className="container">
        <div className={styles.researches}>
          <div className={styles.research}>
            <div className={styles.researchTitle}>
              <h2>{v.title}</h2>
              <span></span>
            </div>
            <p className={styles.researchCover}>
              <img src={v.cover} />
            </p>
            <div className={styles.researchDesc}>
              <Blocks blocks={v.blocks} />
            </div>
          </div>

          <div className={styles.research}>
            <div className={styles.researchTitle}>
              <h2>{c.title}</h2>
              <span></span>
            </div>
            <p className={styles.researchCover}>
              <img src={c.cover} />
            </p>
            <div className={styles.researchDesc}>
              <Blocks blocks={c.blocks} />
            </div>
          </div>

          <div className={styles.research}>
            <div className={styles.researchTitle}>
              <h2>{tn.title}</h2>
              <span></span>
            </div>
            <p className={styles.researchCover}>
              <img src={tn.cover} />
            </p>
            <div className={styles.researchDesc}>
              <Blocks blocks={tn.blocks} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Research
