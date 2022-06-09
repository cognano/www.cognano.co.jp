const API_URL = process.env.WORDPRESS_API_URL || 'https://wp.cognano.co.jp/graphql'
//const API_TOKEN = process.env.WORDPRESS_AUTH_REFRESH_TOKEN

type fetchAPIArgs = {
  query: string
  variables: object
}

export async function fetchAPI({ query, variables }: fetchAPIArgs) {
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

  if (!res.ok) {
    console.error(json.errors)
    throw new Error(`fetchAPI: http request error`)
  }

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error(`fetchAPI: http response perse error`)
  }

  return json.data
}

export async function getPosts(): Promise<WPPost[]> {
  const query = `query AllPosts {
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
  }`
  const variables = {}
  const data = await fetchAPI({ query, variables })
  return data?.posts?.edges
}

export type WPCategory = {
  node: {
    name: string
  }
}
export type WPAuthor = {
  node: {
    name: string
    firstName: string
    lastName: string
  }
}

export type WPPost = {
  node: {
    title: string
    categories: WPCategory[]
    excerpt: string
    slug: string
    date: string
    author: WPAuthor
  }
}

export async function getPages(): Promise<WPPage[]> {
  const query = `query AllPages {
    pages(where: {status: PUBLISH}) {
      edges {
        node {
          date
          slug
          title
          content
          modified
        }
      }
    }
  }`
  const variables = {}
  const data = await fetchAPI({ query, variables })
  return data?.pages?.edges
}

export type WPPage = {
  node: {
    date: string
    slug: string
    title: string
    content: string
    modified: string
  }
}
