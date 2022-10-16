import React from 'react'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { formatDate } from '../lib/date'
import { Blog } from '../lib/blog'
import { companyIcon, fileIcon, usersIcon, calendarIcon } from '../components/icons'
import { useLanguageQuery } from '../i18n'

type Props = {
  news: Blog[]
  lang: string
}

const NewsList: React.FC<Props> = ({ news, lang }) => {
  const [query] = useLanguageQuery()
  function tagIcon(tag: string) {
    switch (tag) {
      case 'News':
        return <></>
      case 'Company':
        return (
          <>
            <span className={styles.newsIcon}>{companyIcon()}</span>
            {tag}
          </>
        )
      case 'Publication':
        return (
          <>
            <span className={styles.newsIcon}>{fileIcon()}</span>
            {tag}
          </>
        )
      case 'Event':
        return (
          <>
            <span className={styles.newsIcon}>{usersIcon()}</span>
            {tag}
          </>
        )
      default:
        return (
          <>
            {tag}
          </>
        )
    }
  }

  return (
    <div className={styles.newsContainer}>
      {news.map((post, i) => (
        <div className={styles.news} key={i}>
          <ul className={styles.newsTags}>
            {post.tags.map((tag, i) => (
              tag !== 'News' && <li key={i}>
                {tagIcon(tag)}
              </li>
            ))}
          </ul>
          <div>
            <h3 className={styles.newsTitle}>
              <Link href={{ pathname: `/news/${post.slug}`, query }}>
                {post.title}
              </Link>
            </h3>
            <p className={styles.newsDate}>
              <span className={styles.newsCalendar}>{calendarIcon()}</span>
              {formatDate(post.date, lang)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NewsList