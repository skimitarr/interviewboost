import { Navigation } from "./Navigation"

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Questions', href: '/questions' },
  { label: 'Interview', href: '/interview' },
  { label: 'Reports', href: '/reports' },
  { label: 'Feedback', href: '/feedback' },
]

const TheHeader = () => {
  return (
    <Navigation navLinks={navItems} />
  )
}
export { TheHeader }
