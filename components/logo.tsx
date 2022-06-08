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
      <style jsx>{`
        .logo {
          letter-spacing: .2rem;
          margin: 0;
          font-family: var(--fontFamily-sans);
          font-weight: bold;
        }
        .logo a {
          color: var(--color-text);
        }
      `}</style>
    </>
  )
}

export default Logo
