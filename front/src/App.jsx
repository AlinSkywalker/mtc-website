// App.js
import React, { useContext } from 'react'
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegistrationPage } from './pages/RegistrationPage'
import { AdminLayout } from './components/AdminLayout'
import { ProfilePage } from './pages/ProfilePage'
import { EventListPage } from './pages/EventListPage'
import { EventInfoPage } from './pages/EventInfoPage'
import { MemberInfoPage } from './pages/MemberInfoPage'
import { MemberListPage } from './pages/MemberListPage'
import { DictionaryPage } from './pages/DictionaryPage'
import { AuthContext } from './components/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './components/AuthContext'
import CssBaseline from '@mui/material/CssBaseline'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { ru } from 'date-fns/locale/ru'
import theme from './api/theme'
import { Grid, ThemeProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { EventListPageRO } from './pages/EventListPageRO'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext)
  return isAuthenticated ? <AdminLayout>{children}</AdminLayout> : <Navigate to='/login' />
}

const AdminRoute = ({ children }) => {
  const { isAuthenticated, userInfo } = useContext(AuthContext)
  // console.log('userInfo', userInfo)
  if (!isAuthenticated) {
    return <Navigate to='/login' />
  }
  if (userInfo.role !== 'ADMIN_ROLE') {
    return (
      <AdminLayout>
        <Grid>Данная страница недоступна</Grid>
      </AdminLayout>
    )
  }
  return <AdminLayout>{children}</AdminLayout>
  // return isAuthenticated ? <AdminLayout>{children}</AdminLayout> : <Navigate to='/login' />
}

const PublicRoute = ({ children }) => {
  return children
}

const LoginRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext)
  return isAuthenticated ? <Navigate to='/profile' /> : children
}

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <CssBaseline />
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route
                    path='/'
                    element={
                      <AdminRoute>
                        <EventListPage />
                      </AdminRoute>
                    }
                  />
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
                      <AdminRoute>
                        <EventListPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path='/admin/event/:id/*'
                    element={
                      <AdminRoute>
                        <EventInfoPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path='/admin/member'
                    element={
                      <AdminRoute>
                        <MemberListPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path='/admin/member/:id'
                    element={
                      <AdminRoute>
                        <MemberInfoPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path='/admin/dictionary'
                    element={
                      <AdminRoute>
                        <DictionaryPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path='/admin/dictionary/:dictionaryType'
                    element={
                      <AdminRoute>
                        <DictionaryPage />
                      </AdminRoute>
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
                  <Route
                    path='/eventList'
                    element={
                      <PrivateRoute>
                        <EventListPageRO />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path='/event/:id/*'
                    element={
                      <PrivateRoute>
                        <EventInfoPage readOnly={true} />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </LocalizationProvider>
  )
}

export default App
