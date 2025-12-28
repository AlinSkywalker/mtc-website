import React, { useContext } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import './AdminLayoutStyles.css'
import { useLocation } from 'react-router-dom'
import { useIsAdmin } from '../hooks/useIsAdmin'
import { AppToolbar } from './AppToolbar'
import { AuthContext } from './AuthContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { Toolbar } from '@mui/material'

export const MainLayout = ({ children, withProfile = true }) => {
  const isAdmin = useIsAdmin()
  const { isAuthenticated } = useContext(AuthContext)

  const navigate = useNavigate()

  let pages = []
  if (isAuthenticated && isAdmin) {
    pages = [
      { name: 'eventList', url: '/crm/event', label: 'Мероприятия' },
      { name: 'memberList', url: '/crm/member', label: 'Тритонны' },
      { name: 'dictionary', url: '/crm/dictionary', label: 'Справочники' },
      { name: 'applications', url: '/crm/applications', label: 'Заявки' },
    ]
  } else if (isAuthenticated) {
    pages = [{ name: 'eventList', url: '/crm/event', label: 'Мероприятия' }]
  }

  const location = useLocation()

  const currentPage = pages.find(
    (tab) =>
      `${tab.url}` === location.pathname ||
      (tab.url !== '/' && location.pathname.startsWith(`${tab.url}`)),
  )

  const isMobile = useIsMobile()

  const handleGoToPage = (page) => () => {
    navigate(page.url)
  }

  return (
    <Grid>
      <AppToolbar withProfile={withProfile} pages={pages}>
        <>
          {isMobile && currentPage && (
            <Typography>
              <Link to={currentPage.url} className='pageLink'>
                {currentPage.label}
              </Link>
            </Typography>
          )}
          {!isMobile &&
            pages.map((page) => (
              <Button
                key={page.name}
                onClick={handleGoToPage(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.label}
              </Button>
            ))}
        </>
      </AppToolbar>
      <Toolbar />
      {children}
    </Grid>
  )
}
