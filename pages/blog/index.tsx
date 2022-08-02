import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation, useSelectedLanguage } from '../../i18n'
import { Blog, GetBlogs } from '../../lib/blog'
import { formatDate } from '../../lib/date'

type Props = {
  posts: Blog[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await GetBlogs()
  return {
    props: {
      posts
    }
  }
}

const BlogIndex: NextPage<Props> = ({ posts }) => {
  //const { t } = useTranslation()
  const { lang } = useSelectedLanguage()

  return (
    <>
      <main>
        <header>
          <h1>
            Blog
          </h1>
          <p>
            This is blog.
          </p>
        </header>

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
      </main>

      <style jsx>{`
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

export default BlogIndex
