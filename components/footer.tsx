import React, { ReactNode } from 'react'
import Link from 'next/link'
import Logo from './logo'

type Props = {
  children?: ReactNode
}

const Footer: React.FC<Props> = ({ children }) => {
  return (
    <>
      <footer>
        <div className="footer-inner container">
          <p>
            <Logo />
            <span className="copyright">
              &copy; {new Date().getFullYear()} cognano.{` `}
            </span>
            <span className="site-license">
              Powered by <a href="https://nextjs.org">Next.js</a> and <a href="https://wordpress.org">WordPress</a>.
            </span>
          </p>
        </div>
      </footer>

      <style jsx>{`
        footer {
          margin-top: var(--spacing-32);
          background-color: #888;
        }
        .footer-inner {
          margin-top: var(--spacing-1);
          margin-bottom: var(--spacing-1);
        }
        .site-license {
          font-family: var(--fontFamily-sans);
          margin: var(--spacing-0) var(--spacing-20);
          font-size: var(--fontSize-0);
          color: #fff;
        }
        footer a {
          color: #fff;
          font-weight: bold;
        }
      `}</style>
    </>
  )
}

export default Footer
