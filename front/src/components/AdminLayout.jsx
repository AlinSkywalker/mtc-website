import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
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
    ? [{ name: 'eventList', url: '/crm/event', label: 'Мероприятия' }]
    : [
      { name: 'eventList', url: '/crm/event', label: 'Мероприятия' },
      { name: 'memberList', url: '/crm/member', label: 'Тритонны' },
      { name: 'dictionary', url: '/crm/dictionary', label: 'Справочники' },
      { name: 'applications', url: '/crm/applications', label: 'Заявки' },
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
