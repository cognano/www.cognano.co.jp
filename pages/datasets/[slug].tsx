import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Script from 'next/script'
import Image from 'next/image'
import t, { lang } from '../../i18n'
import { Content, GetContent } from '../../lib/content'
import { GetMomLibs, GetSubLibs, GetDatasetMetas, DatasetMetas, Pages } from '../../lib/dataset'
import { Blocks } from 'notionate/dist/components'
import styles from '../../styles/Datasets.module.css'
import Unsplash from '../../components/unsplash'
import Hed from '../../components/hed'
import CreateOgImage from '../../lib/ogimage'
import { QueryDatabaseResponseEx } from 'notionate'
import { Table } from 'notionate/dist/components'
import { notfound } from '../../lib/page-error'

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

export const getStaticProps: GetStaticProps<Props|{}, Params> = async ({ params }) => {
  if (!params?.slug) {
    return notfound
  }
  const { slug } = params
  const category = slug

  const abstract = await GetContent('abstract', category)
  if (!abstract || !abstract.en) {
    return notfound
  }
  const columns = await GetContent('columns', category)
  const pipeline = await GetContent('pipeline', category)
  const statistics = await GetContent('statistics', category)
  const metadata = await GetContent('metadata', category)
  const momlibs = await GetContent('mother-libraries', category)
  const sublibs = await GetContent('sublibraries', category)
  const subjects = await GetContent('subjects', category)
  const antigens = await GetContent('immunized-antigens', category)
  const license = await GetContent('license', category)
  const momlibsDb = await GetMomLibs(slug)
  const sublibsDb = await GetSubLibs(slug)
  const meta = await GetDatasetMetas(slug)

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
      <Script id="schema.org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(meta.schema) }} />

      <div className={styles.pageHeader}>
        <div className={styles.cover}>
          <Image src={abstract.cover} fill={true} alt={`${abstract.title} image`} />
          <div className={styles.unsplash}>
            <Unsplash />
          </div>
        </div>
        <div className={styles.abstract}>
          <h1 className={styles.title}>
            {abstract.title}
          </h1>
          <div className={styles.description}>
            <Blocks blocks={abstract.blocks} />
          </div>
          <div className={styles.download}>
            <div className={`button ${styles.downloadButton}`}>
              <a href={meta.links.dataset.url}>
                {t('datasets.download')}
              </a>
            </div>
            <div className={styles.downloadSize}>
              <span>Size: {meta.links.dataset.size}</span>
            </div>
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
            <Blocks blocks={columns.blocks} />
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
            <Blocks blocks={pipeline.blocks} />
          </div>
          <div className={styles.externalLinks}>
            <div className={`button ${styles.externalLink}`}>
              <p>{t('datasets.fasta')}</p>
              <a href={meta.links.fasta.url}>
                {t('datasets.googleDrive')}
              </a>
            </div>
            <div className={`button ${styles.externalLink}`}>
              <p>{t('datasets.table')}</p>
              <a href={meta.links.tables.url}>
                {t('datasets.zenodo')}
              </a>
            </div>
            <div className={`button ${styles.externalLink}`}>
              <p>{t('datasets.scripts')}</p>
              <a href={meta.links.scripts.url}>
                {t('datasets.github')}
              </a>
            </div>
          </div>
        </div>
      </div>
      )}

      {statistics && (
      <div className={styles.statistics}>
        <h2 className={styles.statisticsTitle}>
          {statistics.title}
        </h2>
        <div className={styles.statisticsDesc}>
          <Blocks blocks={statistics.blocks} />
        </div>
      </div>
      )}

      {metadata && (
      <div className={styles.metadata}>
        <h2 className={styles.metadataTitle}>
          Metadata
        </h2>
        <div className={styles.metadataDesc}>
          <Blocks blocks={metadata.blocks} />
        </div>
      </div>
      )}

      {momlibs && (
      <div className={styles.momlibs}>
        <h3 className={styles.momlibsTitle}>
          {momlibs.title}
        </h3>
        <div className={styles.momlibsDesc}>
          <Blocks blocks={momlibs.blocks} />
        </div>
        <div className={styles.momlibsDb}>
          <Table db={momlibsDb} keys={['Name', 'Sampling site', 'Collection Timing', 'Subject Species', 'Subject Name', 'Subject Sex']} />
        </div>
      </div>
      )}

      {sublibs && (
      <div className={styles.sublibs}>
        <h3 className={styles.sublibsTitle}>
          {sublibs.title}
        </h3>
        <div className={styles.sublibsDesc}>
          <Blocks blocks={sublibs.blocks} />
        </div>
        <div className={`il6-sublibs ${styles.sublibsDb}`}>
          <Table db={sublibsDb} keys={['Name', 'Type', 'Antigen']} />
        </div>
      </div>
      )}

      {subjects && (
      <div className={styles.subjects}>
        <h3 className={styles.subjectsTitle}>
          {subjects.title}
        </h3>
        <div className={styles.subjectsDesc}>
          <Blocks blocks={subjects.blocks} />
        </div>
      </div>
      )}

      {antigens && (
      <div className={styles.antigens}>
        <h3 className={styles.antigensTitle}>
          {antigens.title}
        </h3>
        <div className={styles.antigensDesc}>
          <Blocks blocks={antigens.blocks} />
        </div>
      </div>
      )}

      {license && (
      <div className="container">
        <div className={`il6-footer ${styles.license}`}>
          <h2>
            {license.title}
          </h2>
          <Blocks blocks={license.blocks} />
        </div>
      </div>
      )}
    </main>
  )
}

export default Datasets
