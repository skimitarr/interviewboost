'use client'

import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux';
import store from '../store/store';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../locales/i18n';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// здесь могут быть разные провайдеры. Они подключаются на корневой layout.tsx
// SessionProvide подключаем чтобы заработал хук useSession в Navigation.tsx
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <SessionProvider>
        <I18nextProvider i18n={i18n}>
          <DndProvider backend={HTML5Backend}>
            {children}
          </DndProvider>
        </I18nextProvider>
      </SessionProvider>
    </Provider>
  )
}
