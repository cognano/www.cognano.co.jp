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
import { Dataset, WithContext } from 'schema-dts'
import Script from 'next/script'
//import prism from 'prismjs'

type Props = {
  abstract: Content
  columns: Content
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
  const columns = await GetContent('columns')
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
      columns: columns![lang],
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

const Il6: NextPage<Props> = ({ abstract, columns, pipeline, statistics, momlibs, sublibs, momlibsDb, sublibsDb, license, ogimage }) => {
  //mermaid.initialize({ theme: 'neutral' })
  //const exModules = { mermaid }
  const schema: WithContext<Dataset> = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Alpaca derived Antigen-VHH Interaction Dataset for IL-6 protein",
    alternateName: ["AVIDa-hIL6"],
    identifier: {
      "@id": "https://doi.org/10.5281/zenodo.7935862",
      "@type": "PropertyValue",
      propertyID: "https://registry.identifiers.org/registry/doi",
      value: "10.5281/zenodo.7935862",
      url: "https://doi.org/10.5281/zenodo.7935862",
    },
    description:
      "AVIDa-hIL6 is an antigen-variable domain of heavy chain-only antibody (VHH) interaction dataset produced by an alpaca immunized with the human IL-6 protein. All antigen-VHH pairs have reliable labels for binding or non-binding generated by our labeling method that combines affinity selection and statistical tests. AVIDa-hIL6 contains 573,891 antigen-VHH pairs, including 20,980 binding pairs, with their amino acid sequences by taking advantage of the simple structure of VHH that facilitates the identification of amino acid sequences by DNA sequencing technology. Furthermore, AVIDa-hIL6 also contains wild-type and 30 different mutants of IL-6 protein as an antigen and many sensitive cases in which point mutations in the IL-6 protein enhance or inhibit antibody binding. AVIDa-hIL6 will serve as a valuable benchmark for machine learning research in the growing field of the prediction of antigen-antibody interactions.",
    url: "https://avida-hil6.cognanous.com",
    version: "1.0.0",
    sameAs: [
      "https://doi.org/10.5281/zenodo.7935862",
      "https://zenodo.org/record/7935862",
      "https://github.com/cognano/AVIDa-hIL6",
    ],
    datePublished: "2023-06-01",
    creator: [
      {
        "@type": "Person",
        name: "Hirofumi Tsuruta",
        affiliation: "COGNANO, Inc.",
      },
      {
        "@type": "Person",
        name: "Hiroyuki Yamazaki",
        affiliation: "COGNANO, Inc.",
      },
      {
        "@type": "Person",
        name: "Ryota Maeda",
        affiliation: "COGNANO, Inc.",
      },
      {
        "@type": "Person",
        name: "Akihiro Imura",
        affiliation: "COGNANO, Inc.",
      },
      {
        "@type": "Organization",
        name: "COGNANO, Inc.",
        url: "https://cognanous.com",
      },
    ],
    contributor: [
      {
        "@type": "Person",
        name: "Ryotaro Tamura",
        affiliation: "COGNANO, Inc.",
      },
      {
        "@type": "Person",
        name: "Tomohida Oda",
      },
    ],
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "CSV",
        contentUrl:
          "https://zenodo.org/api/files/050d4762-defa-41ef-b61d-f71b8aa7b3e4/il6_aai_dataset.csv",
      },
      {
        "@type": "DataDownload",
        encodingFormat: "gz",
        contentUrl:
          "https://zenodo.org/api/files/050d4762-defa-41ef-b61d-f71b8aa7b3e4/libtable.tar.gz",
      },
    ],
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    keywords: ["VHH", "Antigen-antibody interaction"],
  };

  return (
    <main>
      <Hed title={abstract.title} desc={abstract.excerpt} ogimage={ogimage} />
      <Script
        id="schema.org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
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
            <span>Size: 220MB</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.columns}>
          <h2 className={styles.columnsTitle}>
            {columns.title}
          </h2>
          <div className={styles.columnsContent}>
            <Blocks blocks={columns.blocks} />
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
              <Link href="https://drive.google.com/drive/folders/1-Sd5Rdl0-WJSuhsTpIHN-ud3SwSR1WP-">
                Open Google Drive
              </Link>
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
        <div className={styles.metadata}>
          <h2 className={styles.metadataTitle}>Metadata</h2>
        </div>

        <div className={styles.momlibs}>
          <h3 className={styles.momlibsTitle}>
            {momlibs.title}
          </h3>
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
          <h3 className={styles.sublibsTitle}>
            {sublibs.title}
          </h3>
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
