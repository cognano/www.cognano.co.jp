import { useState, useEffect } from 'react'
import type { NextPage, GetStaticProps } from 'next'
import Image from 'next/image'
import t, { lang } from '../../i18n'
import { Content, GetContent } from '../../lib/content'
import { Blocks } from 'notionate/dist/components'
import styles from '../../styles/Datasets.module.css'
import Unsplash from '../../components/unsplash'
import Hed from '../../components/hed'
import CreateOgImage from '../../lib/ogimage'
import mermaid from 'mermaid'
//import prism from 'prismjs'

type Props = {
  abstract: Content
  scripts: Content
  info: Content
  ogimage: string
}

export const getStaticProps: GetStaticProps<{}> = async () => {
  const abstract = await GetContent('il6-abstract')
  const scripts = await GetContent('il6-scripts')
  const info = await GetContent('il6-info')

  const ogimage = await CreateOgImage({
    id: `datasets-il6-${lang}`,
    title: abstract![lang].title,
    desc: abstract![lang].excerpt,
  })

  return {
    props: {
      abstract: abstract![lang],
      scripts: scripts![lang],
      info: info![lang],
      ogimage,
    }
  }
}

const Il6: NextPage<Props> = ({ abstract, scripts, info, ogimage }) => {
  mermaid.initialize({ theme: 'neutral' })
  const exModules = { mermaid }

  return (
    <main>
      <Hed title={abstract.title} desc={abstract.excerpt} ogimage={ogimage} />
      <div className="container">
        <h1 className={styles.il6Title}>
          {abstract.title}
        </h1>
        <div className={styles.il6Abstract}>
          <Blocks blocks={abstract.blocks} />
        </div>
        <div className={`button ${styles.il6AllDownloadButton}`}>
          <a>
            {t('datasets.download')}
          </a>
        </div>
      </div>

      <div className="container">
        <div className={styles.il6Scripts}>
          <Blocks blocks={scripts.blocks} modules={exModules} />
          <div className={styles.il6ScriptDownloadButtons}>
            <div className={`button ${styles.il6ScriptDownloadButton}`}>
              <p>Script#1</p>
              <a>{t('datasets.download')}</a>
            </div>
            <div className={`button ${styles.il6ScriptDownloadButton}`}>
              <p>Script#2</p>
              <a>{t('datasets.download')}</a>
            </div>
            <div className={`button ${styles.il6ScriptDownloadButton}`}>
              <p>OTU Table</p>
              <a>{t('datasets.download')}</a>
            </div>
            <div className={`button ${styles.il6ScriptDownloadButton}`}>
              <p>Script#3</p>
              <a>{t('datasets.download')}</a>
            </div>
            <div className={`button ${styles.il6ScriptDownloadButton}`}>
              <p>Learning Data</p>
              <a>{t('datasets.download')}</a>
            </div>
          </div>
        </div>
        <div className={`il6-footer ${styles.il6Footer}`}>
          <Blocks blocks={info.blocks} />
        </div>
      </div>
    </main>
  )
}

export default Il6
