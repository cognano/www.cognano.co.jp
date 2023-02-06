import React, { useState } from 'react'
import type { NextPage, GetStaticProps } from 'next'
import t, { lang, useTranslation, useSelectedLanguage, getT } from '../i18n'
import { GetMindset, LocalizedMindsetWithBlocks, LocalizedMindset, mindsetQuery } from '../lib/mindset'
import { Content, GetContent } from '../lib/content'
import { Blocks } from 'notionate/dist/components'
import { GetMembers, Members, LocalizedMemberWithBlocks } from '../lib/member'
import styles from '../styles/About.module.css'
import Unsplash from '../components/unsplash'
import Hed from '../components/hed'
import CreateOgImage from '../lib/ogimage'

type Props = {
  story: Content
  team: Content
  investors: Content
  mindset: Content
  company: Content
  purpose: LocalizedMindsetWithBlocks
  mission: LocalizedMindsetWithBlocks
  vision: LocalizedMindsetWithBlocks
  values: LocalizedMindsetWithBlocks[]
  members: LocalizedMemberWithBlocks[]
  ogimage: string
}

export const getStaticProps: GetStaticProps<{}> = async () => {
  const story = await GetContent('story')
  const team = await GetContent('team')
  const investors = await GetContent('investors')
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
  let values: LocalizedMindsetWithBlocks[] = []
  values.push(value1[lang])
  values.push(value2[lang])
  values.push(value3[lang])
  values.push(value4[lang])
  values.push(value5[lang])
  const members = await GetMembers()

  const ogimage = await CreateOgImage({
    id: 'about',
    title: t('header.about'),
    desc: purpose![lang].props.title,
  })

  return {
    props: {
      story: story![lang],
      team: team![lang],
      investors: investors![lang],
      mindset: mindset![lang],
      company: company![lang],
      purpose,
      mission,
      vision,
      values,
      members,
      ogimage,
    }
  }
}

const Member: React.FC<{ m: LocalizedMemberWithBlocks }> = ({ m }) => {
  const [open, setOpen] = useState(false)
  const showIntroStyle = {
    display: 'block',
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
  if (m.props.roles.includes('Investor')) {
    return <></>
  }
  return (
    <div className={styles.member}>
      <div className={styles.memberAvatar}>
        {m.props.cover && <img src={m.props.cover} />}
        {!m.props.cover && m.props.user && <img src={m.props.user.avatar} />}
      </div>
      <h3 className={styles.memberName}>
        {m.props.name}
      </h3>
      <p className={styles.memberRole}>
        {m.props.title}
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

const Investor: React.FC<{ m: LocalizedMemberWithBlocks }> = ({ m }) => {
  if (!m.props.roles.includes('Investor')) {
    return <></>
  }
  return (
    <div className={styles.investor}>
      <div className={styles.memberAvatar}>
        {m.props.cover && <img src={m.props.cover} />}
        {!m.props.cover && m.props.user && <img src={m.props.user.avatar} />}
      </div>
      <h3 className={styles.memberName}>
        {m.props.name}
      </h3>
      <p className={styles.memberRole}>
        {m.props.title}
      </p>
    </div>
  )
}

const About: NextPage<Props> = ({ story, team, investors, mindset, company, purpose, mission, vision, values, members, ogimage }) => {
  return (
    <main>
      <Hed title={t('header.about')} desc={purpose.props.title} ogimage={ogimage} />
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
              {purpose.props.title}
            </h1>
            <div className={styles.purposeBody}>
              <div className={styles.purposeBodyInner}>
                <Blocks blocks={purpose.blocks} />
              </div>
            </div>
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
              <Blocks blocks={story.blocks} />
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
              <Blocks blocks={mindset.blocks} />
            </div>
          </header>

          <div className={styles.missionVisionBox}>
            <div className={styles.missionVisionInner}>
              <p className={styles.mindsetLabel}>
                {t('about.mission')}
              </p>
              <h2 className={styles.missionVision}>
                {mission.props.title}
              </h2>
              <div className={styles.missionVisionBody}>
                <Blocks blocks={mission.blocks} />
              </div>
            </div>

            <div className={styles.missionVisionInner}>
              <p className={styles.mindsetLabel}>
                {t('about.vision')}
              </p>
              <h2 className={styles.missionVision}>
                {vision.props.title}
              </h2>
              <div className={styles.missionVisionBody}>
                <Blocks blocks={vision.blocks} />
              </div>
            </div>
          </div>

          <div className={styles.valuesBox}>
            <p className={styles.mindsetLabel}>
              {t('about.values')}
            </p>
            <div className={styles.values}>
              {values.map((v, i) => (
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
            <Blocks blocks={team.blocks} />
          </div>
        </header>

        <div className={styles.members}>
          {members.map((m, i) => (
            <Member key={i} m={m} />
          ))}
        </div>
      </div>

      <div className="container">
        <header className={styles.advisorsHeader}>
          <h2 className={styles.advisorsTitle}>
            {t('about.advisors')}
          </h2>
          <div className={styles.teamDesc}>
            <Blocks blocks={investors.blocks} />
          </div>
        </header>

        <div className={styles.members}>
          {members.map((m, i) => (
            <Investor key={i} m={m} />
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
          <Blocks blocks={company.blocks} />
        </div>
      </div>
    </main>
  )
}

export default About
