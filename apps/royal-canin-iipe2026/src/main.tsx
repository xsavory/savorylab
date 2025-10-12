import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ParticipantAuthProvider } from 'src/contexts/participant-auth-context'
import { AdminAuthProvider } from 'src/contexts/admin-auth-context'
import App from 'src/app'

import '@repo/react-components/style.css'
import './index.css'

// Create react query client instance
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ParticipantAuthProvider>
        <AdminAuthProvider>
          <App />
        </AdminAuthProvider>
      </ParticipantAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
)

