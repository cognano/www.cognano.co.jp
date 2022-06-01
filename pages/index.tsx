import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const API_URL = process.env.WORDPRESS_API_URL || 'https://wp.cognano.co.jp/graphql'
//const API_TOKEN = process.env.WORDPRESS_AUTH_REFRESH_TOKEN

async function fetchAPI(query, { variables } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    //'Authorization': `Bearer ${API_TOKEN}`,
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }
  return json.data
}

async function getPosts() {
  const data = await fetchAPI(
    `query AllPosts {
      posts(first: 20) {
        edges {
          node {
            title
            categories {
              edges {
                node {
                  name
                }
              }
            }
            excerpt
            slug
            date
            author {
              node {
                name
                firstName
                lastName
              }
            }
          }
        }
      }
    }
    `,
    {
      variables: {},
    }
  )
  return data?.posts?.edges
}

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

const Home: NextPage = ({ posts } ) => {
  return (
    <>
      <main>
        <div className="hero">
          Cognano is a venture to aim computer-supported drug discovery.
          The big VHH data obtained from our own alpacas will lead us to a new drug discovery platform.
          Our goal is to optimize drug designing/development.
        </div>

        <div className="blog">
          <h2>
            Latest posts
          </h2>

          <p>
            <Link href="/blog">
              View all posts &rarr;
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

        <div className="research">
          <h2>
            Latest research
          </h2>

          <p>
            <Link href="/research">
              View all posts &rarr;
            </Link>
          </p>

          {posts.map((post, i) => (
            <div className="publication" key={i}>
              <Link href={`/research/${post.node.id}`}>
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
        .blog {
          margin: var(--spacing-5) var(--spacing-20);
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
        .research {
          margin: var(--spacing-5) var(--spacing-20);
          font-size: var(--fontSize-0);
        }
      `}</style>
    </>
  )
}

export default Home
