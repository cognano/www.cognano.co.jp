import React, { ReactNode } from 'react'
import Link from 'next/link'

type Props = {
  children?: ReactNode
}

const Logo: React.FC<Props> = ({ children }) => {
  return (
    <span className="logo">
      <Link href="/">
        COGNANO
      </Link>
    </span>
  )
}

export default Logo
