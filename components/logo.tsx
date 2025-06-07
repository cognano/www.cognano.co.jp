import React, { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
  children?: ReactNode
  invert?: string
  width?: number
  height?: number
}

const Logo: React.FC<Props> = ({ children, invert, width, height }) => {
  const invertRatio = invert ? invert : '0'
  return (
    <span className="logo">
      <Link href="/">
        <Image src="/static/cognano.svg" width={width ? width : 160} height={height ? height : 26} style={{ filter: `invert(${invertRatio})` }} alt="Cognano Logo" />
      </Link>
    </span>
  )
}

export default Logo
