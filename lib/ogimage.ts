import satori, { SatoriOptions } from 'satori'
import twemoji from 'twemoji'
import { existsSync } from 'fs'
import OgImage from '../components/ogimage'
import { Resvg } from '@resvg/resvg-js'
import { readFile, writeFile } from 'node:fs/promises'

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// use https://github.com/iamcal/emoji-data
async function getIconBase64(s: string): Promise<string> {
  const codePoint = twemoji.convert.toCodePoint(s)
  const res = await fetch(`https://raw.githubusercontent.com/iamcal/emoji-data/master/img-apple-160/${codePoint}.png`)
  return `data:image/png;base64,${arrayBufferToBase64(await res.arrayBuffer())}`
}

type CreateOgimageArgs = {
  id: string
  title: {
    en?: string
    ja?: string
  }
  desc?: {
    en?: string
    ja?: string
  }
}

type writeOgImageArgs = {
  id: string
  title: string
  file: string
  lang: string
  desc?: string
}

const satoriOptions = async (): Promise<SatoriOptions> => {
  const notosansBold = await readFile('./fonts/NotoSansJP-Black.woff')
  const notosansRegular = await readFile('./fonts/NotoSansJP-Regular.woff')

  return {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Noto Sans JP',
        data: notosansRegular,
        weight: 400,
      },
      {
        name: 'Noto Sans JP',
        data: notosansBold,
        weight: 900,
      },
    ],
    loadAdditionalAsset: async (code: string, segment: string): Promise<string> => {
      return (code === 'emoji') ? getIconBase64(segment) : segment
    },
  }
}

const writeOgImage = async ({ id, title, file, lang, desc }: writeOgImageArgs): Promise<void> => {
  const dir = `public/ogimages/${lang}`
  const path = `${dir}/${file}`
  if (process.env.NODE_ENV !== 'development' && existsSync(path)) {
    return
  }
  const opts = await satoriOptions()
  const svg = await satori(OgImage({ id, title, desc }), opts)
  const png = (new Resvg(svg)).render().asPng()
  await writeFile(path, png)
  console.log(`saved ogimage -- path: ${path}`)
}

const CreateOgImage = async ({ id, title, desc }: CreateOgimageArgs): Promise<string> => {
  const file = `${id}.png`
  if (title.en) {
    await writeOgImage({ id, title: title.en, file, lang: 'en', desc: desc?.en })
  }
  if (title.ja) {
    await writeOgImage({ id, title: title.ja, file, lang: 'ja', desc: desc?.ja })
  }
  return file
}

export default CreateOgImage