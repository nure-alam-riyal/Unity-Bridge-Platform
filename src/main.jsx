import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import AuthProvider from './Provider/AuthProvider.jsx'
import { RouterProvider } from 'react-router-dom'
import { router } from './Router/Router.jsx'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { store } from './Redux-Toolkit/store.js'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
     <Provider store={store}>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>

    </AuthProvider>
    <Toaster />
    </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
