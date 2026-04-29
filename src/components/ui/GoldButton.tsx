import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import Link from 'next/link'

interface Props {
  variant?: 'outline' | 'solid'
  href?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}

const base = "inline-flex items-center gap-3 px-10 py-4 text-xs tracking-[4px] uppercase font-normal transition-all duration-300 cursor-pointer"
const outline = "border border-[var(--or)] text-[var(--or)] bg-transparent hover:bg-[var(--or)] hover:text-[var(--noir)]"
const solid = "bg-gradient-to-br from-[var(--or)] to-[var(--or-fonce)] text-[var(--noir)] border-none hover:from-[var(--or-clair)] hover:to-[var(--or)]"

export default function GoldButton({ variant = 'outline', href, children, className = '', onClick, disabled, type }: Props) {
  const cls = `${base} ${variant === 'solid' ? solid : outline} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`

  if (href) {
    return <Link href={href} className={cls}>{children}</Link>
  }
  return (
    <button type={type || 'button'} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
