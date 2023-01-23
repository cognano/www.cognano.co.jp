import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useSelectedLanguage } from '../../i18n'
import { GetProjectsOriginal, ProjectsOriginal, projectsQuery } from '../../lib/project'
import { Blocks } from 'notionate/dist/components'
import { List } from 'notionate/dist/components'
import { GetContent, ContentBilingual } from '../../lib/content'
import styles from '../../styles/Project.module.css'
import Hed from '../../components/hed'
import CreateOgImage from '../../lib/ogimage'

type Props = {
  projects: ProjectsOriginal
  desc: ContentBilingual
  ogimage: string
}

export const getStaticProps: GetStaticProps<{}> = async () => {
  const projects = await GetProjectsOriginal(projectsQuery)
  const desc = await GetContent('projects')

  const ogimage = await CreateOgImage({
    id: 'projects',
    title: {
      en: desc!.en.title,
      ja: desc!.ja.title,
    },
    desc: {
      en: desc!.en.excerpt,
      ja: desc!.ja.excerpt,
    },
  })

  return {
    props: {
      projects,
      desc,
      ogimage,
    }
  }
}

const ProjectIndex: NextPage<Props> = ({ projects, desc, ogimage }) => {
  const { lang } = useSelectedLanguage()
  const projectList = lang === 'en' ? projects.en : projects.ja
  const d = lang === 'en' ? desc.en : desc.ja

  return (
    <main>
      <Hed title={d.title} desc={d.excerpt} ogimage={ogimage} />
      <div className="container">
        <header className={styles.projectsHeader}>
          <h1>
            {d.title}
          </h1>
          <div>
            <Blocks blocks={d.blocks} />
          </div>
        </header>
      </div>

      <div className="container">
        <List
          keys={['Name', 'Host', 'spacer', 'Tags', 'Date']}
          db={projectList}
          href="/projects/[id]"
        />
      </div>
    </main>
  )
}

export default ProjectIndex
