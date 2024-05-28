
import type { NextPage, GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { lang } from '../../i18n'
import { Content, GetContent } from '../../lib/content'
import { Pages } from '../../lib/dataset'
import { Blocks } from 'notionate/dist/components'
import styles from '../../styles/Datasets.module.css'
import Unsplash from '../../components/unsplash'
import Hed from '../../components/hed'
import CreateOgImage from '../../lib/ogimage'

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
    if (d && d[lang]) {
      datasets.push(d[lang]!)
    }
  }

  const ogimage = await CreateOgImage({
    id: `datasets-${lang}`,
    title: desc![lang]!.title,
    desc: desc![lang]!.excerpt,
  })

  return {
    props: {
      desc: desc![lang],
      datasets,
      ogimage,
    }
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
            <Unsplash name="Transly Translation Agency" href="https://unsplash.com/@translytranslations" />
          </div>
        </div>
        <div className={styles.indexHeaderText}>
          <div className={styles.indexHeaderTextInner}>
            <h1 className={styles.indexTitle}>
              {desc.title}
            </h1>
            <div className={styles.indexDesc}>
              <Blocks blocks={desc.blocks} />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.list}>
          {datasets.map(v => (
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
                  <Link href={`/datasets/${v.page.properties.Category.select.name}`}>Lean more</Link>
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
