import React, { useContext, useEffect } from 'react'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import apiClient from '../api/api'
import MtcImage from '../assets/mtc.png'
import './AdminLayoutStyles.css'
import { useIsAdmin } from '../hooks/useIsAdmin'
import { Grid, Menu, Box, MenuItem, IconButton, Toolbar, AppBar } from '@mui/material'

export const AppToolbar = ({ children, renderMenu, withProfile }) => {
  const isAdmin = useIsAdmin()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const { userInfo, setUserInfo, setIsAuthenticated, isAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    if (isAuthenticated) {
      apiClient.get('/api/current').then((response) => {
        setUserInfo({
          id: response.data.id,
          role: response.data.role,
          memberId: response.data.memberId,
        })
      })
    }
  }, [isAuthenticated])

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
      setUserInfo({ id: '', role: '', memberId: '' })
    })
  }
  const handleGoToProfilePage = () => {
    navigate('/crm/profile')
    handleMenuClose()
  }

  const handleGoToLoginPage = () => {
    navigate('/crm/login')
  }
  const handleGoToMainPage = () => {
    navigate('/')
  }

  const renderProfileMenu = (
    <>
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
        {isAuthenticated && <MenuItem onClick={handleGoToProfilePage}>Мой профиль</MenuItem>}
        {isAuthenticated && <MenuItem onClick={handleLogout}>Выйти</MenuItem>}
        {!isAuthenticated && <MenuItem onClick={handleGoToLoginPage}>Войти в систему</MenuItem>}
        {/* {isAdmin && <MenuItem onClick={handleTestButton}>Тестовая кнопка</MenuItem>} */}
      </Menu>
    </>
  )

  return (
    <AppBar position='static'>
      <Toolbar className='AppBarToolbar'>
        <Grid onClick={handleGoToMainPage} sx={{ cursor: 'pointer' }}>
          <img src={MtcImage} alt='ЦАП' height='55px' />
        </Grid>
        <Box sx={{ flexGrow: 1, display: 'flex', marginLeft: 3 }}>{children}</Box>
        {withProfile && renderProfileMenu}
        {renderMenu}
      </Toolbar>
    </AppBar>
  )
}
