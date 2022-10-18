import React, { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import CookieConsent, {
  getCookieConsentValue,
  Cookies,
} from 'react-cookie-consent'
import { useTranslation } from '../i18n'
import GA from './ga'

type Props = {
  children?: ReactNode
}

const Cookie: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation()

  const handleAcceptCookie = () => {
    setGA(<GA />)
  }

  const handleDeclineCookie = () => {
    Cookies.remove('_ga')
    Cookies.remove('_gat')
    Cookies.remove('_gid')
  }

  useEffect(() => {
    const isConsent = getCookieConsentValue()
    if (isConsent === 'true') {
      handleAcceptCookie()
    }
  }, [])

  const [initGA, setGA] = useState(() => { return (<></>)})
  const style = {
    backgroundColor: "#333",
    color: "#fff",
  }
  const contentStyle = {
    margin: "var(--spacing-10) var(--spacing-20)",
  }
  const buttonStyle = {
    backgroundColor: "var(--color-primary)",
    color: "#fff",
    borderRadius: "30px",
    fontWeight: "bold",
    padding: "var(--spacing-2) var(--spacing-5)",
    marginRight: "var(--spacing-20)",
  }
  const declineButtonStyle = {
    backgroundColor: "inherit",
    color: "#fff",
    borderRadius: "30px",
    border: "1px solid #888",
    fontWeight: "bold",
    padding: "var(--spacing-2) var(--spacing-5)",
  }
  const privacy = {
    fontWeight: "bold",
    borderBottom: "1px solid var(--color-primary)",
  }

  return (
    <>
      <CookieConsent
        enableDeclineButton={true}
        onAccept={handleAcceptCookie}
        onDecline={handleDeclineCookie}
        buttonText={t('cookie.buttonText')}
        declineButtonText={t('cookie.declineButtonText')}
        expires={150}
        style={style}
        contentStyle={contentStyle}
        buttonStyle={buttonStyle}
        declineButtonStyle={declineButtonStyle}
      >
        {t('cookie.message')}
        {` `}
        <Link href="/privacy" className="privacy-link">
          <a style={privacy}>Privacy Policy</a>
        </Link>.
      </CookieConsent>
      {initGA}
    </>
  )
}

export default Cookie
