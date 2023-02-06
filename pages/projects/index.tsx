import type { NextPage, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import t, { lang } from '../../i18n'
import { GetProjectsOriginal, projectsQuery } from '../../lib/project'
import { QueryDatabaseResponseEx } from 'notionate'
import { Blocks } from 'notionate/dist/components'
import { List } from 'notionate/dist/components'
import { GetContent, Content } from '../../lib/content'
import styles from '../../styles/Project.module.css'
import Hed from '../../components/hed'
import CreateOgImage from '../../lib/ogimage'

type Props = {
  projects: QueryDatabaseResponseEx
  desc: Content
  ogimage: string
}

export const getStaticProps: GetStaticProps<{}> = async () => {
  const projects = await GetProjectsOriginal(projectsQuery)
  const desc = await GetContent('projects')

  const ogimage = await CreateOgImage({
    id: 'projects',
    title: desc![lang].title,
    desc: desc![lang].excerpt,
  })

  return {
    props: {
      projects: projects[lang],
      desc: desc![lang],
      ogimage,
    }
  }
}

const ProjectIndex: NextPage<Props> = ({ projects, desc, ogimage }) => {
  return (
    <main>
      <Hed title={desc.title} desc={desc.excerpt} ogimage={ogimage} />
      <div className="container">
        <header className={styles.projectsHeader}>
          <h1>
            {desc.title}
          </h1>
          <div>
            <Blocks blocks={desc.blocks} />
          </div>
        </header>
      </div>

      <div className="container">
        <List
          keys={['Name', 'Host', 'spacer', 'Tags', 'Date']}
          db={projects}
          href="/projects/[id]"
        />
      </div>
    </main>
  )
}

export default ProjectIndex
