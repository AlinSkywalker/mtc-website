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
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import apiClient from '../api/api'
import MtcImage from '../assets/mtc.png'

export const AdminLayout = ({ children }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const { userInfo, setUserInfo, setIsAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    apiClient.get('/api/current').then((response) => {
      setUserInfo({ id: response.data.id, role: response.data.role })
    })
  }, [])

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const isMenuOpen = Boolean(anchorEl)
  const menuId = 'primary-search-account-menu'

  const navigate = useNavigate()

  const handleLogout = () => {
    apiClient.get(`/api/logout`).then(() => {
      localStorage.removeItem('token')
      setIsAuthenticated(false)
      setUserInfo({ id: '', role: '' })
    })
  }
  const handleGoToProfilePage = () => {
    navigate('/profile')
  }
  const pages =
    userInfo.role !== 'ADMIN_ROLE'
      ? [{ name: 'eventList', url: '/eventList', label: 'Мероприятия' }]
      : [
        { name: 'eventList', url: '/admin/event', label: 'Мероприятия' },
        { name: 'memberList', url: '/admin/member', label: 'Члены клуба' },
        { name: 'dictionary', url: '/admin/dictionary', label: 'Справочники' },
      ]
  const handleCloseGoToPage = (page) => () => {
    navigate(page.url)
  }
  const profileButton = (
    <IconButton
      size='large'
      edge='end'
      aria-label='account of current user'
      aria-controls={menuId}
      aria-haspopup='true'
      onClick={handleProfileMenuOpen}
      color='inherit'
    >
      <AccountCircle />
    </IconButton>
  )
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleGoToProfilePage}>Мой профиль</MenuItem>
      <MenuItem onClick={handleLogout}>Выйти</MenuItem>
    </Menu>
  )
  return (
    <Grid>
      <AppBar position='static'>
        <Toolbar>
          {/* <IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton> */}
          {/* <Typography variant='h6' component='div' sx={{ mr: 2 }}>
            ЦАП
          </Typography> */}
          <img src={MtcImage} alt='ЦАП' height='55px' />
          <Box sx={{ flexGrow: 1, display: 'flex', marginLeft: 3 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={handleCloseGoToPage(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.label}
              </Button>
            ))}
          </Box>
          {profileButton}
        </Toolbar>
        {renderMenu}
      </AppBar>
      {children}
    </Grid>
  )
}
