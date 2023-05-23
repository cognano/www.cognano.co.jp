import React, { ReactNode } from 'react'
import Link from 'next/link'
import Logo from './logo'
import styles from '../styles/App.module.css'
import t from '../i18n'
import { envelopeIcon } from './icons'
import Language from './language'

type Props = {
  children?: ReactNode
}

const Header: React.FC<Props> = ({ children }) => {
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
              <Link href="/datasets/AVIDa-hIL6">
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
        </nav>
        <div className={styles.langnav}>
          <Language top={true} />
        </div>
        <div className={styles.infonav}>
          <div className={styles.contact}>
            <Link href="/contact">
              <span className={styles.envelopeIcon}>{envelopeIcon()}</span>
              {t('header.contact')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
