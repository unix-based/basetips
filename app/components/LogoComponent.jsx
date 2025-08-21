import React from 'react'

export default function LogoComponent({className}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/qr-code.png" alt="BaseTips Logo" className="w-6 h-6" />
      BASETIPS
    </div>
  )
}
