import type { CSSProperties, FC } from 'react'

type Props = {
  title: string
  desc?: string
  id: string
}

const divStyle: CSSProperties = {
  display: 'flex',
  color: '#000',
  backgroundColor: '#fff',
  backgroundImage: 'url(https://www.cognano.co.jp/ogibg.png)',
  backgroundRepeat: 'no-repeat',
  width: '100%',
  height: '100%',
  textAlign: 'left',
  alignItems: 'center',
  flexDirection: 'column',
  fontWeight: 'bold',
  justifyContent: 'center',
}

/* HOME */
const sitenameStyle = {
  letterSpacing: '5px',
  width: '84%',
  fontSize: 50,
}
const sitedescStyle = {
  fontSize: 30,
  width: '84%',
  fontWeight: 'normal',
  paddingRight: '260px',
}

/* OTHERS */
const logoStyle: CSSProperties = {
  letterSpacing: '3px',
  fontSize: 20,
  width: '84%',
  position: 'absolute',
  top: '30px',
  left: '100px',
}
const titleStyle = {
  fontSize: 50,
  width: '84%',
  paddingRight: '260px',
  letterSpacing: '-2px',
}
const descStyle = {
  fontSize: 30,
  width: '84%',
  fontWeight: 'normal',
  paddingRight: '260px',
}

const OgImage: FC<Props> = ({ title, desc, id }) => {
  const sitename = `COGNANO 🦙`
  const nonAscii = /[^\x01-\x7E\uFF61-\uFF9F]+/
  const titleMaxLength = title.match(nonAscii) ? 80 : 110
  const descMaxLength = title.match(nonAscii) ? 80 : 120
  const trimedTitle = title.length > titleMaxLength ? `${title.substring(0, titleMaxLength)}...` : title

  if (id === 'home') {
    return (
      <div style={divStyle} >
        <p style={sitenameStyle}>
          {sitename}
        </p>
        <p style={sitedescStyle}>
          {trimedTitle}
        </p>
      </div>
    )
  }

  if (desc) {
    const trimedDesc = desc.length > descMaxLength ? `${desc.substring(0, descMaxLength)}...` : desc
    return (
      <div style={divStyle} >
        <p style={logoStyle} >
            {sitename}
        </p>
        <p style={titleStyle} >
            {trimedTitle}
        </p>
        <p style={sitedescStyle}>
          {trimedDesc}
        </p>
      </div>
    )
  }

  return (
    <div style={divStyle} >
      <p style={logoStyle} >
        {sitename}
      </p>
      <p style={titleStyle} >
        {trimedTitle}
      </p>
    </div>
  )
}

export default OgImage