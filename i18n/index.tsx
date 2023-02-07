import { ParsedUrlQueryInput, ParsedUrlQuery } from 'node:querystring'
import React, { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/router'

import en from './en'
import ja from './ja'

const userI18n: I18N = {
  translations: { en, ja },
  defaultLang: 'en',
  useBrowserDefault: true,
}

type Dictionary = {
  [key: string]: string | Dictionary
}

export type I18N = {
  translations: { [language: string]: Dictionary }
  defaultLang: string
  useBrowserDefault: boolean
}

type Dict = { [key: string]: string }

let passedQuery: Dictionary

export const useLanguageQuery = (forceLang?: string) => {
  const { lang } = useSelectedLanguage()
  const router = useRouter()
  const [value, setValue] = useState<ParsedUrlQueryInput>()
  passedQuery = {}

  if (router.query) {
    let query: ParsedUrlQuery = router.query
    const keys = Object.keys(query)
    keys.forEach((key: string, index: number) => {
      passedQuery[key] = query[key] as string
    })
  }

  useEffect(() => {
    setValue({ ...passedQuery, lang: forceLang || (lang as string) || (passedQuery['lang'] as string) })
  }, [forceLang, lang])

  // remove query string when default language
  if (value && value.lang === userI18n.defaultLang) {
    return [undefined] as const
  }

  return [value] as const
}

export const getT = (key: string, lang: string) => {
  const i18nObj = i18n() as I18N
  const translations: Dictionary = i18nObj.translations
  let value: any = key.split('.').reduce((previous: any, current: string) => (previous && previous[current]) || null, translations[lang])
  return value || key
}

export const useTranslation = () => {
  const router = useRouter()
  let i18nObj: I18N
  i18nObj = i18n() as I18N

  const translations: Dictionary = i18nObj.translations
  const defaultLang: string = i18nObj.defaultLang
  const { lang } = useSelectedLanguage()

  return {
    t: (key: string, view?: object): any => {
      let value: any = key.split('.').reduce((previous: any, current: string) => (previous && previous[current]) || null, translations[lang])
      let translation: any = value || key
      return translation
    }
  }
}

type Props = {
  lang: string
  children?: ReactNode
  shallow?: boolean
}

export const LanguageSwitcher = ({ lang, children, shallow=false }: Props) => {
  const { isActive: languageSwitcherIsActive } = useLanguageSwitcherIsActive(lang)
  const router = useRouter()
  const [query] = useLanguageQuery(lang)

  const updateRouter = () => {
    const pathname = router.pathname
    const arg = (lang === userI18n.defaultLang) ? { pathname } : { pathname, query }
    router.push(arg, undefined, { shallow })
  }

  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      // @ts-ignore
      onClick: () => {
        if (children && children.props && typeof children.props.onClick === 'function') {
          children.props.onClick()
        }
        updateRouter()
      },
      'data-language-switcher': 'true',
      'data-is-current': languageSwitcherIsActive,
      'role': 'button',
      'aria-label': `set language to ${lang}`
    })
  }

  return (
    <span
      role='button'
      aria-label={`set language to ${lang}`}
      data-language-switcher='true'
      data-is-current={languageSwitcherIsActive}
      onClick={() => {
        updateRouter()
      }}
    >
      {children}
    </span>
  )
}

const useLanguageSwitcherIsActive = (currentLang: string) => {
  let i18nObj: I18N
  i18nObj = i18n() as I18N

  const defaultLang: string = i18nObj.defaultLang
  const router = useRouter()
  const [isActive, setIsActive] = useState<boolean>(false)

  useEffect(() => {
    if (router.query.lang === undefined) {
      router.query = { lang: defaultLang }
    }
    const current = (!router.query || !router.query.lang) ? defaultLang === currentLang : router.query.lang === currentLang
    setIsActive(current)
  }, [currentLang, defaultLang, router.query])

  return { isActive } as const
}

export const useSelectedLanguage = () => {
  let i18nObj: I18N
  i18nObj = i18n() as I18N

  const defaultLang: string = i18nObj.defaultLang
  const translations = i18nObj.translations
  const router = useRouter()
  const [lang, setLang] = useState<string>(defaultLang)

  useEffect(() => {
    if (router.query.lang && router.query.lang !== lang && translations && translations[router.query.lang as string]) {
      let lang: string = router.query.lang as string
      setLang(lang)
    }
  }, [lang, router.query.lang])

  return { lang, setLang } as const
}

const i18n = (): I18N | Error => {
  userI18n.defaultLang = getDefaultLanguage(userI18n)
  return userI18n
}

const getDefaultLanguage = (i: I18N): string => {
  let browserLang: string = ''

  if (i.useBrowserDefault && typeof window !== 'undefined' && window && window.navigator && (window.navigator.languages || window.navigator.language)) {
    browserLang = ((window.navigator.languages && window.navigator.languages[0]) || window.navigator.language).split('-')[0].toLowerCase()
  }

  if (i.useBrowserDefault && browserLang && i.translations[browserLang]) {
    return browserLang
  }

  return i.defaultLang
}

type Lang = 'en' | 'ja'

const language = () => {
  return (process.env.APP_LANG || 'en') as Lang
}

export const lang: Lang = language()

const t = (key: string) => {
  const lang = process.env.APP_LANG || 'en'
  const i18nObj = i18n() as I18N
  const translations: Dictionary = i18nObj.translations
  let value: any = key.split('.').reduce((previous: any, current: string) => (previous && previous[current]) || null, translations[lang])
  return value || key
}

export default t