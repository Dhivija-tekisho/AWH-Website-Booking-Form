import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LanguageProvider } from '@/i18n'
import './theme.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
