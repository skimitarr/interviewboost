'use client'

import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux';
import store from '../store/store';

// здесь могут быть разные провайдеры. Они подключаются на корневой layout.tsx
// SessionProvide подключаем чтобы заработал хук useSession в Navigation.tsx
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}><SessionProvider>{children}</SessionProvider></Provider>
}
