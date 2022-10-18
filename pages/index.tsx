import type { NextPage, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation, useSelectedLanguage, useLanguageQuery } from '../i18n'
import { blogQueryLatest, newsQueryLatest, BlogEachLangs, GetBlogsEachLangs } from '../lib/blog'
import { GetContent, ContentBilingual } from '../lib/content'
import { Blocks, List } from 'notionate/dist/components'
import styles from '../styles/Home.module.css'
import { GetProjectsOriginal, ProjectsOriginal, projectsQueryLatest } from '../lib/project'
import Unsplash from '../components/unsplash'
import BlogList from '../components/blog-list'
import NewsList from '../components/news-list'

type Props = {
  home: ContentBilingual
  blog: BlogEachLangs
  news: BlogEachLangs
  projects: ProjectsOriginal
}

export const getStaticProps: GetStaticProps = async (context) => {
  const home = await GetContent('home')
  const blog = await GetBlogsEachLangs(blogQueryLatest)
  const news = await GetBlogsEachLangs(newsQueryLatest)
  const projects = await GetProjectsOriginal(projectsQueryLatest)

  if (home === undefined) {
    return {
      props: {},
      redirect: {
        destination: '/404'
      }
    }
  }

  return {
    props: {
      home,
      blog,
      news,
      projects,
    }
  }
}

const HomePage: NextPage<Props> = ({ home, blog, news, projects }) => {
  const { t } = useTranslation()
  const { lang } = useSelectedLanguage()
  const hero = lang === 'en' ? home.en : home.ja
  const blogPosts = lang === 'en' ? blog.en : blog.ja
  const newsPosts = lang === 'en' ? news.en : news.ja
  const projectList = lang === 'en' ? projects.en : projects.ja
  const [query] = useLanguageQuery()

  return (
    <>
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
                    <a>{t('index.aboutUs')}</a>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <section>
          <header className="container">
            <h2>{t('index.research')}</h2>
          </header>

          <div className={`${styles.secondImage} container`}>
            <div className={styles.secondImageText}>
              <p>text text text text text text text text text text text text text text text text text text text text text text text text.</p>
              <p>text text text text text text text text text text text text text text text text text text text text text text text text.</p>
              <p>text text text text text text text text text text text text text text text text text text text text text text text text.....</p>
              <p className={styles.button}>
                <Link href={{ pathname: '/research/tnbc', query }}>{t('index.tnbc')}</Link>
              </p>
            </div>
            <div className={`${styles.secondImageFlame} ${styles.secondImageRight}`}>
              <img src="/images/cancer.jpg" width="800" />
              <Unsplash href="https://unsplash.com/@nci?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" name="National Cancer Institute"/>
            </div>
          </div>

          <div className={`${styles.secondImage} container`}>
            <div className={styles.secondImageFlame}>
              <img src="/images/alpaca.jpg" width="800" />
              <Unsplash href="https://unsplash.com/@nci?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" name="National Cancer Institute"/>
            </div>
            <div className={`${styles.secondImageText} ${styles.secondImageRight}`}>
              <p>text text text text text text text text text text text text text text text text text text text text text text text text.</p>
              <p>text text text text text text text text text text text text text text text text text text text text text text text text.</p>
              <p>text text text text text text text text text text text text text text text text text text text text text text text text.....</p>
              <p className={styles.button}>
                <Link href={{ pathname: '/research/vhh', query }}>{t('index.vhh')}</Link>
              </p>
            </div>
          </div>

          <div className={`${styles.secondImage} container`}>
            <div className={styles.secondImageText}>
              <p>text text text text text text text text text text text text text text text text text text text text text text text text.</p>
              <p>text text text text text text text text text text text text text text text text text text text text text text text text.</p>
              <p>text text text text text text text text text text text text text text text text text text text text text text text text.....</p>
              <p className={styles.button}>
                <Link href={{ pathname: '/research', query }}>{t('index.research')}</Link>
              </p>
            </div>
            <div className={`${styles.secondImageFlame} ${styles.secondImageRight}`}>
              <img src="/images/lab.webp" width="800" />
            </div>
          </div>
        </section>

        <div className="container">
          <div className={styles.projectsWrapper}>
            <header className={styles.projectsHeader}>
              <h2>{t('index.projects')}</h2>
              <p className={styles.projectsIndexLink}>
                <Link href={{ pathname: '/projects', query }}>
                  <a>{t('index.viewAllProjects')} &rarr;</a>
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
                  <a>{t('index.viewAllBlog')} &rarr;</a>
                </Link>
              </p>
            </header>
            <BlogList blog={blogPosts} lang={lang} />
          </div>
        </div>

        <div className="container">
          <div className={styles.newsWrapper}>
            <header className={styles.newsHeader}>
              <h2>{t('index.news')}</h2>
              <p className={styles.newsIndexLink}>
                <Link href={{ pathname: '/news', query }}>
                  <a>{t('index.viewAllNews')} &rarr;</a>
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