import React, { ReactNode } from 'react'
import Link from 'next/link'
import Logo from './logo'

type Props = {
  children?: ReactNode
}

const Header: React.FC<Props> = ({ children }) => {
  return (
    <>
      <header>
        <h1 className="site-name">
          <Link href="/">
            <a>CogNano <span role="img" aria-label="alpaca">🦙</span></a>
          </Link>
        </h1>
        <nav>
          <ul>
            <li>
              <Link href="/research">
                <a>Research</a>
              </Link>
            </li>
            <li>
              <Link href="/blog">
                <a>Blog</a>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <a>About</a>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <a>Contact</a>
              </Link>
            </li>
          </ul>
        </div>

        <div className="container">
          <div className="header-inner">
            <h1 className="site-name">
              <Logo />
            </h1>
            <nav className="global-nav">
              <ul>
                <li>
                  <Link href="/about">
                    <a>{t.about}</a>
                  </Link>
                </li>
                <li>
                  <Link href="/news">
                    <a>{t.news}</a>
                  </Link>
                </li>
                <li>
                  <Link href="/projects">
                    <a>{t.projects}</a>
                  </Link>
                </li>
                <li>
                  <Link href="/blog">
                    <a>{t.blog}</a>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <a>{t.contact}</a>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <style jsx>{`
        header {
          display: grid;
          grid-template-columns: 200px auto;
          margin-left: var(--spacing-20);
          margin-right: var(--spacing-20);
          margin-bottom: var(--spacing-10);
        }
        .site-name {
          font-size: var(--fontSize-5);
          margin: 0;
        }
        nav {
          margin: 0;
          margin-top: var(--spacing-1);
          text-align: right;
          justify-self: end;
        }
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          justify-items: end;
          gap: var(--spacing-10);
          max-width: 800px;
        }
        li {
          font-size: var(--fontSize-0);
          font-family: var(--fontFamily-sans);
          margin: 0;
          text-align: center;
          white-space: nowrap;
        }
        nav a {
          text-decoration: none;
          display: block;
          margin: 0;
          padding: var(--spacing-2) var(--spacing-5);
          background: #e0e0e0;
          color: #000;
          border-radius: 30px;
          width: 140px;
        }
        nav a:hover {
          background: #ccc;
        }
        nav span {
          padding-right: var(--spacing-2);
        }
      `}</style>
    </>
  )
}

export default Header
