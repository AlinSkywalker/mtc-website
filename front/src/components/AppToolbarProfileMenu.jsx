import React, { useContext } from 'react'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import apiClient from '../api/api'
import './AdminLayoutStyles.css'
import { Menu, MenuItem, IconButton } from '@mui/material'

export const AppToolbarProfileMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const { setUserInfo, setIsAuthenticated, isAuthenticated } = useContext(AuthContext)

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

  return (
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
      </Menu>
    </>
  )
}
