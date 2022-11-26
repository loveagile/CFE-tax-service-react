import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Layout from './components/Layout'
import Router from './routes'
import { CurrentUserProvider } from './contexts/currentUser'

const App = () => {
  return (
    <BrowserRouter>
      <CurrentUserProvider>
        <Layout>
          <Router />
        </Layout>
      </CurrentUserProvider>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
