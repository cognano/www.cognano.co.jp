import type { NextPage, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation, useSelectedLanguage, useLanguageQuery, getT } from '../i18n'
import { blogQueryLatest, newsQueryLatest, BlogEachLangs, GetBlogsEachLangs } from '../lib/blog'
import { GetContent, ContentBilingual } from '../lib/content'
import { Blocks, List } from 'notionate/dist/components'
import styles from '../styles/Home.module.css'
import { GetProjectsOriginal, ProjectsOriginal, projectsQueryLatest } from '../lib/project'
import Unsplash from '../components/unsplash'
import BlogList from '../components/blog-list'
import NewsList from '../components/news-list'
import Hed from '../components/hed'
import { GetQEs, QE } from '../lib/qe'
import CreateOgImage from '../lib/ogimage'

type Props = {
  about: ContentBilingual
  pitch: ContentBilingual
  vhh: ContentBilingual
  algorithm: ContentBilingual
  blog: BlogEachLangs
  news: BlogEachLangs
  projects: ProjectsOriginal
  qes: QE
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
    id: 'home',
    title: {
      en: getT('head.title', 'en'),
      ja: getT('head.title', 'ja'),
    },
  })

  return {
    props: {
      about,
      pitch,
      vhh,
      algorithm,
      blog,
      news,
      projects,
      qes,
      ogimage,
    }
  }
}

const HomePage: NextPage<Props> = ({ about, pitch, vhh, algorithm, blog, news, projects, qes, ogimage }) => {
  const { t } = useTranslation()
  const { lang } = useSelectedLanguage()
  const hero = lang === 'en' ? about.en : about.ja
  const blogPosts = lang === 'en' ? blog.en : blog.ja
  const newsPosts = lang === 'en' ? news.en : news.ja
  const projectList = lang === 'en' ? projects.en : projects.ja
  const al = lang === 'en' ? algorithm.en : algorithm.ja
  const p = lang === 'en' ? pitch.en : pitch.ja
  const q = lang === 'en' ? qes.en : qes.ja
  const v = lang === 'en' ? vhh.en : vhh.ja
  const [query] = useLanguageQuery()

  return (
    <>
      <Hed title={t('head.title')} desc={t('head.description')} ogimage={ogimage} />
      <main>
        <div className={styles.wrapper}>
          <div className="container">
            <div className={styles.hero}>
              <div className={styles.treeDiagram}>
                <img src="/images/tree.svg" />
              </div>
              <div className={styles.researchImage}>
                <img src="/images/research2.jpg" />
                <Unsplash href="https://unsplash.com/@nci?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" name="National Cancer Institute"/>
              </div>
              <div className={styles.heroInner}>
                <Blocks blocks={hero.blocks} />
                <p className={styles.aboutButton}>
                  <Link href={{ pathname: '/about', query }}>
                    {t('index.aboutUs')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.qesWrapper}>
          <div className={styles.qes}>
            {q.map((v, i) => (
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
          <h2>{p.title}</h2>
          <Blocks blocks={p.blocks} />
        </div>

        <section>
          <div className={styles.researchIntro}>
            <div className={styles.researchBody}>
              <h2 className={styles.researchTitle}>
                {v.title}
              </h2>
              <p>{v.excerpt}</p>
              <p className={styles.researchButton}>
                <Link href={{ pathname: '/research', query }}>
                  {t('index.viewAllResearch')}
                </Link>
              </p>
            </div>
            <div className={styles.researchCover} style={{backgroundImage: `url(${v.cover})`}}>
            </div>
          </div>
        </section>

        <div className="container">
          <div className={styles.projectsWrapper}>
            <header className={styles.projectsHeader}>
              <h2>{t('index.projects')}</h2>
              <p className={styles.projectsIndexLink}>
                <Link href={{ pathname: '/projects', query }}>
                  {t('index.viewAllProjects')} &rarr;
                </Link>
              </p>
            </header>
            <List
              keys={['Name', 'Host', 'spacer', 'Tags', 'Date']}
              db={projectList}
              href="/projects/[id]"
            />
          </div>
        </div>

        <div className="container">
          <div className={styles.blogWrapper}>
            <header className={styles.blogHeader}>
              <h2>{t('index.blog')}</h2>
              <p className={styles.blogIndexLink}>
                <Link href={{ pathname: '/blog', query }}>
                  {t('index.viewAllBlog')} &rarr;
                </Link>
              </p>
            </header>
            <BlogList blog={blogPosts} lang={lang} />
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
              <h2>{al.title}</h2>
              <Blocks blocks={al.blocks} />
            </div>
          </div>
        </div>

        <div className="container">
          <div className={styles.newsWrapper}>
            <header className={styles.newsHeader}>
              <h2>{t('index.news')}</h2>
              <p className={styles.newsIndexLink}>
                <Link href={{ pathname: '/news', query }}>
                  {t('index.viewAllNews')} &rarr;
                </Link>
              </p>
            </header>
            <NewsList news={newsPosts} lang={lang} />
          </div>
        </div>
      </main>
    </>
  )
}

export default HomePage