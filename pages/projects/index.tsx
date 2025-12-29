import type { GetStaticProps, NextPage } from 'next'
import type { QueryDatabaseResponseEx } from 'rotion'
import { List, Page } from 'rotion/ui'
import Hed from '../../components/hed'
import { lang } from '../../i18n'
import { type Content, GetContent } from '../../lib/content'
import CreateOgImage from '../../lib/ogimage'
import { GetProjectsOriginal, projectsQuery } from '../../lib/project'
import styles from '../../styles/Project.module.css'

type Props = {
  projects: QueryDatabaseResponseEx
  desc: Content
  ogimage: string
}

export const getStaticProps: GetStaticProps<{}> = async () => {
  const [projects, desc] = await Promise.all([
    GetProjectsOriginal(projectsQuery),
    GetContent('projects'),
  ])

  const ogimage = await CreateOgImage({
    id: `projects-${lang}`,
    title: desc?.[lang]?.title,
    desc: desc?.[lang]?.excerpt,
  })

  return {
    props: {
      projects: projects[lang],
      desc: desc?.[lang],
      ogimage,
    },
  }
}

const ProjectIndex: NextPage<Props> = ({ projects, desc, ogimage }) => {
  return (
    <main>
      <Hed title={desc.title} desc={desc.excerpt} ogimage={ogimage} />
      <div className='container'>
        <header className={styles.projectsHeader}>
          <h1>{desc.title}</h1>
          <div>
            <Page blocks={desc.blocks} />
          </div>
        </header>
      </div>

      <div className='container'>
        <List keys={['Name', 'Host', 'spacer', 'Tags', 'Date']} db={projects} />
      </div>
    </main>
  )
}

export default ProjectIndex
