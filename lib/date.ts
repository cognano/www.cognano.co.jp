export const formatDate = (date: undefined|string, lang: string): string => {
  if (date === undefined) {
    return ''
  }

  const msec = Date.parse(date)
  const d = new Date(msec)
  if (lang === 'ja') {
    return `${d.getFullYear()}年${d.getMonth()}月${d.getDate()}日`
  }

  const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d.getDate()}st ${m[d.getMonth()]} ${d.getFullYear()}`
}
