import React, { useContext } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import './AdminLayoutStyles.css'
import { useMediaQuery } from 'react-responsive'
import { useLocation } from 'react-router-dom'
import { useIsAdmin } from '../hooks/useIsAdmin'
import { AppToolbar } from './AppToolbar'

export const PublicLayout = ({ children }) => {
  const isAdmin = useIsAdmin()
  const { userInfo } = useContext(AuthContext)

  const pages =
    userInfo.role !== 'ADMIN_ROLE'
      ? [{ name: 'eventList', url: '/eventList', label: 'Мероприятия' }]
      : [
        { name: 'eventList', url: '/admin/event', label: 'Мероприятия' },
        { name: 'memberList', url: '/admin/member', label: 'Тритонны' },
        { name: 'dictionary', url: '/admin/dictionary', label: 'Справочники' },
        { name: 'applications', url: '/admin/applications', label: 'Заявки' },
      ]
  const location = useLocation()

  const currentPage = pages.find(
    (tab) =>
      `${tab.url}` === location.pathname ||
      (tab.url !== '/' && location.pathname.startsWith(`${tab.url}`)),
  )

  const isMobile = useMediaQuery({ query: '(max-device-width: 768px)' })

  return (
    <Grid>
      <AppToolbar>
        {isMobile && currentPage && (
          <Typography>
            <Link to={currentPage.url} className='pageLink'>
              {currentPage.label}
            </Link>
          </Typography>
        )}
      </AppToolbar>
      {children}
    </Grid>
  )
}
