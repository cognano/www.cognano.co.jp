import Link from 'next/link'
import { useRouter } from 'next/router'
import type React from 'react'
import { type ReactNode, useEffect, useState } from 'react'
import t from '../i18n'
import styles from '../styles/App.module.css'
import { envelopeIcon } from './icons'
import Language from './language'
import Logo from './logo'

type Props = {
  children?: ReactNode
}

const Header: React.FC<Props> = ({ children }) => {
  const router = useRouter()
  const border = router.pathname === '/' ? '' : styles.borderHeader
  const [menuOpen, setMenuOpen] = useState(false)
  const [researchOpen, setResearchOpen] = useState(false)

  useEffect(() => {
    const handleRouteChange = () => {
      setMenuOpen(false)
      setResearchOpen(false)
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => router.events.off('routeChangeStart', handleRouteChange)
  }, [router.events])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className={styles.header}>
      <div className={`${styles.headerinner} ${border} container`}>
        <h1 className={styles.sitename}>
          <Logo />
        </h1>
        <nav className={styles.globalnav}>
          <ul>
            <li>
              <Link href='/about'>{t('header.about')}</Link>
            </li>
            <li
              className={styles.hasDropdown}
              onMouseEnter={() => setResearchOpen(true)}
              onMouseLeave={() => setResearchOpen(false)}
            >
              <span className={styles.dropdownLabel}>
                {t('header.research')}
              </span>
              <ul
                className={`${styles.dropdown} ${researchOpen ? styles.dropdownOpen : ''}`}
              >
                <li>
                  <Link href='/research' onClick={() => setResearchOpen(false)}>
                    {t('header.research')}
                  </Link>
                </li>
                <li>
                  <Link href='/projects' onClick={() => setResearchOpen(false)}>
                    {t('header.projects')}
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href='/collaboration-sample-data-request'>
                {t('header.antibodies')}
              </Link>
            </li>
            <li>
              <Link href='/datasets'>{t('header.datasets')}</Link>
            </li>
            <li>
              <Link href='/blog'>{t('header.blog')}</Link>
            </li>
            <li>
              <Link href='/news'>{t('header.news')}</Link>
            </li>
          </ul>
        </nav>
        <div className={styles.langnav}>
          <Language top={true} />
        </div>
        <div className={styles.infonav}>
          <div className={styles.contact}>
            <Link href='/contact'>
              <span className={styles.envelopeIcon}>{envelopeIcon()}</span>
              <span className={styles.contactText}>{t('header.contact')}</span>
            </Link>
          </div>
        </div>
        <button
          type='button'
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          aria-label={menuOpen ? t('header.close') : t('header.menu')}
          aria-expanded={menuOpen}
          aria-controls='mobile-menu-panel'
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        id='mobile-menu-panel'
        className={`${styles.mobilePanel} ${menuOpen ? styles.mobilePanelOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className={styles.mobileNav}>
          <ul>
            <li>
              <Link href='/about'>{t('header.about')}</Link>
            </li>
            <li>
              <Link href='/research'>{t('header.research')}</Link>
            </li>
            <li>
              <Link href='/projects'>{t('header.projects')}</Link>
            </li>
            <li>
              <Link href='/collaboration-sample-data-request'>
                {t('header.antibodies')}
              </Link>
            </li>
            <li>
              <Link href='/datasets'>{t('header.datasets')}</Link>
            </li>
            <li>
              <Link href='/blog'>{t('header.blog')}</Link>
            </li>
            <li>
              <Link href='/news'>{t('header.news')}</Link>
            </li>
            <li>
              <Link href='/contact'>{t('header.contact')}</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
