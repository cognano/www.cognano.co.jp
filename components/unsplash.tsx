import React, { ReactNode } from 'react'
import styles from '../styles/App.module.css'

type Props = {
  children?: ReactNode
  href?: string
  name?: string
  host?: string
  hostUrl?: string
}

const Unsplash: React.FC<Props> = ({ children, href, name, host, hostUrl }) => {
  const unsplashUrl = `https://unsplash.com`
  if (host && hostUrl) {
    return (
      <p className={styles.unsplash}>
        Photo by <a href={href} target="_blank" rel="noopener noreferrer">{name}</a> on <a href={hostUrl} target="_blank" rel="noopener noreferrer">{host}</a>
      </p>
    )
  }

  if (href && name) {
    return (
      <p className={styles.unsplash}>
        Photo by <a href={href} target="_blank" rel="noopener noreferrer">{name}</a> on <a href={unsplashUrl} target="_blank" rel="noopener noreferrer">Unsplash</a>
      </p>
    )
  }

  return (
    <p className={styles.unsplash}>
      Photo by <a href={unsplashUrl} target="_blank" rel="noopener noreferrer">Unsplash</a>
    </p>
  )
}

export default Unsplash
