import type React from 'react'
import { useEffect, useState } from 'react'
import t from '../i18n'
import styles from '../styles/Contact.module.css'

type Props = {
  // Pass the address split and reversed so that it does not appear in the
  // prerendered HTML or the bundle as a harvestable string
  user: string
  domain: string
}

const reverse = (s: string) => s.split('').reverse().join('')

const CopyEmail: React.FC<Props> = ({ user, domain }) => {
  const [email, setEmail] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setEmail(`${reverse(user)}@${reverse(domain)}`)
  }, [user, domain])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={styles.copyEmail}>
      <code className={styles.email}>{email || '...'}</code>
      <button
        className={styles.copyButton}
        type='button'
        onClick={handleCopy}
        disabled={!email}
      >
        {copied ? t('contact.copied') : t('contact.copy')}
      </button>
    </div>
  )
}

export default CopyEmail
