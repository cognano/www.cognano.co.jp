import React, { ReactNode, useState } from 'react'
import Link from 'next/link'
import Logo from './logo'
import styles from '../styles/App.module.css'
import t from '../i18n'
import {
  twitterIcon,
  youtubeIcon,
  facebookIcon,
  linkedinIcon,
  githubIcon,
  companyIcon,
  fileIcon,
  briefcaseIcon,
  pensquareIcon,
  newsIcon,
  databaseIcon,
} from './icons'
import Language from './language'

type Props = {
  children?: ReactNode
}

const Footer: React.FC<Props> = ({ children }) => {
  const nowYear = new Date().getFullYear()
  const [open, setOpen] = useState(false)
  const onClick = () => setOpen(!open)

  return (
    <footer className={`${styles.footer} container`}>
      <div className={styles.footerinner}>
        <Logo />
        <div className={styles.footernav}>
          <ul>
            <li>
              <Link href="/about">
                {t('header.about')}
              </Link>
            </li>
            <li>
              <Link href="/research">
                {t('header.research')}
              </Link>
            </li>
            <li>
              <Link href="/projects">
                {t('header.projects')}
              </Link>
            </li>
            <li>
              <Link href="/datasets">
                {t('header.datasets')}
              </Link>
            </li>
            <li>
              <Link href="/blog">
                {t('header.blog')}
              </Link>
            </li>
            <li>
              <Link href="/news">
                {t('header.news')}
              </Link>
            </li>
          </ul>
        </div>
        <p className={styles.footerinfonav}>
          <Link href="/contact">
            {t('header.contact')}
          </Link>
        </p>
      </div>
      <div className={styles.siteinfo}>
        <div>
          <Language />
          <p className={styles.privacy}>
            <Link href="/privacy">
              {t('footer.privacy')}
            </Link>
          </p>
          <p className={styles.copyright}>
            &copy; {nowYear} COGNANO, Inc.
          </p>
          <p className={styles.sitelicense}>
            Powered by <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a> and <a href="https://github.com/linyows/notionate" target="_blank" rel="noopener noreferrer">Notionate</a>.
          </p>
        </div>
        <p className={styles.snsnav}>
          <a className={styles.youtube} href="https://www.youtube.com/channel/UCffw3_nn9m_nJhOED6QS0vQ" target="_blank" rel="noopener noreferrer">{youtubeIcon()}</a>
          <a className={styles.twitter} href="https://twitter.com/cognano_inc" target="_blank" rel="noopener noreferrer">{twitterIcon()}</a>
          <a className={styles.facebook} href="https://www.facebook.com/profile.php?id=100057515646298" target="_blank" rel="noopener noreferrer">{facebookIcon()}</a>
          <a className={styles.linkedin} href="https://jp.linkedin.com/company/cognano" target="_blank" rel="noopener noreferrer">{linkedinIcon()}</a>
          <a className={styles.github} href="https://github.com/cognano" target="_blank" rel="noopener noreferrer">{githubIcon()}</a>
        </p>
      </div>

      <ul className={styles.mobileNav}>
        <li>
          <Link href="/about">
            {companyIcon()}
            {t('header.about')}
          </Link>
        </li>
        <li>
          <Link href="/research">
            {fileIcon()}
            {t('header.research')}
          </Link>
        </li>
        <li>
          <Link href="/projects">
            {briefcaseIcon()}
            {t('header.projects')}
          </Link>
        </li>
        <li>
          <Link href="/datasets">
            {databaseIcon()}
            {t('header.datasets')}
          </Link>
        </li>
        <li>
          <Link href="/blog">
            {pensquareIcon()}
            {t('header.blog')}
          </Link>
        </li>
        <li>
          <Link href="/news">
            {newsIcon()}
            {t('header.news')}
          </Link>
        </li>
      </ul>
    </footer>
  )
}

export default Footer
