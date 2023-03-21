import satori, { SatoriOptions } from 'satori'
import twemoji from 'twemoji'
import { existsSync } from 'fs'
import OgImage from '../components/ogimage'
import { Resvg } from '@resvg/resvg-js'
import { readFile, writeFile } from 'node:fs/promises'
import crypto from 'crypto'

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
  title: string
  desc?: string
}

type writeOgImageArgs = {
  id: string
  title: string
  file: string
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

const writeOgImage = async ({ id, title, desc, file }: writeOgImageArgs): Promise<void> => {
  const dir = `public/ogimages`
  const path = `${dir}/${file}`
  if (existsSync(path)) {
    return
  }
  const opts = await satoriOptions()
  const svg = await satori(OgImage({ id, title, desc }), opts)
  const png = (new Resvg(svg)).render().asPng()
  await writeFile(path, png)
  console.log(`saved image -- path: ${path}`)
}

const atoh = (a: string): string => {
  const shasum = crypto.createHash('sha1')
  shasum.update(a)
  return shasum.digest('hex')
}

const CreateOgImage = async ({ id, title, desc }: CreateOgimageArgs): Promise<string> => {
  const hash = atoh(`${title}${desc}`)
  const file = `${id}-${hash}.png`
  await writeOgImage({ id, title, desc, file })
  return file
}

export default CreateOgImage