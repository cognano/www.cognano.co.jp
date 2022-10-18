import type { NextPage, GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps<{}> = async () => {
  return {
    props: {}
  }
}

const About: NextPage = ({}) => {
  return (
    <div className="container">
      <h1>Mission</h1>
      <img src="/images/structure.jpg" width="100%" />
      <h1>Vision</h1>
      <img src="/images/structure2.jpg" width="100%" />
      <h1>Our Story</h1>
      <img src="/images/structure3.jpg" width="100%" />
      <h1>Our Team</h1>
      <h1>Our Advisors</h1>
    </div>
  )
}

export default About
