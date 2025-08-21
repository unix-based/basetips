import React from 'react'
import Image from 'next/image'

export default function LogoComponent({className}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image src="/qr-code.png" alt="BaseTips Logo" width={24} height={24} />
      BASETIPS
    </div>
  )
}
