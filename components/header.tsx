import React, { ReactNode } from 'react'
import Link from 'next/link'
import Logo from './logo'
import styles from '../styles/App.module.css'
import { useTranslation, useLanguageQuery } from '../i18n'
import { envelopeIcon } from './icons'

type Props = {
  children?: ReactNode
}

const Header: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation()
  const [query] = useLanguageQuery()

  return (
    <header className={styles.header}>
      <div className={`${styles.headerinner} container`}>
        <h1 className={styles.sitename}>
          <Logo />
        </h1>
        <nav className={styles.globalnav}>
          <ul>
            <li>
              <Link href={{ pathname: '/about', query }}>
                {t('header.about')}
              </Link>
            </li>
            <li>
              <Link href={{ pathname: '/research', query }}>
                {t('header.research')}
              </Link>
            </li>
            <li>
              <Link href={{ pathname: '/projects', query }}>
                {t('header.projects')}
              </Link>
            </li>
            <li>
              <Link href={{ pathname: '/blog', query }}>
                {t('header.blog')}
              </Link>
            </li>
            <li>
              <Link href={{ pathname: '/news', query }}>
                {t('header.news')}
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.infonav}>
          <Link href={{ pathname: '/contact', query }}>
            <span className={styles.envelopeIcon}>{envelopeIcon()}</span>
            {t('header.contact')}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
