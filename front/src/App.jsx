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
import { Grid, IconButton, ThemeProvider } from '@mui/material'
import { closeSnackbar, SnackbarProvider } from 'notistack'
import { PersonalDataConsentPage } from './pages/PersonalDataConsentPage'
import { ApplicationListPage } from './pages/ApplicationListPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { MainPage } from './pages/MainPage'
import { BoardMembersPage } from './pages/BoardMembersPage'
import { RegionalOfficesPage } from './pages/RegionalOfficesPage'
import { CompanyCharterPage } from './pages/CompanyCharterPage'
import { MinutesOfMeetingPage } from './pages/MinutesOfMeetingPage'
import { MembershipPage } from './pages/MembershipPage'
import { MembershipApplicationListPage } from './pages/MembershipApplicationListPage'
import CloseIcon from '@mui/icons-material/Close'
import { useIsBoardMember } from './hooks/useIsAdmin'
import { ForbiddenPage } from './pages/ForbiddenPage'
import { NotFoundPage } from './pages/NotFoundPage'

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
        <ForbiddenPage />
      </MainLayout>
    )
  }
  return <MainLayout>{children}</MainLayout>
}

const MemberRoute = ({ children }) => {
  const { isAuthenticated, userInfo } = useContext(AuthContext)

  if (!isAuthenticated) {
    return <Navigate to='/crm/login' />
  }
  if (!userInfo.isClubMember) {
    return (
      <MainLayout>
        <ForbiddenPage />
      </MainLayout>
    )
  }
  return <MainLayout>{children}</MainLayout>
}

const BoardMemberRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext)
  const isBoardMember = useIsBoardMember()

  if (!isAuthenticated) {
    return <Navigate to='/crm/login' />
  }
  if (!isBoardMember) {
    return (
      <MainLayout>
        <ForbiddenPage />
      </MainLayout>
    )
  }
  return <MainLayout>{children}</MainLayout>
}

const PublicRoute = ({ children }) => {
  return <MainLayout>{children}</MainLayout>
}

const LoginRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext)
  return isAuthenticated ? (
    <Navigate to='/crm/event' />
  ) : (
    <MainLayout withProfile={false}>{children}</MainLayout>
  )
}

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            action={(snackbarId) => (
              <IconButton
                aria-label='delete'
                onClick={() => closeSnackbar(snackbarId)}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            )}
          >
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
                      <AdminRoute>
                        <MemberListPage />
                      </AdminRoute>
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
                  <Route
                    path='/boardMembers'
                    element={
                      <PublicRoute>
                        <BoardMembersPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path='/regionalOffices'
                    element={
                      <PublicRoute>
                        <RegionalOfficesPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path='/companyCharter'
                    element={
                      <PublicRoute>
                        <CompanyCharterPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path='/minutesOfMeeting'
                    element={
                      <MemberRoute>
                        <MinutesOfMeetingPage />
                      </MemberRoute>
                    }
                  />
                  <Route
                    path='/crm/membership'
                    element={
                      <PrivateRoute>
                        <MembershipPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/crm/membershipApplication'
                    element={
                      <BoardMemberRoute>
                        <MembershipApplicationListPage />
                      </BoardMemberRoute>
                    }
                  />

                  <Route path='*' element={<NotFoundPage />} />
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
