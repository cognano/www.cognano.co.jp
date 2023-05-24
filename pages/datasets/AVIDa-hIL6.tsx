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
//import mermaid from 'mermaid'
import { QueryDatabaseResponseEx } from 'notionate'
import { Table } from 'notionate/dist/components'
//import prism from 'prismjs'

type Props = {
  abstract: Content
  columnDesc: Content
  pipeline: Content
  statistics: Content
  license: Content
  momlibs: Content
  sublibs: Content
  momlibsDb: QueryDatabaseResponseEx
  sublibsDb: QueryDatabaseResponseEx
  ogimage: string
}

export const getStaticProps: GetStaticProps<{}> = async () => {
  const abstract = await GetContent('abstract')
  const columnDesc = await GetContent('column-descriptions')
  const pipeline = await GetContent('pipeline')
  const statistics = await GetContent('statistics')
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
      columnDesc: columnDesc![lang],
      pipeline: pipeline![lang],
      statistics: statistics![lang],
      momlibs: momlibs![lang],
      sublibs: sublibs![lang],
      momlibsDb: await GetMomLibs(),
      sublibsDb: await GetSubLibs(),
      license: license![lang],
      ogimage,
    }
  }
}

const Il6: NextPage<Props> = ({ abstract, columnDesc, pipeline, statistics, momlibs, sublibs, momlibsDb, sublibsDb, license, ogimage }) => {
  //mermaid.initialize({ theme: 'neutral' })
  //const exModules = { mermaid }

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
        <div className={styles.download}>
          <div className={`button ${styles.downloadButton}`}>
            <a>
              {t('datasets.download')}
            </a>
          </div>
          <div className={styles.downloadSize}>
            <span>Size: 209MB</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.columnDesc}>
          <h2 className={styles.columnDescTitle}>
            {columnDesc.title}
          </h2>
          <div className={styles.columnDescContent}>
            <Blocks blocks={columnDesc.blocks} />
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.pipeline}>
          <h2 className={styles.pipelineTitle}>
            {pipeline.title}
          </h2>
          <div className={styles.pipelineDesc}>
            <Blocks blocks={pipeline.blocks} />
          </div>
          <div className={styles.externalLinks}>
            <div className={`button ${styles.externalLink}`}>
              <p>FASTQ, FASTA Files</p>
              <a>Open Google Drive</a>
            </div>
            <div className={`button ${styles.externalLink}`}>
              <p>Library Tables, Labeled Dataset</p>
              <Link href="https://doi.org/10.5281/zenodo.7935862">
                Open Zenodo
              </Link>
            </div>
            <div className={`button ${styles.externalLink}`}>
              <p>Scripts</p>
              <Link href="https://github.com/cognano/AVIDa-hIL6">
                Open GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.statistics}>
          <h2 className={styles.statisticsTitle}>
            {statistics.title}
          </h2>
          <div className={styles.statisticsDesc}>
            <Blocks blocks={statistics.blocks} />
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
