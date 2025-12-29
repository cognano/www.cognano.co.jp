import type { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Page } from 'rotion/ui'
import Hed from '../../components/hed'
import Unsplash from '../../components/unsplash'
import t, { lang } from '../../i18n'
import { type Content, GetContent } from '../../lib/content'
import { Pages } from '../../lib/dataset'
import CreateOgImage from '../../lib/ogimage'
import styles from '../../styles/Datasets.module.css'

type Props = {
  desc: Content
  datasets: Content[]
  ogimage: string
}

export const getStaticProps: GetStaticProps<{}> = async ({ params }) => {
  const desc = await GetContent('datasets')
  const datasets: Content[] = []
  for (const p of Pages) {
    const d = await GetContent('abstract', p.slug)
    if (d?.[lang]) {
      datasets.push(d[lang]!)
    }
  }

  if (!desc || !desc[lang]) {
    throw new Error(`Datasets content not found for language: ${lang}`)
  }

  const content = desc[lang]!

  const ogimage = await CreateOgImage({
    id: `datasets-${lang}`,
    title: content.title,
    desc: content.excerpt,
  })

  return {
    props: {
      desc: desc?.[lang],
      datasets,
      ogimage,
    },
  }
}

const DatasetsIndex: NextPage<Props> = ({ desc, datasets, ogimage }) => {
  return (
    <main>
      <Hed title={desc.title} desc={desc.excerpt} ogimage={ogimage} />

      <div className={styles.indexHeader}>
        <div className={styles.indexHeaderImage}>
          <Image src={desc.cover} fill={true} alt={`${desc.title} image`} />
          <div className={styles.indexUnsplash}>
            <Unsplash
              name='Transly Translation Agency'
              href='https://unsplash.com/@translytranslations'
            />
          </div>
        </div>
        <div className={styles.indexHeaderText}>
          <div className={styles.indexHeaderTextInner}>
            <h1 className={styles.indexTitle}>{desc.title}</h1>
            <div className={styles.indexDesc}>
              <Page blocks={desc.blocks} />
            </div>
          </div>
        </div>
      </div>

      <div className='container'>
        <div className={styles.list}>
          {datasets.map((v) => (
            <div className={styles.dataset} key={v.id}>
              <div className={styles.datasetThumbnail}>
                <div className={styles.datasetThumbnailInner}>
                  <Image src={v.cover} fill={true} alt={`${v.title} image`} />
                </div>
              </div>
              <div className={styles.datasetText}>
                <h2 className={styles.datasetTitle}>{v.title}</h2>
                <p className={styles.datasetExcerpt}>{v.excerpt}</p>
                <div className={`button ${styles.learnMoreButton}`}>
                  {/* @ts-ignore */}
                  <Link
                    href={`/datasets/${v.page.properties.Category.select.name}`}
                  >
                    {t('datasets.learnmore')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default DatasetsIndex
