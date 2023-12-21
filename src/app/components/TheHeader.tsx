import { Navigation } from "./Navigation/Navigation"

export const navItems = [
  { label: 'home', href: '/' },
  { label: 'position', href: '/position' },
  { label: 'questions', href: '/questions' },
  { label: 'interview', href: '/interview' },
  { label: 'reports', href: '/reports' },
  { label: 'feedback', href: '/feedback' },
]

export function TheHeader() {
  return (
    <Navigation navLinks={navItems} />
  )
}
