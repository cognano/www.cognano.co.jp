import { useRouter } from 'next/router'
import type React from 'react'
import { type ReactNode, useState } from 'react'
import t, { lang } from '../i18n'
import styles from '../styles/Language.module.css'
import { languageIcon, sortdownIcon } from './icons'

type Props = {
  children?: ReactNode
  top?: boolean
}

const Language: React.FC<Props> = ({ children, top }) => {
  const [open, setOpen] = useState(false)
  const onClick = () => setOpen(!open)
  const router = useRouter()

  const locationHref = (l: string) => {
    const uri = decodeURI(router.asPath)
    const domain = l === 'en' ? 'cognanous.com' : 'www.cognano.co.jp'
    const url = `https://${domain}${uri}?lang=${l}`
    if (process.env.NODE_ENV === 'development') {
      console.log(`location href: ${url}`)
    } else if (document.location.host !== domain) {
      document.location.href = url
    }
  }
  const toEnglish = () => locationHref('en')
  const toJapanese = () => locationHref('ja')

  return (
    <div className={styles.languages} onClick={onClick}>
      <span className={styles.languageIcon}>{languageIcon()}</span>
      <span>{t(`language.${lang}`)}</span>
      <span className={styles.sortdownIcon}>{sortdownIcon()}</span>
      {open && (
        <div
          className={`${styles.switcher} ${top ? styles.switcherTop : null}`}
        >
          <ul>
            <li onClick={toEnglish}>
              <div>
                {t('language.en')}
                <span className={styles.langen}>English (US)</span>
              </div>
            </li>
            <li onClick={toJapanese}>
              <div>
                {t('language.ja')}
                <span className={styles.langen}>日本語</span>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Language
