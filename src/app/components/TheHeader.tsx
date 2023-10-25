import { Navigation } from "./Navigation"

const navItems = [
  { label: 'home', href: '/' },
  { label: 'questions', href: '/questions' },
  { label: 'interview', href: '/interview' },
  { label: 'reports', href: '/reports' },
  { label: 'feedback', href: '/feedback' },
]

const TheHeader = () => {
  return (
    <Navigation navLinks={navItems} />
  )
}
export { TheHeader }
