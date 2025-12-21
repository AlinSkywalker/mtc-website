// App.js
import React, { useContext } from 'react'
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegistrationPage } from './pages/RegistrationPage'
import { MainLayout } from './components/MainLayout'
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
import { PublicLayout } from './components/PublicLayout'
import { PersonalDataConsentPage } from './pages/PersonalDataConsentPage'
import { ApplicationListPage } from './pages/ApplicationListPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { MainPage } from './pages/MainPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext)
  return isAuthenticated ? <MainLayout>{children}</MainLayout> : <Navigate to='/crm/login' />
}

const AdminRoute = ({ children }) => {
  const { isAuthenticated, userInfo } = useContext(AuthContext)

  if (!isAuthenticated) {
    return <Navigate to='/crm/login' />
  }
  if (userInfo.role !== 'ADMIN_ROLE') {
    return (
      <MainLayout>
        <Grid>Данная страница недоступна</Grid>
      </MainLayout>
    )
  }
  return <MainLayout>{children}</MainLayout>
  // return isAuthenticated ? <AdminLayout>{children}</AdminLayout> : <Navigate to='/login' />
}

const PublicRoute = ({ children }) => {
  return <MainLayout>{children}</MainLayout>
}

const LoginRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext)
  return isAuthenticated ? (
    <Navigate to='/crm/profile' />
  ) : (
    <MainLayout withProfile={false}>{children}</MainLayout>
  )
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
                      <PublicRoute>
                        <MainPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path='/crm/login'
                    element={
                      <LoginRoute>
                        <LoginPage />
                      </LoginRoute>
                    }
                    exact
                  />
                  <Route
                    path='/crm/register'
                    element={
                      <LoginRoute>
                        <RegistrationPage />
                      </LoginRoute>
                    }
                    exact
                  />
                  <Route
                    path='/crm/reset-password'
                    element={
                      <LoginRoute>
                        <ResetPasswordPage />
                      </LoginRoute>
                    }
                  />

                  <Route
                    path='/crm/event'
                    element={
                      <PrivateRoute>
                        <EventListPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/crm/event/:id/*'
                    element={
                      <PrivateRoute>
                        <EventInfoPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/crm/member'
                    element={
                      <PrivateRoute>
                        <MemberListPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/crm/member/:id'
                    element={
                      <PrivateRoute>
                        <MemberInfoPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/crm/dictionary'
                    element={
                      <AdminRoute>
                        <DictionaryPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path='/crm/applications'
                    element={
                      <AdminRoute>
                        <ApplicationListPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path='/crm/dictionary/:dictionaryType'
                    element={
                      <AdminRoute>
                        <DictionaryPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path='/crm/profile'
                    element={
                      <PrivateRoute>
                        <ProfilePage />
                      </PrivateRoute>
                    }
                    exact
                  />
                  <Route
                    path='/personalDataConsent'
                    element={
                      <PublicRoute>
                        <PersonalDataConsentPage />
                      </PublicRoute>
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
