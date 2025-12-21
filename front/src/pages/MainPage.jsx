import React from 'react'
import { EventListTable } from '../components/eventTabs/tables/EventListTable'
import { MainPageEventListTable } from '../components/eventTabs/tables/MainPageEventListTable'
import { useIsMobile } from '../hooks/useIsMobile'
import { useIsAdmin } from '../hooks/useIsAdmin'

export const MainPage = () => {
  const isMobile = useIsMobile()
  const readOnly = !useIsAdmin()
  // if (isMobile) return <MobileEventListTable />

  return <MainPageEventListTable />
}
