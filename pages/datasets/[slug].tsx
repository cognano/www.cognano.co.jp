import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import Image from 'next/image'
import t, { lang } from '../../i18n'
import { Content, GetContent } from '../../lib/content'
import { GetMomLibs, GetSubLibs, GetDatasetMetas, DatasetMetas, Pages } from '../../lib/dataset'
import { Page, Table } from 'rotion/ui'
import { QueryDatabaseResponseEx } from 'rotion'
import styles from '../../styles/Datasets.module.css'
import Unsplash from '../../components/unsplash'
import Hed from '../../components/hed'
import CreateOgImage from '../../lib/ogimage'

type Props = {
  abstract: Content
  columns: Content
  pipeline: Content
  statistics: Content
  license: Content
  momlibs: Content
  sublibs: Content
  subjects: Content
  antigens: Content
  metadata: Content
  momlibsDb: QueryDatabaseResponseEx
  sublibsDb: QueryDatabaseResponseEx
  meta: DatasetMetas
  ogimage: string
}

type Params = {
  slug: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: Pages.map(v => ({ params: { slug: v.slug } }) ),
    fallback: false,
  }
}

const notfoundProps = {
  abstract: null,
  columns: null,
  pipeline: null,
  statistics: null,
  metadata: null,
  momlibs: null,
  sublibs: null,
  subjects: null,
  antigens: null,
  license: null,
  momlibsDb: null,
  sublibsDb: null,
  meta: null,
  ogimage: ''
}

export const getStaticProps: GetStaticProps<Props|{}, Params> = async ({ params }) => {
  if (!params?.slug) {
    return { props: notfoundProps }
  }
  const { slug } = params
  const category = slug

  const [abstract,columns, pipeline, statistics, metadata, momlibs, sublibs, subjects, antigens, license, momlibsDb, sublibsDb, meta] = await Promise.all([
    GetContent('abstract', category),
    GetContent('columns', category),
    GetContent('pipeline', category),
    GetContent('statistics', category),
    GetContent('metadata', category),
    GetContent('mother-libraries', category),
    GetContent('sublibraries', category),
    GetContent('subjects', category),
    GetContent('immunized-antigens', category),
    GetContent('license', category),
    GetMomLibs(slug),
    GetSubLibs(slug),
    GetDatasetMetas(slug),
  ])

  const ogimage = await CreateOgImage({
    id: `datasets-${params?.slug}-${lang}`,
    title: abstract![lang]!.title,
    desc: abstract![lang]!.excerpt,
  })

  return {
    props: {
      abstract: abstract![lang],
      columns: columns![lang],
      pipeline: pipeline![lang],
      statistics: statistics![lang],
      metadata: metadata![lang],
      momlibs: momlibs![lang],
      sublibs: sublibs![lang],
      subjects: subjects![lang],
      antigens: antigens![lang],
      license: license![lang],
      momlibsDb,
      sublibsDb,
      meta,
      ogimage,
    }
  }
}

