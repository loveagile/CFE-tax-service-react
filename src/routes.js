import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'

import Login from './containers/Login'
import Clients from './containers/Clients'
import Files from './containers/Files'
import Messages from './containers/Messages'
import Profile from './containers/Profile'
import { CurrentUserContext } from './contexts/currentUser'
import { CategoriesProvider } from './contexts/categories'
import { MessageProvider } from './contexts/messages'
import { ClientProvider } from './contexts/clients'
import ForgotPassowrd from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

const AuthRouter = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/forgotpassword' element={<ForgotPassowrd />} />
      <Route path='/reset/:token' element={<ResetPassword />} />
      <Route path='/' element={<Login />} />
    </Routes>
  )
}

const UserRouter = () => {
  return (
    <CategoriesProvider>
      <MessageProvider>
        <ClientProvider>
          <Routes>
            <Route path='/clients' element={<Clients />} />
            <Route path='/files/:id' element={<Files />} />
            <Route path='/files' element={<Files />} />
            <Route path='/messages' element={<Messages />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/' element={<Clients />} />
          </Routes>
        </ClientProvider>
      </MessageProvider>
    </CategoriesProvider>
  )
}

const Router = () => {
  const token = localStorage.getItem('token')
  const value = useContext(CurrentUserContext)

  return token && value?.currentUser ? <UserRouter /> : <AuthRouter />
}

export default Router
