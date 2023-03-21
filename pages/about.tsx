import React, { useState } from 'react'
import type { NextPage, GetStaticProps } from 'next'
import Image from 'next/image'
import t, { lang, useTranslation, useSelectedLanguage, getT } from '../i18n'
import { GetMindset, LocalizedMindsetWithBlocks, GetValues, LocalizedMindset, mindsetQuery } from '../lib/mindset'
import { Content, GetContent } from '../lib/content'
import { Blocks } from 'notionate/dist/components'
import { GetMembers, Members, LocalizedMemberWithBlocks } from '../lib/member'
import styles from '../styles/About.module.css'
import Unsplash from '../components/unsplash'
import Hed from '../components/hed'
import CreateOgImage from '../lib/ogimage'
import Modal from 'react-modal'

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
  const values = await GetValues()
  const members = await GetMembers()

  const ogimage = await CreateOgImage({
    id: `about-${lang}`,
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
      purpose: purpose[lang],
      mission: mission[lang],
      vision: vision[lang],
      values: values,
      members: members[lang],
      ogimage,
    }
  }
}

const Member: React.FC<{ m: LocalizedMemberWithBlocks }> = ({ m }) => {
  const [modalIsOpen, setIsOpen] = useState(false)
  function openModal() {
    setIsOpen(true)
  }
  function afterOpenModal() {
  }
  function closeModal() {
    setIsOpen(false)
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      height: '80%',
    },
  }

  if (m.props.roles.includes('Investor')) {
    return <></>
  }

  return (
    <div className={styles.member}>
      <div className={styles.memberAvatar}>
        {m.props.cover && <Image src={m.props.cover} fill={true} alt={m.props.name} />}
        {!m.props.cover && m.props.user && <Image src={m.props.user.avatar} fill={true} alt={m.props.name} />}
      </div>
      <h3 className={styles.memberName}>
        {m.props.name}
      </h3>
      <p className={styles.memberRole}>
        {m.props.title}
      </p>
      <div className={styles.memberProfile}>
        {m.props.excerpt}
      </div>
      <p className={styles.viewFullProfile} onClick={openModal}>
        {t('about.viewFullProfile')}
      </p>
      <Modal isOpen={modalIsOpen} onAfterOpen={afterOpenModal} onRequestClose={closeModal} className={styles.reactModal} overlayClassName={styles.reactModalOverlay} contentLabel="Modal">
        <div className={styles.modal}>
          <div className={styles.modalMemberAvatar}>
            {m.props.cover && <Image src={m.props.cover} fill={true} alt={m.props.name} />}
            {!m.props.cover && m.props.user && <Image src={m.props.user.avatar} fill={true} alt={m.props.name} />}
          </div>
          <div className={styles.modalText}>
            <h3 className={styles.modalMemberName}>
              {m.props.name}
            </h3>
            <p className={styles.modalMemberRole}>
              {m.props.title}
            </p>
            <div className={styles.modalMemberFullProfile}>
              <Blocks blocks={m.blocks} />
            </div>
            <p className={styles.closeModal} onClick={closeModal}>
              {t('about.closeFullProfile')}
            </p>
          </div>
        </div>
      </Modal>
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
        {m.props.cover && <Image src={m.props.cover} fill={true} alt={m.props.name} />}
        {!m.props.cover && m.props.user && <Image src={m.props.user.avatar} fill={true} alt={m.props.name} />}
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
        <div className={styles.purposeImageInner}>
          <Image src="/static/beautiful.jpg" fill={true} alt="beautiful location" />
        </div>
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
            <Image src="/static/dna.jpg" fill={true} alt="dna" />
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
