import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { fetchAPI, getPosts } from '../../lib/data'

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

const BlogIndex: NextPage = ({ posts } ) => {
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
