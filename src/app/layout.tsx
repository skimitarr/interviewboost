import { Providers } from './components/Providers'
import { TheHeader } from './components/TheHeader'
import ThemeRegistry from "@/theme/ThemeRegistry";
import type { Metadata } from 'next'
import '@/css/style.css'

export const metadata: Metadata = {
  title: 'Легкость собеседований и автоматические отчеты с ИИ',
  description: 'interviewboost - ваш надежный партнер в подготовке к собеседованиям. Наш инновационный продукт позволяет вам выбрать нужную специализацию, составить список релевантных вопросов, а затем воспользоваться искусственным интеллектом для генерации подробного отчета по результатам собеседования. Поднимите свои шансы на успешное собеседование с interviewboost!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ThemeRegistry>
        <body>
          <Providers>
            <TheHeader />
            <main className="main">
              {children}
            </main>
          </Providers>
        </body>
      </ThemeRegistry>
    </html>
  )
}

