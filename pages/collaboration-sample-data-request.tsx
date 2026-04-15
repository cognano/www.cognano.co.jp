import type { GetStaticProps, NextPage } from 'next'
import { useState } from 'react'
import { MutatingDots } from 'react-loader-spinner'
import { Page } from 'rotion/ui'
import Hed from '../components/hed'
import t, { lang } from '../i18n'
import { type Content, GetContent } from '../lib/content'
import CreateOgImage from '../lib/ogimage'
import styles from '../styles/SampleDataRequest.module.css'

type Props = {
  dataRequest: Content
  terms: Content
  ogimage: string
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataRequest = await GetContent('data-request')
  const content = dataRequest![lang]!

  const termsContent = await GetContent('mta-vhh-antibodies')
  const terms = termsContent![lang]!

  const ogimage = await CreateOgImage({
    id: `collaboration-sample-data-request-${lang}`,
    title: content.title,
    desc: content.excerpt,
  })

  return {
    props: {
      dataRequest: content,
      terms,
      ogimage,
    },
  }
}

const formError = (msg: string) => {
  return <p className={styles.error}>{msg}</p>
}

const SampleDataRequest: NextPage<Props> = ({
  dataRequest,
  terms,
  ogimage,
}) => {
  const endpoint =
    lang === 'ja'
      ? 'https://api.cognano.co.jp/data-request'
      : 'https://api.cognanous.com/data-request'
  const initQuery = {
    name: '',
    affiliation: '',
    email: '',
    purpose: '',
  }
  const initErrors = {
    name: '',
    affiliation: '',
    email: '',
    purpose: '',
    agreement: '',
  }
  const [formStatus, setFormStatus] = useState(false)
  const [lockStatus, setLockStatus] = useState(false)
  const [query, setQuery] = useState(initQuery)
  const [errors, setErrors] = useState(initErrors)
  const [agreed, setAgreed] = useState(false)

  const handleChange =
    () => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const name = e.target.name
      const value = e.target.value
      setQuery((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }

  const validateEmail = (v: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(v)
  }

  const validate = () => {
    let isValid = true

    Object.entries(query).forEach(([k, v]) => {
      if (v.length === 0) {
        isValid = false
        setErrors((prevState) => ({
          ...prevState,
          [k]: t('contact.required'),
        }))
      } else if (v.length < 3) {
        isValid = false
        setErrors((prevState) => ({
          ...prevState,
          [k]: t('contact.tooshort'),
        }))
      } else if (k === 'email' && !validateEmail(v)) {
        isValid = false
        setErrors((prevState) => ({
          ...prevState,
          [k]: t('contact.emailinvalid'),
        }))
      }
    })

    if (!agreed) {
      isValid = false
      setErrors((prevState) => ({
        ...prevState,
        agreement: t('sampleData.agreementRequired'),
      }))
    }

    return isValid
  }

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement | HTMLTextAreaElement>,
  ) => {
    e.preventDefault()
    setLockStatus(true)
    setErrors(initErrors)

    if (!validate()) {
      setLockStatus(false)
      return
    }

    const formData = new FormData()
    formData.append('type', 'sample-data-request')
    Object.entries(query).forEach(([key, value]) => {
      formData.append(key, value)
    })
    formData.append('agreement', 'agreed')

    fetch(endpoint, { method: 'POST', body: formData })
      .then((res) => {
        setLockStatus(false)
        setFormStatus(true)
        setQuery(initQuery)
        setAgreed(false)
        console.log(res)
      })
      .catch((err) => {
        setLockStatus(false)
        console.log(err)
      })
  }

  return (
    <>
      <Hed
        title={dataRequest.title}
        desc={dataRequest.excerpt}
        ogimage={ogimage}
      />

      <header className='container'>
        <h1>{dataRequest.title}</h1>
        <div className={styles.headerDesc}>
          <Page blocks={dataRequest.blocks} />
        </div>
      </header>

      <section className='container'>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <div className={styles.line}>
              <label htmlFor='name' className={styles.label}>
                {t('contact.name')}
              </label>
              <div className={styles.input}>
                <input
                  type='text'
                  id='name'
                  placeholder={t('sampleData.namePlaceholder')}
                  name='name'
                  value={query.name}
                  onChange={handleChange()}
                />
                {errors.name && formError(errors.name)}
              </div>
            </div>

            <div className={styles.line}>
              <label htmlFor='affiliation' className={styles.label}>
                {t('sampleData.affiliation')}
              </label>
              <div className={styles.input}>
                <input
                  type='text'
                  id='affiliation'
                  placeholder={t('sampleData.affiliationPlaceholder')}
                  name='affiliation'
                  value={query.affiliation}
                  onChange={handleChange()}
                />
                {errors.affiliation && formError(errors.affiliation)}
              </div>
            </div>

            <div className={styles.line}>
              <label htmlFor='email' className={styles.label}>
                {t('contact.email')}
              </label>
              <div className={styles.input}>
                <input
                  type='email'
                  id='email'
                  placeholder='youremail@example.com'
                  name='email'
                  value={query.email}
                  onChange={handleChange()}
                />
                {errors.email && formError(errors.email)}
              </div>
            </div>

            <div className={styles.line}>
              <label htmlFor='purpose' className={styles.label}>
                {t('sampleData.purpose')}
              </label>
              <div className={styles.input}>
                <textarea
                  name='purpose'
                  id='purpose'
                  rows={5}
                  placeholder={t('sampleData.purposePlaceholder')}
                  value={query.purpose}
                  onChange={handleChange()}
                />
                {errors.purpose && formError(errors.purpose)}
              </div>
            </div>
          </div>

          <div>
            <div className={styles.agreementSection}>
              <h3 className={styles.agreementTitle}>{terms.title}</h3>
              <div className={styles.termsBox}>
                <Page blocks={terms.blocks} />
              </div>
              <label htmlFor='agreement' className={styles.checkboxLabel}>
                <input
                  type='checkbox'
                  id='agreement'
                  name='agreement'
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>{t('sampleData.agreementLabel')}</span>
              </label>
              {errors.agreement && formError(errors.agreement)}
            </div>

            <div className={styles.submitArea}>
              {formStatus ? (
                <p>{t('sampleData.thanks')}</p>
              ) : lockStatus ? (
                <MutatingDots
                  color='#666'
                  secondaryColor='#000'
                  height={100}
                  width={100}
                />
              ) : (
                <button
                  className={styles.button}
                  type='submit'
                  disabled={lockStatus}
                >
                  {t('contact.submit')}
                </button>
              )}
            </div>
          </div>
        </form>
      </section>
    </>
  )
}

export default SampleDataRequest
