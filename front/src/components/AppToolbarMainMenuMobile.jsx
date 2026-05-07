import React from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminLayoutStyles.css'
import { IconButton, Drawer, List, ListItem, ListItemText, Collapse, styled } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useIsMobile } from '../hooks/useIsMobile'
import { useState } from 'react'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

const DrawerStyled = styled(Drawer)`
  & .MuiPaper-root {
    width: 50%;
  }
`

export const AppToolbarMainMenuMobile = ({ pages }) => {
  const isMobile = useIsMobile()

  const menuId = 'primary-search-account-menu'

  const navigate = useNavigate()

  const [anchorMainMenuEl, setAnchorMainMenuEl] = React.useState(null)

  const [submenuOpen, setSubmenuOpen] = useState()

  const handleMainMenuOpen = (event) => {
    setAnchorMainMenuEl(event.currentTarget)
  }
  const handleMainMenuClose = () => {
    setAnchorMainMenuEl(null)
    setSubmenuOpen(undefined)
  }

  const handleCloseGoToPage = (page) => () => {
    navigate(page.url)
    handleMainMenuClose()
  }

  const isMainMenuOpen = Boolean(anchorMainMenuEl)

  const handleSubmenu = (name) => setSubmenuOpen(submenuOpen === name ? undefined : name)

  const renderPageItem = (menuItem) => {
    const isSubPagesExist = !!menuItem.subPages

    if (isSubPagesExist) {
      return (
        <React.Fragment key={menuItem.name}>
          <ListItem onClick={() => handleSubmenu(menuItem.name)}>
            <ListItemText primary={menuItem.label} />
            {submenuOpen === menuItem.name ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={submenuOpen === menuItem.name} timeout='auto' unmountOnExit>
            <List disablePadding sx={{ ml: 2 }}>
              {menuItem.subPages.map((page) => (
                <ListItem key={page.name} onClick={handleCloseGoToPage(page)}>
                  <ListItemText primary={page.label} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      )
    }

    return (
      <ListItem key={menuItem.name} onClick={handleCloseGoToPage(menuItem)}>
        <ListItemText primary={menuItem.label} />
      </ListItem>
    )
  }

  if (!isMobile || pages.length === 0) return null

  return (
    <>
      <IconButton
        size='large'
        edge='end'
        aria-label='account of current user'
        aria-controls={menuId}
        aria-haspopup='true'
        onClick={handleMainMenuOpen}
        color='inherit'
        sx={{ mr: 0, ml: -1 }}
      >
        <MenuIcon />
      </IconButton>
      <DrawerStyled open={isMainMenuOpen} onClose={handleMainMenuClose} anchor='right'>
        <List>{pages.map(renderPageItem)}</List>
      </DrawerStyled>
    </>
  )
}
