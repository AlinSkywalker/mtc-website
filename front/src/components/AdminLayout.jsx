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

export const AdminLayout = ({ children }) => {
  const isAdmin = useIsAdmin()
  const [anchorMainMenuEl, setAnchorMainMenuEl] = React.useState(null)

  const menuId = 'primary-search-account-menu'

  const handleMainMenuOpen = (event) => {
    setAnchorMainMenuEl(event.currentTarget)
  }
  const handleMainMenuClose = () => {
    setAnchorMainMenuEl(null)
  }

  const isMainMenuOpen = Boolean(anchorMainMenuEl)
  const mainMenuId = 'primary-search-account-menu'

  const navigate = useNavigate()

  const pages = !isAdmin
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

  const handleCloseGoToPage = (page) => () => {
    navigate(page.url)
    handleMainMenuClose()
    // handleMenuClose()
  }

  const isMobile = useMediaQuery({ query: '(max-device-width: 768px)' })

  const renderMenu = isMobile ? (
    <>
      <IconButton
        size='large'
        edge='end'
        aria-label='account of current user'
        aria-controls={menuId}
        aria-haspopup='true'
        onClick={handleMainMenuOpen}
        color='inherit'
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorMainMenuEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={mainMenuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMainMenuOpen}
        onClose={handleMainMenuClose}
      >
        {pages.map((page) => (
          <MenuItem key={page.name} onClick={handleCloseGoToPage(page)}>
            {page.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  ) : null

  return (
    <Grid>
      <AppToolbar renderMenu={renderMenu}>
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
                onClick={handleCloseGoToPage(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.label}
              </Button>
            ))}
        </>
      </AppToolbar>
      {children}
    </Grid>
  )
}
