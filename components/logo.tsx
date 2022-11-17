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
        COGNANO <span role="img" aria-label="alpaca">🦙</span>
      </Link>
    </span>
  )
}

export default Logo
