import React from 'react'
import { EventListTable } from '../components/eventTabs/tables/EventListTable'
import { MobileApplicationListTable } from '../components/tables/MobileApplicationListTable'
import { useIsMobile } from '../hooks/useIsMobile'
import { ApplicationListTable } from '../components/tables/ApplicationListTable'

export const ApplicationListPage = () => {
  const isMobile = useIsMobile()
  if (isMobile) return <MobileApplicationListTable />

  return <ApplicationListTable />
}
