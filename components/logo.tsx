import React, { ReactNode } from 'react'
import Link from 'next/link'

type Props = {
  children?: ReactNode
}

const Logo: React.FC<Props> = ({ children }) => {
  return (
    <>
      <span className="logo">
        <Link href="/">
          <a>COGNANO <span role="img" aria-label="alpaca">🦙</span></a>
        </Link>
      </span>
    </>
  )
}

export default Logo
