import React, { useContext } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import './AdminLayoutStyles.css'
import { useLocation } from 'react-router-dom'
import { useIsAdmin, useIsBoardMember } from '../hooks/useIsAdmin'
import { AppToolbar } from './AppToolbar'
import { AuthContext } from './AuthContext'
import { useIsMobile } from '../hooks/useIsMobile'
import { Toolbar } from '@mui/material'
import { AppToolbarDesktopMenuItem } from './AppToolbarDesktopMenuItem'

export const MainLayout = ({ children, withProfile = true }) => {
  const isAdmin = useIsAdmin()
  const isBoardMember = useIsBoardMember()
  const {
    isAuthenticated,
    userInfo: { isClubMember },
  } = useContext(AuthContext)

  /**
   * @type {Array<{url: string, name: string, label: string, subPages?: Array<{url: string, name: string, label: string}>}>}
   */
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
  } else {
    pages = [{ name: 'main', url: '/', label: 'Мероприятия' }]
  }
  if (isClubMember) {
    pages.push({ name: 'minutesOfMeeting', url: '/minutesOfMeeting', label: 'Протоколы собраний' })
  }
  if (isBoardMember) {
    pages.push({
      name: 'membershipApplication',
      url: '/crm/membershipApplication',
      label: 'Заявки на членство',
    })
  }
  pages.push({
    name: 'aboutUs',
    url: '/about',
    label: 'О нас',
    subPages: [
      { name: 'boardMembers', url: '/boardMembers', label: 'Члены правления' },
      { name: 'regionalOffices', url: '/regionalOffices', label: 'Региональные отделения' },
      { name: 'companyCharter', url: '/companyCharter', label: 'Устав' },
    ],
  })

  const location = useLocation()

  const currentPage = pages.find(
    (tab) =>
      `${tab.url}` === location.pathname ||
      (tab.url !== '/' && location.pathname.startsWith(`${tab.url}/`)),
  )

  const isMobile = useIsMobile()

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
              <AppToolbarDesktopMenuItem
                menuItem={page}
                key={page.name}
                isCurrentPage={currentPage?.name === page.name}
              />
            ))}
        </>
      </AppToolbar>
      <Toolbar />
      {children}
    </Grid>
  )
}
