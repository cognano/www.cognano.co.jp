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
                <a>{t('header.about')}</a>
              </Link>
            </li>
            <li>
              <Link href={{ pathname: '/research', query }}>
                <a>{t('header.research')}</a>
              </Link>
            </li>
            <li>
              <Link href={{ pathname: '/projects', query }}>
                <a>{t('header.projects')}</a>
              </Link>
            </li>
            <li>
              <Link href={{ pathname: '/blog', query }}>
                <a>{t('header.blog')}</a>
              </Link>
            </li>
            <li>
              <Link href={{ pathname: '/news', query }}>
                <a>{t('header.news')}</a>
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.infonav}>
          <Link href={{ pathname: '/contact', query }}>
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
