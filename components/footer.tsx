import React, { ReactNode, useState } from 'react'
import Link from 'next/link'
import Logo from './logo'
import styles from '../styles/App.module.css'

import { useTranslation, LanguageSwitcher, useSelectedLanguage, useLanguageQuery } from '../i18n'
import { twitterIcon, youtubeIcon, facebookIcon, linkedinIcon, languageIcon, sortdownIcon, githubIcon } from './icons'

type Props = {
  children?: ReactNode
}

const Footer: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation()
  const [query] = useLanguageQuery()
  const { lang } = useSelectedLanguage()
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
        </div>
        <p className={styles.footerinfonav}>
          <Link href={{ pathname: '/contact', query }}>
            <a>{t('header.contact')}</a>
          </Link>
        </p>
      </div>
      <div className={styles.siteinfo}>
        <div>
          <div className={styles.languages} onClick={onClick}>
            <span className={styles.languageIcon}>{languageIcon()}</span>
            <span>{t(`language.${lang}`)}</span>
            <span className={styles.sortdownIcon}>{sortdownIcon()}</span>
            {open && <div className={styles.switcher}>
              <ul>
                <li>
                  <LanguageSwitcher lang="en">
                    {t('language.en')}
                    <span className={styles.langen}>English (US)</span>
                  </LanguageSwitcher>
                </li>
                <li>
                  <LanguageSwitcher lang="ja">
                    {t('language.ja')}
                    <span className={styles.langen}>日本語</span>
                  </LanguageSwitcher>
                </li>
              </ul>
            </div>}
          </div>
          <p className={styles.privacy}>
            <Link href={{ pathname: '/privacy', query }}>
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
    </footer>
  )
}

export default Footer
