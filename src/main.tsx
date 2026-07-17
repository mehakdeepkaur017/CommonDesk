import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GlobalErrorBoundary } from './components/feedback/GlobalErrorBoundary'
import { ToastProvider } from './components/feedback/ToastContext'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ThemeProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ToastProvider>
    </GlobalErrorBoundary>
  </StrictMode>,
)
