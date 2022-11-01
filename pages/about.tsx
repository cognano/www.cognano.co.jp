import React, { useState } from 'react'
import type { NextPage, GetStaticProps } from 'next'
import { useTranslation, useSelectedLanguage, useLanguageQuery } from '../i18n'
import { GetMindset, LocalizedMindsetWithBlocks, Mindset, mindsetQuery } from '../lib/mindset'
import { ContentBilingual, GetContent } from '../lib/content'
import { Blocks } from 'notionate/dist/components'
import { GetMembers, Members, LocalizedMemberWithBlocks } from '../lib/member'
import styles from '../styles/About.module.css'
import Unsplash from '../components/unsplash'

type Values = {
  ja: LocalizedMindsetWithBlocks[]
  en: LocalizedMindsetWithBlocks[]
}

type Props = {
  story: ContentBilingual
  team: ContentBilingual
  mindset: ContentBilingual
  company: ContentBilingual
  purpose: Mindset
  mission: Mindset
  vision: Mindset
  values: Values
  members: Members
}

export const getStaticProps: GetStaticProps<{}> = async () => {
  const story = await GetContent('story')
  const team = await GetContent('team')
  const mindset = await GetContent('mindset')
  const company = await GetContent('company-overview')
  const purpose = await GetMindset('purpose')
  const mission = await GetMindset('mission')
  const vision = await GetMindset('vision')
  const value1 = await GetMindset('value-1')
  const value2 = await GetMindset('value-2')
  const value3 = await GetMindset('value-3')
  const value4 = await GetMindset('value-4')
  const value5 = await GetMindset('value-5')
  let values: Values = { ja: [], en: [] }
  values.ja.push(value1.ja)
  values.en.push(value1.en)
  values.ja.push(value2.ja)
  values.en.push(value2.en)
  values.ja.push(value3.ja)
  values.en.push(value3.en)
  values.ja.push(value4.ja)
  values.en.push(value4.en)
  values.ja.push(value5.ja)
  values.en.push(value5.en)
  const members = await GetMembers()

  return {
    props: {
      story,
      team,
      mindset,
      company,
      purpose,
      mission,
      vision,
      values,
      members,
    }
  }
}

const Member: React.FC<{ m: LocalizedMemberWithBlocks }> = ({ m }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const showIntroStyle = {
    display: '-webkit-box',
  }
  const hideIntroStyle = {
    display: 'none',
  }
  const showFullStyle = {
    display: 'block',
  }
  const hideFullStyle = {
    display: 'none',
  }
  const onClick = () => setOpen(!open)
  return (
    <div className={styles.member}>
      <div className={styles.memberAvatar}>
        {m.props.user && <img src={m.props.user.avatar} />}
        {!m.props.user && <img src="/static/hirose.webp" />}
      </div>
      <h3 className={styles.memberName}>
        {m.props.name}
      </h3>
      <p className={styles.memberRole}>
        {m.props.role}
      </p>
      <div className={styles.memberProfile} style={open ? hideIntroStyle : showIntroStyle}>
        {m.props.excerpt}
      </div>
      <div className={styles.memberFullProfile} style={open ? showFullStyle : hideFullStyle}>
        <Blocks blocks={m.blocks} />
      </div>
      <p className={styles.viewFullProfile} onClick={onClick}>
        {open ? t('about.closeFullProfile') : t('about.viewFullProfile')}
      </p>
    </div>
  )
}

const About: NextPage<Props> = ({ story, team, mindset, company, purpose, mission, vision, values, members }) => {
  const { t } = useTranslation()
  const { lang } = useSelectedLanguage()
  const s = lang === 'en' ? story.en : story.ja
  const tt = lang === 'en' ? team.en : team.ja
  const p = lang === 'en' ? purpose.en : purpose.ja
  const m = lang === 'en' ? mission.en : mission.ja
  const v = lang === 'en' ? vision.en : vision.ja
  const vv = lang === 'en' ? values.en : values.ja
  const mm = lang === 'en' ? members.en : members.ja
  const mi = lang === 'en' ? mindset.en : mindset.ja
  const co = lang === 'en' ? company.en : company.ja
  //const [query] = useLanguageQuery()

  return (
    <main>
      <div className={styles.purposeImage}>
        <img src="/static/beautiful.jpg" width="100%" />
        <div className={styles.purposeImageLicense}>
          <Unsplash href="https://unsplash.com/@frankiefoto?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" name="frank mckenna"/>
        </div>
        <div className={styles.purposeBox}>
          <div className={styles.purposeInner}>
            <p className={styles.mindsetLabel}>
              {t('about.purpose')}
            </p>
            <h1 className={styles.purpose}>
              {p.props.title}
            </h1>
          </div>
        </div>
        <div className={styles.purposeBody}>
          <div className={styles.purposeBodyInner}>
            <Blocks blocks={p.blocks} />
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.storyBox}>
          <div className={styles.storyText}>
            <h1>
              {t('about.story')}
            </h1>
            <div>
              <Blocks blocks={s.blocks} />
            </div>
          </div>
          <div className={styles.storyImage}>
            <img src="/static/dna.jpg" width="100%" />
            <div className={styles.storyLicense}>
              <Unsplash href="https://unsplash.com/@lanirudhreddy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" name="ANIRUDH"/>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.mindset}>
          <header className={styles.mindsetHeader}>
            <h2 className={styles.mindsetTitle}>
              {t('about.mindset')}
            </h2>
            <div className={styles.mindsetDesc}>
              <Blocks blocks={mi.blocks} />
            </div>
          </header>

          <div className={styles.missionVisionBox}>
            <div className={styles.missionVisionInner}>
              <p className={styles.mindsetLabel}>
                {t('about.mission')}
              </p>
              <h2 className={styles.missionVision}>
                {m.props.title}
              </h2>
              <div className={styles.missionVisionBody}>
                <Blocks blocks={m.blocks} />
              </div>
            </div>

            <div className={styles.missionVisionInner}>
              <p className={styles.mindsetLabel}>
                {t('about.vision')}
              </p>
              <h2 className={styles.missionVision}>
                {v.props.title}
              </h2>
              <div className={styles.missionVisionBody}>
                <Blocks blocks={v.blocks} />
              </div>
            </div>
          </div>

          <div className={styles.valuesBox}>
            <p className={styles.mindsetLabel}>
              {t('about.values')}
            </p>
            <div className={styles.values}>
              {vv.map((v, i) => (
                <div key={i}>
                  <h3 className={styles.value}>
                    {v.props.title}
                  </h3>
                  <div className={styles.valueBody}>
                    <Blocks blocks={v.blocks} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <header className={styles.teamHeader}>
          <h2 className={styles.teamTitle}>
            {t('about.team')}
          </h2>
          <div className={styles.teamDesc}>
            <Blocks blocks={tt.blocks} />
          </div>
        </header>

        <div className={styles.members}>
          {mm.map((m, i) => (
            <Member key={i} m={m} />
          ))}
        </div>
      </div>

      <div className="container">
        <header className={styles.companyOverviewHeader}>
          <h2 className={styles.companyOverviewTitle}>
            {t('about.companyOverview')}
          </h2>
        </header>
        <div className={styles.companyOverviewDesc}>
          <Blocks blocks={co.blocks} />
        </div>
      </div>
    </main>
  )
}

export default About
