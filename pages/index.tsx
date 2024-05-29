import type { NextPage, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import t, { lang } from '../i18n'
import { blogQueryLatest, newsQueryLatest, Blog, GetBlogsEachLangs } from '../lib/blog'
import { GetContent, Content } from '../lib/content'
import { Page, List } from 'rotion/ui'
import styles from '../styles/Home.module.css'
import { GetProjectsOriginal, ProjectsOriginal, projectsQueryLatest } from '../lib/project'
import Unsplash from '../components/unsplash'
import BlogList from '../components/blog-list'
import NewsList from '../components/news-list'
import Hed from '../components/hed'
import { GetQEs, LocalizedQE } from '../lib/qe'
import CreateOgImage from '../lib/ogimage'
import { QueryDatabaseResponseEx } from 'rotion'

type Props = {
  about: Content
  pitch: Content
  vhh: Content
  algorithm: Content
  blog: Blog[]
  news: Blog[]
  projects: QueryDatabaseResponseEx
  qes: LocalizedQE[]
  ogimage: string
}

export const getStaticProps: GetStaticProps = async (context) => {
  const about = await GetContent('about')
  const pitch = await GetContent('pitch')
  const vhh = await GetContent('vhh-antibody')
  const algorithm = await GetContent('algorithm')
  const qes = await GetQEs()
  const blog = await GetBlogsEachLangs(blogQueryLatest)
  const news = await GetBlogsEachLangs(newsQueryLatest)
  const projects = await GetProjectsOriginal(projectsQueryLatest)

  if (about === undefined) {
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
      about: about[lang],
      pitch: pitch![lang],
      vhh: vhh![lang],
      algorithm: algorithm![lang],
      blog: blog[lang],
      news: news[lang],
      projects: projects[lang],
      qes: qes[lang],
      ogimage,
    }
  }
}

const HomePage: NextPage<Props> = ({ about, pitch, vhh, algorithm, blog, news, projects, qes, ogimage }) => {
  return (
    <>
      <Hed title={t('head.title')} desc={t('head.description')} ogimage={ogimage} />
      <main>
        <div className={styles.wrapper}>
          <div className="container">
            <div className={styles.hero}>
              <div className={styles.treeDiagram}>
                <Image src="/static/tree.svg" width={1000} height={1000} alt="Tree Diagram" />
              </div>
              <div className={styles.researchImage}>
                <Image src="/static/chromosomes.webp" fill={true} alt="Chromosomes" />
                <div className={styles.unsplash}>
                  <Unsplash href="https://unsplash.com/@nci?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" name="National Cancer Institute"/>
                </div>
              </div>
              <div className={styles.heroInner}>
                <Page blocks={about.blocks} />
                <p className={styles.aboutButton}>
                  <Link href="/about">
                    {t('index.aboutUs')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.qesWrapper}>
          <div className={styles.qes}>
            {qes.map((v, i) => (
              <div className={styles.qe} key={i}>
                <p className={styles.qeNumber}>
                  {v.number}
                  <span className={styles.qeUnit}>
                    {v.unit}
                  </span>
                </p>
                <p className={styles.qeTitle}>
                  {v.title}
                </p>
              </div>
            ))}
          </div>
          <div className={styles.qesBackgroundImageLicense}>
            <Unsplash href="https://unsplash.com/@whoisdenilo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" name="Who’s Denilo ?"/>
          </div>
        </div>

        <div className={styles.pitches}>
          <h2>{pitch.title}</h2>
          <Page blocks={pitch.blocks} />
        </div>

        <section>
          <div className={styles.researchIntro}>
            <div className={styles.researchBody}>
              <h2 className={styles.researchTitle}>
                {vhh.title}
              </h2>
              <p>{vhh.excerpt}</p>
              <p className={styles.researchButton}>
                <Link href="/research">
                  {t('index.viewAllResearch')}
                </Link>
              </p>
            </div>
            <div className={styles.researchCover} style={{backgroundImage: `url(${vhh.cover})`}}>
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

        <div className={styles.algorithm}>
          <div className={styles.algorithmInner}>
            <div className={styles.algorithmVideo}>
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/zcOjqP40TjA?controls=0"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
              ></iframe>
            </div>
            <div className={styles.algorithmText}>
              <h2>{algorithm.title}</h2>
              <Page blocks={algorithm.blocks} />
            </div>
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