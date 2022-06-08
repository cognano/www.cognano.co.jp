import React, { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Logo from './logo'

type Props = {
  children?: ReactNode
}

const en = {
  language: `Language`,
  news: `News`,
  projects: `Projects`,
  blog: `Blog`,
  about: `About`,
  contact: `Contact`,
}
const ja = {
  language: `言語`,
  news: `お知らせ`,
  projects: `プロジェクト`,
  blog: `ブログ`,
  about: `私たちについて`,
  contact: `お問合わせ`,
}

const Header: React.FC<Props> = ({ children }) => {
  const { locale } = useRouter()
  const t = locale === 'en' ? en : ja

  return (
    <>
      <header>
        <div className="info-nav">
          {t.language}:
          <ul>
            <li><Link href="/" locale="en" passHref><a>English</a></Link></li>
            <li><Link href="/ja" locale="ja" passHref><a>日本語</a></Link></li>
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
          margin: 0;
          padding: 0;
        }
        .info-nav {
          margin: 0;
          padding: var(--spacing-1) var(--spacing-4) var(--spacing-2);
          text-align: right;
          background-color: #eee;
          font-size: var(--fontSize-0);
          color: #888;
          font-weight: bold;
        }
        .info-nav a {
          color: #333;
          border-bottom: 1px solid #999;
        }
        .info-nav a:hover {
          border-bottom: none;
        }
        .info-nav li {
          padding-left: var(--spacing-3);
        }
        .info-nav ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
          display: inline;
          font-weight: normal;
        }
        .info-nav li {
          display: inline;
        }
        .header-inner {
          display: grid;
          grid-template-columns: 240px auto;
          margin-top: var(--spacing-10);
          margin-left: var(--spacing-20);
          margin-right: var(--spacing-20);
        }
        .site-name {
          font-size: var(--fontSize-5);
          margin: 0;
          padding: 0;
        }
        .global-nav {
          margin: 0;
          margin-top: var(--spacing-1);
          text-align: right;
          justify-self: end;
        }
        .global-nav ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
          justify-items: end;
          gap: var(--spacing-10);
          max-width: 800px;
        }
        .global-nav li {
          font-size: var(--fontSize-0);
          font-family: var(--fontFamily-sans);
          margin: 0;
          text-align: center;
          white-space: nowrap;
        }
        .global-nav a {
          text-decoration: none;
          display: block;
          margin: 0;
          padding: var(--spacing-2) var(--spacing-5);
          background: #e0e0e0;
          color: #000;
          border-radius: 30px;
          width: 140px;
        }
        .global-nav a:hover {
          background: #ccc;
        }
        .global-nav span {
          padding-right: var(--spacing-2);
        }
      `}</style>
    </>
  )
}

export default Header
