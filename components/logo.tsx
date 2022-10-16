import React, { ReactNode } from 'react'
import Link from 'next/link'
import { useLanguageQuery } from '../i18n'

type Props = {
  children?: ReactNode
}

const Logo: React.FC<Props> = ({ children }) => {
  const [query] = useLanguageQuery()
  return (
    <span className="logo">
      <Link href={{ pathname: '/', query }}>
        <a>COGNANO <span role="img" aria-label="alpaca">🦙</span></a>
      </Link>
    </span>
  )
}

export default Logo
