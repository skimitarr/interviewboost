// import Link from "next/link"

// подключение клиентского компонента в серверный
import { Navigation } from "./Navigation"

const navItems = [
  { label: 'Specialization', href: '/' },
  { label: 'Form', href: '/form' },
  { label: 'My questions', href: '/questions' },
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
