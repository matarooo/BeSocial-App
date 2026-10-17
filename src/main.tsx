import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './AppRouter/AppRouter'
import UserAuthProvider from './Context/UserAuthProvider/UserAuthProvider'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'

const myClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={myClient}>
      <UserAuthProvider>
        <RouterProvider router={router} />
    </UserAuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
