// App.js
import React, { useContext } from 'react'
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import RegistrationPage from './components/RegistrationPage'
import { AdminLayout } from './components/AdminLayout'
import { ProfilePage } from './components/ProfilePage'
import { EventListPage } from './components/EventListPage'
import { EventInfoPage } from './components/EventInfoPage'
import { MemberListPage } from './components/MemberListPage'
import { DictionaryPage } from './components/DictionaryPage'
import { AuthContext } from './components/AuthContext'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { AuthProvider } from './components/AuthContext'
import CssBaseline from '@mui/material/CssBaseline'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { ru } from 'date-fns/locale/ru'

const queryClient = new QueryClient()

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext)
  return isAuthenticated ? <AdminLayout>{children}</AdminLayout> : <Navigate to='/login' />
}

const PublicRoute = ({ children }) => {
  return children
}

const LoginRoute = ({ children }) => {
  const { isAuthenticated, userInfo } = useContext(AuthContext)
  return isAuthenticated ? (
    <Navigate to={userInfo.role == 'ADMIN_ROLE' ? '/admin' : '/profile'} />
  ) : (
    children
  )
}

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <AuthProvider>
          <BrowserRouter basename={'/mountaineering-training-center'}>
            <Routes>
              <Route
                path='/login'
                element={
                  <LoginRoute>
                    <LoginPage />
                  </LoginRoute>
                }
                exact
              />
              <Route
                path='/register'
                element={
                  <LoginRoute>
                    <RegistrationPage />
                  </LoginRoute>
                }
                exact
              />

              <Route
                path='/admin/event'
                element={
                  <PrivateRoute>
                    <EventListPage />
                  </PrivateRoute>
                }
              />
              <Route
                path='/admin/event/:id'
                element={
                  <PrivateRoute>
                    <EventInfoPage />
                  </PrivateRoute>
                }
              />
              <Route
                path='/admin/member'
                element={
                  <PrivateRoute>
                    <MemberListPage />
                  </PrivateRoute>
                }
              />
              <Route
                path='/admin/member/:id'
                element={
                  <PrivateRoute>
                    <EventInfoPage />
                  </PrivateRoute>
                }
              />
              <Route
                path='/admin/dictionary'
                element={
                  <PrivateRoute>
                    <DictionaryPage />
                  </PrivateRoute>
                }
              />

              <Route
                path='/profile'
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
                exact
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </LocalizationProvider>
  )
}

export default App