const Datasets: NextPage<Props> = ({ abstract, columns, pipeline, statistics, metadata, momlibs, sublibs, subjects, antigens, license, momlibsDb, sublibsDb, meta, ogimage }) => {
  return (
    <main>
      <Hed title={abstract.title} desc={abstract.excerpt} ogimage={ogimage} />
      {meta.schema && (
        <Script id="schema.org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(meta.schema) }} />
      )}

      <div className={styles.pageHeader}>
        <div className={styles.cover}>
          <Image src={abstract.cover} fill={true} alt={`${abstract.title} image`} />
          <div className={styles.unsplash}>
            <Unsplash />
          </div>
        </div>
        <div className={styles.abstract}>
          <p className={styles.categoryLabel}>
            <Link href="/datasets">
              {t('datasets.datasets')}
            </Link>
          </p>
          <h1 className={styles.title}>
            {abstract.title}
          </h1>
          <div className={styles.description}>
            <Page blocks={abstract.blocks} />
          </div>
          <div className={styles.download}>
            <div className={`button ${styles.downloadButton}`}>
              <a href={meta.links.dataset.url}>
                {meta.links.dataset.text}
              </a>
            </div>
            {meta.links.dataset.size !== '' && (
              <div className={styles.downloadSize}>
                <span>Size: {meta.links.dataset.size}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {columns && (
      <div className="container">
        <div className={styles.columns}>
          <h2 className={styles.columnsTitle}>
            {columns.title}
          </h2>
          <div className={styles.columnsContent}>
            <Page blocks={columns.blocks} />
          </div>
        </div>
      </div>
      )}

      {pipeline && (
      <div className="container">
        <div className={styles.pipeline}>
          <h2 className={styles.pipelineTitle}>
            {pipeline.title}
          </h2>
          <div className={styles.pipelineDesc}>
            <Page blocks={pipeline.blocks} />
          </div>
          <div className={styles.externalLinks}>
            {meta.links.fasta && (
              <div className={`button ${styles.externalLink}`}>
                <p>{meta.links.fasta.name}</p>
                <a href={meta.links.fasta.url}>
                  {meta.links.fasta.text}
                </a>
              </div>
            )}
            {meta.links.tables && (
              <div className={`button ${styles.externalLink}`}>
                <p>{meta.links.tables.name}</p>
                <a href={meta.links.tables.url}>
                  {meta.links.tables.text}
                </a>
              </div>
            )}
            {meta.links.scripts && (
              <div className={`button ${styles.externalLink}`}>
                <p>{meta.links.scripts.name}</p>
                <a href={meta.links.scripts.url}>
                  {meta.links.scripts.text}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {statistics && (
      <div className="container">
        <div className={styles.statistics}>
          <h2 className={styles.statisticsTitle}>
            {statistics.title}
          </h2>
          <div className={styles.statisticsDesc}>
            <Page blocks={statistics.blocks} />
          </div>
        </div>
      </div>
      )}

      {metadata && (
      <div className="container">
        <div className={styles.metadata}>
          <h2 className={styles.metadataTitle}>
            Metadata
          </h2>
          <div className={styles.metadataDesc}>
            <Page blocks={metadata.blocks} />
          </div>
        </div>
      </div>
      )}

      {momlibs && (
      <div className="container">
        <div className={styles.momlibs}>
          <h3 className={styles.momlibsTitle}>
            {momlibs.title}
          </h3>
          <div className={styles.momlibsDesc}>
            <Page blocks={momlibs.blocks} />
          </div>
          <div className={styles.momlibsDb}>
            <Table db={momlibsDb} keys={['Name', 'Sampling site', 'Collection Timing', 'Subject Species', 'Subject Name', 'Subject Sex']} />
          </div>
        </div>
      </div>
      )}

      {sublibs && (
      <div className="container">
        <div className={styles.sublibs}>
          <h3 className={styles.sublibsTitle}>
            {sublibs.title}
          </h3>
          <div className={styles.sublibsDesc}>
            <Page blocks={sublibs.blocks} />
          </div>
          <div className={`il6-sublibs ${styles.sublibsDb}`}>
            <Table db={sublibsDb} keys={['Name', 'Type', 'Antigen']} />
          </div>
        </div>
      </div>
      )}

      {subjects && (
      <div className="container">
        <div className={styles.subjects}>
          <h3 className={styles.subjectsTitle}>
            {subjects.title}
          </h3>
          <div className={styles.subjectsDesc}>
            <Page blocks={subjects.blocks} />
          </div>
        </div>
      </div>
      )}

      {antigens && (
      <div className="container">
        <div className={styles.antigens}>
          <h3 className={styles.antigensTitle}>
            {antigens.title}
          </h3>
          <div className={styles.antigensDesc}>
            <Page blocks={antigens.blocks} />
          </div>
        </div>
      </div>
      )}

      {license && (
      <div className="container">
        <div className={`il6-footer ${styles.license}`}>
          <h2>
            {license.title}
          </h2>
          <Page blocks={license.blocks} />
        </div>
      </div>
      )}
    </main>
  )
}

export default Datasets
