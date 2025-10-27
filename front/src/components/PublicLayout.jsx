import React, { useContext, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import apiClient from '../api/api'
import MtcImage from '../assets/mtc.png'
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
