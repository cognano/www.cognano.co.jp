import { useState, useEffect } from 'react'
import type { NextPage, GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import t, { lang } from '../../i18n'
import { Content, GetContent } from '../../lib/content'
import { GetMomLibs, GetSubLibs } from '../../lib/il6'
import { Blocks } from 'notionate/dist/components'
import styles from '../../styles/Datasets.module.css'
import Unsplash from '../../components/unsplash'
import Hed from '../../components/hed'
import CreateOgImage from '../../lib/ogimage'
import mermaid from 'mermaid'
import { QueryDatabaseResponseEx } from 'notionate'
import { Table } from 'notionate/dist/components'
//import prism from 'prismjs'

type Props = {
  abstract: Content
  pipeline: Content
  license: Content
  momlibs: Content
  sublibs: Content
  momlibsDb: QueryDatabaseResponseEx
  sublibsDb: QueryDatabaseResponseEx
  ogimage: string
}

export const getStaticProps: GetStaticProps<{}> = async () => {
  const abstract = await GetContent('abstract')
  const pipeline = await GetContent('pipeline')
  const momlibs = await GetContent('mother-libraries')
  const sublibs = await GetContent('sublibraries')
  const license = await GetContent('license')

  const ogimage = await CreateOgImage({
    id: `datasets-il6-${lang}`,
    title: abstract![lang].title,
    desc: abstract![lang].excerpt,
  })

  return {
    props: {
      abstract: abstract![lang],
      pipeline: pipeline![lang],
      momlibs: momlibs![lang],
      sublibs: sublibs![lang],
      momlibsDb: await GetMomLibs(),
      sublibsDb: await GetSubLibs(),
      license: license![lang],
      ogimage,
    }
  }
}

const Il6: NextPage<Props> = ({ abstract, pipeline, momlibs, sublibs, momlibsDb, sublibsDb, license, ogimage }) => {
  mermaid.initialize({ theme: 'neutral' })
  const exModules = { mermaid }

  return (
    <main>
      <Hed title={abstract.title} desc={abstract.excerpt} ogimage={ogimage} />
      <div className="container">
        <h1 className={styles.title}>
          {abstract.title}
        </h1>
        <div className={styles.abstract}>
          <Blocks blocks={abstract.blocks} />
        </div>
        <div className={`button ${styles.allDownloadButton}`}>
          <a>
            {t('datasets.download')}
          </a>
        </div>
      </div>

      <div className="container">
        <div className={styles.pipeline}>
          <h2 className={styles.pipelineTitle}>
            {pipeline.title}
          </h2>
          <div className={styles.pipelineDesc}>
            <Blocks blocks={pipeline.blocks} modules={exModules} />
          </div>
          <div className={styles.downloadButtons}>
            <div className={`button ${styles.downloadButton}`}>
              <p>Script#1</p>
              <a>{t('datasets.download')}</a>
            </div>
            <div className={`button ${styles.downloadButton}`}>
              <p>Script#2</p>
              <a>{t('datasets.download')}</a>
            </div>
            <div className={`button ${styles.downloadButton}`}>
              <p>OTU Table</p>
              <a>{t('datasets.download')}</a>
            </div>
            <div className={`button ${styles.downloadButton}`}>
              <p>Script#3</p>
              <a>{t('datasets.download')}</a>
            </div>
            <div className={`button ${styles.downloadButton}`}>
              <p>Learning Data</p>
              <a>{t('datasets.download')}</a>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.momlibs}>
          <h2 className={styles.momlibsTitle}>
            {momlibs.title}
          </h2>
          <div className={styles.momlibsDesc}>
            <Blocks blocks={momlibs.blocks} />
          </div>
          <div className={styles.momlibsDb}>
            <Table
              db={momlibsDb}
              keys={['Name', 'Sampling site', 'Collection Timing', 'Subject Species', 'Subject Name', 'Subject Sex']}
            />
          </div>
        </div>

        <div className={styles.sublibs}>
          <h2 className={styles.sublibsTitle}>
            {sublibs.title}
          </h2>
          <div className={styles.sublibsDesc}>
            <Blocks blocks={sublibs.blocks} />
          </div>
          <div className={styles.sublibsDb}>
            <Table
              db={sublibsDb}
              keys={['Name', 'Type', 'Antigen']}
            />
          </div>
        </div>

        <div className={`il6-footer ${styles.license}`}>
          <h2>
            {license.title}
          </h2>
          <Blocks blocks={license.blocks} />
        </div>
      </div>
    </main>
  )
}

export default Il6
