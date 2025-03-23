import type { NextPage, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import t, { lang } from '../i18n'
import { blogQueryLatest, newsQueryLatest, Blog, GetBlogsEachLangs } from '../lib/blog'
import { GetContent, Content } from '../lib/content'
import { Page, List } from 'rotion/ui'
import styles from '../styles/Home.module.css'
import { GetProjectsOriginal, projectsQueryLatest } from '../lib/project'
import Unsplash from '../components/unsplash'
import BlogList from '../components/blog-list'
import NewsList from '../components/news-list'
import Hed from '../components/hed'
import { GetQEs, LocalizedQE } from '../lib/qe'
import { GetFAQs, LocalizedFAQWithBlocks } from '../lib/faq'
import CreateOgImage from '../lib/ogimage'
import { QueryDatabaseResponseEx } from 'rotion'

type Props = {
  hero: Content
  problem: Content
  solution: Content
  proof: Content
  faq: Content
  openfold: Content
  faqs: LocalizedFAQWithBlocks[]
  video: Content
  blog: Blog[]
  news: Blog[]
  projects: QueryDatabaseResponseEx
  qes: LocalizedQE[]
  ogimage: string
}

export const getStaticProps: GetStaticProps = async (context) => {
  const [hero, pitchProblem, pitchSolution, pitchProof, faq, video, openfold, qes, faqs, blog, news, projects] = await Promise.all([
    GetContent('hero'),
    GetContent('pitch-problem'),
    GetContent('pitch-solution'),
    GetContent('pitch-proof'),
    GetContent('faq'),
    GetContent('video'),
    GetContent('openfold'),
    GetQEs(),
    GetFAQs(),
    GetBlogsEachLangs(blogQueryLatest),
    GetBlogsEachLangs(newsQueryLatest),
    GetProjectsOriginal(projectsQueryLatest),
  ])

  if (hero === undefined) {
    return {
      props: {},
      redirect: {
        destination: '/404'
      }
    }
  }

  const ogimage = await CreateOgImage({
    id: `home-${lang}`,
    title: t('head.title'),
  })

  return {
    props: {
      hero: hero![lang],
      problem: pitchProblem![lang],
      solution: pitchSolution![lang],
      proof: pitchProof![lang],
      faq: faq![lang],
      faqs: faqs![lang],
      video: video![lang],
      blog: blog[lang],
      news: news[lang],
      projects: projects[lang],
      qes: qes[lang],
      openfold: openfold![lang],
      ogimage,
    }
  }
}

const HomePage: NextPage<Props> = ({ video, hero, solution, problem, proof, faq, faqs, openfold, blog, news, projects, qes, ogimage }) => {
  return (
    <>
      <Hed title={t('head.title')} desc={t('head.description')} ogimage={ogimage} />
      <main>
        <div className={styles.wrapper}>
          <div className="container">
            <div className={styles.hero}>
              <div className={styles.heroText}>
                <Page blocks={hero.blocks} />
                <p className={styles.button}>
                  <Link href="/about">
                    {t('index.aboutUs')}
                  </Link>
                </p>
              </div>
              <div className={styles.heroImage}>
                <div className={styles.ibmet}>
                  <Image src="/static/ibmet.webp" width={625} height={750} alt="IBMET" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.elevatorPitch}>
          <div className={styles.problemAndSolution}>
            <div className={styles.problem}>
              <div className={styles.halfcontainerL}>
                <div className={styles.problemImage}>
                  <Image src="/static/problem.webp" width={200} height={200} alt="Telescope" />
                </div>
                <Page blocks={problem.blocks} />
              </div>
            </div>
            <div className={styles.solution}>
              <div className={styles.halfcontainerR}>
                <div className={styles.solutionImage}>
                  <Image src="/static/solution.webp" width={200} height={200} alt="AI" />
                </div>
                <Page blocks={solution.blocks} />
              </div>
            </div>
          </div>
          <div className={styles.proof}>
            <div className={styles.halfcontainerC}>
              <Page blocks={proof.blocks} />
              <p className={styles.button}>
                <Link href="/datasets">
                  {t('index.datasets')}
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.qesWrapper}>
          <div className={styles.qes}>
            {qes.map((v, i) => (
              <div className={styles.qe} key={i}>
                <p className={styles.qeTitle}>
                  {v.title}
                </p>
                <p className={styles.qeNumber}>
                  {v.number}
                  <span className={styles.qeUnit}>
                    {v.unit}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.faqsWrapper}>
          <h2 className={styles.faqTitle}>
            {faq.title}
          </h2>
          <div className={styles.faqDesc}>
            <Page blocks={faq.blocks} />
          </div>
          <div className={styles.faqs}>
            {faqs.map((v, i) => (
              <div className={styles.faq} key={i}>
                <h3 className={styles.faqQ}>
                  {v.question}
                </h3>
                <div className={styles.faqA}>
                  <Page blocks={v.blocks} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className={styles.office}>
          <h2 className={styles.officeTitle}>
            {t('index.office')}
          </h2>
          <div className={styles.officeInner}>
            <div className={styles.kyoto}>
              <div className={styles.officeImage}>
                <Image src="/static/kyoto.webp" width={600} height={300} alt="Kyoto" />
                <div className={styles.officeImageLicense}>
                  <Unsplash href="https://unsplash.com/@blackodc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash" name="Su San Lee"/>
                </div>
              </div>
              <h3 className={styles.officeName}>
                {t('index.kyoto')}
              </h3>
              <p className={styles.officeAddress}>
                {t('index.kyotoAddress')}<br />
                {t('index.kyotoCorpName')}
              </p>
            </div>
            <div className={styles.somerville}>
              <div className={styles.officeImage}>
                <Image src="/static/davis-square.webp" width={600} height={300} alt="Davis Square" />
                <div className={styles.officeImageLicense}>
                  <Unsplash href="https://commons.wikimedia.org/wiki/File:Davis_Square_looking_north_down_Holland_Street_2.jpg" name="4300streetcar" host="wikipedia" hostUrl="https://en.wikipedia.org/wiki/Somerville,_Massachusetts"/>
                </div>
              </div>
              <h3 className={styles.officeName}>
                {t('index.somerville')}
              </h3>
              <p className={styles.officeAddress}>
                {t('index.somervilleAddress')}<br />
                {t('index.somervilleCorpName')}
              </p>
            </div>
          </div>
          <h2 className={styles.officeTitle}>
            {t('index.lab')}
          </h2>
          <div className={styles.labInner}>
            <div className={styles.kyoto}>
              <div className={styles.officeImage}>
                <Image src="/static/biolab.webp" width={600} height={300} alt="Kyoto Lab" />
                <div className={styles.officeImageLicense}>
                  <Unsplash href="https://unsplash.com/photos/black-and-silver-coffee-maker-on-white-wooden-table-_9xRHrMOjeg" name="Trnava University"/>
                </div>
              </div>
              <h3 className={styles.officeName}>
                {t('index.kyoto')}
              </h3>
              <p className={styles.officeAddress}>
                {t('index.kyotogoshaLabAddress')}<br />
                {t('index.kyotogoshaLabName')}
              </p>
            </div>
          </div>
        </section>

        <div className="container">
          <div className={styles.projectsWrapper}>
            <header className={styles.projectsHeader}>
              <h2>{t('index.projects')}</h2>
              <p className={styles.projectsIndexLink}>
                <Link href="/projects">
                  {t('index.viewAllProjects')} &rarr;
                </Link>
              </p>
            </header>
            <List
              keys={['Name', 'Host', 'spacer', 'Tags', 'Date']}
              db={projects}
            />
          </div>
        </div>

        <div className={styles.openfold}>
          <div className={styles.openfoldInner}>
            <div className={styles.openfoldMember}>
              <Page blocks={openfold.blocks} />
            </div>
            <div className={styles.openfoldAbout}>
              <Image src="/static/openfold.png" width={455} height={112} alt="OpenFold" />
              <p>{t('index.openfold')}</p>
            </div>
          </div>
        </div>

        <div className="container">
          <div className={styles.blogWrapper}>
            <header className={styles.blogHeader}>
              <h2>{t('index.blog')}</h2>
              <p className={styles.blogIndexLink}>
                <Link href="/blog">
                  {t('index.viewAllBlog')} &rarr;
                </Link>
              </p>
            </header>
            <BlogList blog={blog} />
          </div>
        </div>

        <div className={styles.video}>
          <div className={styles.videoInner}>
            <Page blocks={video.blocks} />
          </div>
        </div>

        <div className="container">
          <div className={styles.newsWrapper}>
            <header className={styles.newsHeader}>
              <h2>{t('index.news')}</h2>
              <p className={styles.newsIndexLink}>
                <Link href="/news">
                  {t('index.viewAllNews')} &rarr;
                </Link>
              </p>
            </header>
            <NewsList news={news} />
          </div>
        </div>
      </main>
    </>
  )
}

export default HomePage