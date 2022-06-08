const API_URL = process.env.WORDPRESS_API_URL || 'https://wp.cognano.co.jp/graphql'
//const API_TOKEN = process.env.WORDPRESS_AUTH_REFRESH_TOKEN

export async function fetchAPI({ query, variables }) {
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

export async function getPosts() {
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

export async function getPages() {
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
