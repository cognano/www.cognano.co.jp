import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation, useSelectedLanguage } from '../i18n'
import { formatDate } from '../lib/date'
import { Blog, GetBlogs } from '../lib/blog'
import { GetContent, ContentBilingual } from '../lib/content'
import { Blocks } from 'notionate/dist/components'
import { GetPageResponseEx } from 'notionate'

type Props = {
  home: ContentBilingual
  posts: Blog[]
}

export const getStaticProps: GetStaticProps = async (context) => {
  const home = await GetContent('home')
  const posts = await GetBlogs()

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
      posts
    }
  }
}

const Home: NextPage<Props> = ({ home, posts }) => {
  const { t } = useTranslation()
  const { lang } = useSelectedLanguage()
  const hero = lang === 'en' ? home.en : home.ja

  return (
    <>
      <main>
        <div className="hero">
          <Blocks blocks={hero.blocks} />
          <p className="to-about-button">
            <Link href="/about">
              <a>{t('index.aboutUs')}</a>
            </Link>
          </p>
        </div>

        <div className="blog summary">
          <h2>{t('index.latestPosts')}</h2>
          <p>
            <Link href="/blog">
              <a>{t('index.viewAllPosts')} &rarr;</a>
            </Link>
          </p>
          <div className="post-container">
            {posts.map((post, i) => (
              <div className="post" key={i}>
                <Link href={`/blog/${post.slug}`}>
                  <a>
                    <h3 className="post-title">
                      {post.title}
                    </h3>
                    <p className="post-meta">
                      <span>{formatDate(post.date, lang)}</span>, By {post.writers.join(',')}
                    </p>
                    <p className="post-excerpt">
                      {post.excerpt}
                    </p>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="projects summary">
          <h2>{t('index.latestProjects')}</h2>
          <p>
            <Link href="/projects">
              <a>{t('index.viewAllProjects')} &rarr;</a>
            </Link>
          </p>

          {posts.map((post, i) => (
            <div className="project" key={i}>
              <Link href={`/projects/${post.slug}`}>
                <a>
                  <h3 className="post-title">
                    {post.title}
                  </h3>
                  <p className="post-meta">
                    <span>{formatDate(post.date, lang)}</span>, By {post.writers.join(',')}
                  </p>
                  <p className="post-excerpt">
                    {post.excerpt}
                  </p>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </main>

      <style jsx>{`
        .hero {
          margin: var(--spacing-20) var(--spacing-20);
          padding: var(--spacing-20) 0 var(--spacing-20);
          font-family: var(--fontFamily-sans);
          font-size: var(--fontSize-6);
        }
        .to-about-button {
          margin: 0;
          padding: 0;
          text-align: right;
        }
        .to-about-button a {
          text-decoration: none;
          display: inline-block;
          margin: 0;
          padding: var(--spacing-2) var(--spacing-10);
          border: 1px solid #000;
          border-radius: 30px;
          font-size: var(--fontSize-1);
          color: #000;
        }
        .to-about-button a:hover {
          border: 1px solid var(--color-primary);
          color: var(--color-primary);
        }
        .summary {
          margin: var(--spacing-20) var(--spacing-20) var(--spacing-5);
          font-size: var(--fontSize-0);
        }
        .post-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: var(--spacing-10);
        }
        .post a {
          display: block;
          height: 100%;
          padding: 1.5rem;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .post a:hover {
          border: 1px solid #000;
        }
        .post-title {
          font-size: var(--fontSize-4);
          margin-bottom: var(--spacing-2);
        }
        .post-meta {
          margin-bottom: var(--spacing-4);
          color: #000;
        }
        .post-meta span {
          font-weight: bold;
        }
        .post-excerpt {
          color: #000;
          font-size: var(--fontSize-2);
          margin-bottom: 0;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      `}</style>
    </>
  )
}

export default Home
