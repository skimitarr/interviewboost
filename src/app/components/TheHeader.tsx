// import Link from "next/link"

// подключение клиентского компонента в серверный
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
    <header className="header">
      {/* <Link href='/'>Home</Link>
      <Link href='/questions'>Questions & Answers</Link>
      <Link href='/video'>Video</Link> */}

      {/* подключение клиентского компонента в серверный */}
      <Navigation navLinks={navItems} />
    </header>
  )
}
export { TheHeader }
