import Link from 'next/link'
import type React from 'react'
import {
  calendarIcon,
  companyIcon,
  fileIcon,
  usersIcon,
} from '../components/icons'
import { useLanguageQuery } from '../i18n'
import type { Blog } from '../lib/blog'
import { formatDate } from '../lib/date'
import styles from '../styles/Home.module.css'

type Props = {
  news: Blog[]
}

export const tagIcon = (tag: string) => {
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
      return <>{tag}</>
  }
}

const NewsList: React.FC<Props> = ({ news }) => {
  return (
    <div className={styles.newsContainer}>
      {news.map((post, i) => (
        <div className={styles.news} key={i}>
          <ul className={styles.newsTags}>
            {post.tags.map(
              (tag, i) => tag !== 'News' && <li key={i}>{tagIcon(tag)}</li>,
            )}
          </ul>
          <div>
            <h3 className={styles.newsTitle}>
              <Link href={`/news/${post.slug}`}>{post.title}</Link>
            </h3>
            <p className={styles.newsDate}>
              <span className={styles.newsCalendar}>{calendarIcon()}</span>
              {formatDate(post.date)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NewsList
