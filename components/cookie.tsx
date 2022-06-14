import React, { ReactNode, useEffect } from 'react'
import Link from 'next/link'
import * as ReactGA from 'react-ga'
import CookieConsent, {
  getCookieConsentValue,
  Cookies,
} from 'react-cookie-consent'
import { useTranslation } from '../i18n'

type Props = {
  children?: ReactNode
}

const Cookie: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation()

  const initGA = (id: string) => {
    if (process.env.NODE_ENV === 'production') {
      ReactGA.initialize(id)
    }
  }

  const handleAcceptCookie = () => {
    if (process.env.GOOGLE_ANALYTICS_ID) {
      initGA(process.env.GOOGLE_ANALYTICS_ID)
    }
  }

  useEffect(() => {
    const isConsent = getCookieConsentValue()
    if (isConsent === 'true') {
      handleAcceptCookie()
    }
  }, [])

  return (
    <>
      <CookieConsent
        onAccept={handleAcceptCookie}
        buttonText={t('cookie.buttonText')}
        expires={150}
        style={{
          backgroundColor: "#eee",
          color: "#000",
        }}
        buttonStyle={{
          backgroundColor: "#999",
          color: "#fff",
          borderRadius: "30px",
          fontWeight: "bold",
          padding: "var(--spacing-2) var(--spacing-5)",
        }}
      >
        {t('cookie.message')}
        {` `}
        <Link href="/privacy" className="privacy-link">
          <a>Privacy Policy</a>
        </Link>.
      </CookieConsent>
    </>
  )
}

export default Cookie
