import t, { lang } from '../i18n'
import { MutatingDots } from 'react-loader-spinner'
import { useState } from 'react'
import { GetStaticProps, NextPage } from 'next'
import { Page } from 'rotion/ui'
import { GetContent, Content } from '../lib/content'
import styles from '../styles/Contact.module.css'
import CreateOgImage from '../lib/ogimage'
import Hed from '../components/hed'

type Props = {
  contact: Content
  ogimage: string
}

export const getStaticProps: GetStaticProps<{}> = async () => {
  const contact = await GetContent('contact')

  const ogimage = await CreateOgImage({
    id: `contact-${lang}`,
    title: contact![lang]!.title,
    desc: contact![lang]!.excerpt,
  })

  return {
    props: {
      contact: contact![lang],
      ogimage,
    }
  }
}

const formError = (msg: string) => {
  return (
    <p className={styles.error}>{msg}</p>
  )
}

const Contact: NextPage<Props> = ({ contact, ogimage }) => {
  const endpoint = `https://api.cognano.co.jp/`
  const initQuery = {
    name: ``,
    email: ``,
    message: ``,
  }
  const [formStatus, setFormStatus] = useState(false)
  const [lockStatus, setLockStatus] = useState(false)
  const [query, setQuery] = useState(initQuery)
  const [errors, setErrors] = useState(initQuery)

  const handleChange = () => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name
    const value = e.target.value
    setQuery((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const validateEmail = (v: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(v)
  }

  const validate = () => {
    let isValid = true

    Object.entries(query).forEach(([k, v]) => {
      if (v.length === 0) {
        isValid = false
        setErrors((prevState) => ({
          ...prevState,
          [k]: t('contact.required')
        }))
      } else if (v.length < 3) {
        isValid = false
        setErrors((prevState) => ({
          ...prevState,
          [k]: t('contact.tooshort')
        }))
      } else if (k === 'email' && !validateEmail(v)) {
        isValid = false
        setErrors((prevState) => ({
          ...prevState,
          [k]: t('contact.emailinvalid') 
        }))
      }
    })

    return isValid
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement | HTMLTextAreaElement>) => {
    e.preventDefault()
    setLockStatus(true)
    setErrors(initQuery)

    if (!validate()) {
      setLockStatus(false)
      return
    }

    const formData = new FormData()
    Object.entries(query).forEach(([key, value]) => {
      formData.append(key, value)
    })

    fetch(endpoint, { method: 'POST', body: formData })
      .then(res => {
        setLockStatus(false)
        setFormStatus(true)
        setQuery(initQuery)
        console.log(res)
      })
      .catch(err => {
        setLockStatus(false)
        console.log(err)
      })
  }

  return (
    <>
      <Hed title={contact.title} desc={contact.excerpt} ogimage={ogimage} />

      <header className="container">
        <h1>{contact.title}</h1>
        <div className={styles.contactDesc}>
          <Page blocks={contact.blocks} />
        </div>
      </header>

      <section className="container">
        <form className={styles.form} onSubmit={handleSubmit}>

          <div>
            <div className={styles.line}>
              <label htmlFor="name" className={styles.label}>
                {t('contact.name')}
              </label>
              <div className={styles.input}>
                <input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  name="name"
                  value={query.name}
                  onChange={handleChange()}
                />
                {errors.name && formError(errors.name)}
              </div>
            </div>

            <div className={styles.line}>
              <label htmlFor="email" className={styles.label}>
                {t('contact.email')}
              </label>
              <div className={styles.input}>
                <input
                  type="email"
                  id="email"
                  placeholder="youremail@example.com"
                  name="email"
                  value={query.email}
                  onChange={handleChange()}
                />
                {errors.email && formError(errors.email)}
              </div>
            </div>
          </div>

          <div>
            <div className={styles.line}>
              <label htmlFor="message" className={styles.label}>
                {t('contact.message')}
              </label>
              <div className={styles.input}>
                <textarea
                  name="message"
                  id="message"
                  rows={5}
                  value={query.message}
                  onChange={handleChange()}
                />
                {errors.message && formError(errors.message)}
              </div>
            </div>

            <div className={styles.line}>
              <span></span>
              <div className={styles.input}>
                {formStatus ? (<p>{t('contact.thanks')}</p>) : lockStatus ? (<MutatingDots color="#666" secondaryColor="#000" height={100} width={100} />) : (<button className={styles.button} type="submit" disabled={lockStatus}>{t('contact.submit')}</button>)}
              </div>
            </div>
          </div>

        </form>
      </section>
    </>
  )
}

export default Contact
