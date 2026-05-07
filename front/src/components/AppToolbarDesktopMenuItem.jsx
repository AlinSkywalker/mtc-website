import React from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminLayoutStyles.css'
import { useIsAdmin } from '../hooks/useIsAdmin'
import { Button, Menu, MenuItem } from '@mui/material'
import { useIsMobile } from '../hooks/useIsMobile'

export const AppToolbarDesktopMenuItem = ({ menuItem }) => {
  console.log('menuItem', menuItem)
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const isMenuOpen = Boolean(anchorEl)
  const menuId = 'primary-search-account-menu'

  const navigate = useNavigate()

  const isSubPagesExist = !!menuItem.subPages

  const handleMenuItemClick = (event) => {
    if (isSubPagesExist) {
      setAnchorEl(event.currentTarget)
    } else {
      navigate(menuItem.url)
    }
  }

  const handleSubMenuItemClick = (subItem) => () => {
    setAnchorEl(null)
    navigate(subItem.url)
  }

  return (
    <>
      <Button
        key={menuItem.name}
        onClick={handleMenuItemClick}
        sx={{ my: 2, color: 'white', display: 'block' }}
      >
        {menuItem.label}
      </Button>
      {isSubPagesExist && (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          id={menuId}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          {menuItem.subPages.map((subPage) => {
            return (
              <MenuItem key={subPage.name} onClick={handleSubMenuItemClick(subPage)}>
                {subPage.label}
              </MenuItem>
            )
          })}
        </Menu>
      )}
    </>
  )
}
