import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useSelectedLanguage } from '../../i18n'
import { GetProjectsOriginal, ProjectsOriginal, projectsQuery } from '../../lib/project'
import { List } from 'notionate/dist/components'

type Props = {
  projects: ProjectsOriginal
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const projects = await GetProjectsOriginal(projectsQuery)
  return {
    props: {
      projects
    }
  }
}

const ProjectIndex: NextPage<Props> = ({ projects }) => {
  const { lang } = useSelectedLanguage()
  const projectList = lang === 'en' ? projects.en : projects.ja

  return (
    <>
      <main>
        <header className="container">
          <h1>
            Projects
          </h1>
          <p>
            These are projects.
          </p>
        </header>

        <div className="container">
          <List
            keys={['Name', 'Host', 'spacer', 'Tags', 'Date']}
            db={projectList}
            href="/projects/[id]"
          />
        </div>
      </main>
    </>
  )
}

export default ProjectIndex
