import React, { ReactNode } from 'react'
import Link from 'next/link'
import Logo from './logo'
import styles from '../styles/App.module.css'
import { useTranslation } from '../i18n'
import { envelopeIcon } from './icons'

type Props = {
  children?: ReactNode
}

const Header: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation()

  return (
    <header className={styles.header}>
      <div className={`${styles.headerinner} container`}>
        <h1 className={styles.sitename}>
          <Logo />
        </h1>
        <nav className={styles.globalnav}>
          <ul>
            <li>
              <Link href="/about">
                <a>{t('header.about')}</a>
              </Link>
            </li>
            <li>
              <Link href="/projects">
                <a>{t('header.projects')}</a>
              </Link>
            </li>
            <li>
              <Link href="/blog">
                <a>{t('header.blog')}</a>
              </Link>
            </li>
            <li>
              <Link href="/news">
                <a>{t('header.news')}</a>
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.infonav}>
          <Link href="/contact">
            <a>
              <span className={styles.envelopeIcon}>{envelopeIcon()}</span>
              {t('header.contact')}
            </a>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
