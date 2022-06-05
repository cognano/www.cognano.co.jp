import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { fetchAPI, getPosts } from '../lib/data'

export const getStaticProps: GetStaticProps<{
  posts: WPPost[]
}> = async () => {
  const posts = await getPosts()
  return {
    props: {
      posts
    }
  }
}

const en = {
  heroMessage: `COGNANO is a venture to aim computer-supported drug discovery.
    The big VHH data obtained from our own alpacas will lead us to a new drug discovery platform.
    Our goal is to optimize drug designing/development.`,
  aboutUs: `About Us`,
  latestPosts: `Latest posts`,
  viewAllPosts: `View all posts`,
  latestProjects: `Latest Projects`,
  viewAllProjects: `View all projects`,
}
const ja = {
  heroMessage: `COGNANOは、コンピューターを利用した創薬を目指すベンチャー企業です。
    アルパカから得られた大きなVHHデータは、私たちを新しい創薬プラットフォームに導きます。
    私たちのゴールは、薬のデザイン/開発を最適化することです。`,
  aboutUs: `私たちについて`,
  latestPosts: `最近のブログ`,
  viewAllPosts: `ブログ一覧へ`,
  latestProjects: `最近のプロジェクト`,
  viewAllProjects: `プロジェクト一覧へ`,
}

const Home: NextPage = ({ posts } ) => {
  const { locale } = useRouter()
  const t = locale === 'en' ? en : ja

  return (
    <>
      <main>
        <div className="hero">
          <p>{t.heroMessage}</p>
          <p className="to-about-button">
            <Link href="/about">
              <a>{t.aboutUs}</a>
            </Link>
          </p>
        </div>

        <div className="blog summary">
          <h2>{t.latestPosts}</h2>
          <p>
            <Link href="/blog">
              <a>{t.viewAllPosts} &rarr;</a>
            </Link>
          </p>
          <div className="post-container">
            {posts.map((post, i) => (
              <div className="post" key={i}>
                <Link href={`/blog/${post.node.id}`}>
                  <a>
                    <h3 className="post-title">
                      {post.node.title}
                    </h3>
                    <p className="post-meta">
                      <span>{post.node.date}</span>, By {post.node.author.node.name}
                    </p>
                    <p className="post-excerpt">
                      {post.node.excerpt.replace(/<[^>]*>?/gm, '').replace(/\r?\n/g, '').substr(0, 60)}...
                    </p>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="projects summary">
          <h2>{t.latestProjects}</h2>
          <p>
            <Link href="/projects">
              <a>{t.viewAllProjects} &rarr;</a>
            </Link>
          </p>

          {posts.map((post, i) => (
            <div className="project" key={i}>
              <Link href={`/projects/${post.node.id}`}>
                <a>
                  <h3 className="post-title">
                    {post.node.title}
                  </h3>
                  <p className="post-meta">
                    <span>{post.node.date}</span>, By {post.node.author.node.name}
                  </p>
                  <p className="post-excerpt">
                    {post.node.excerpt.replace(/<[^>]*>?/gm, '').replace(/\r?\n/g, '').substr(0, 60)}...
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
        }
      `}</style>
    </>
  )
}

export default Home
