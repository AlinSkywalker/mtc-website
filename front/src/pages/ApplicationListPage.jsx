import React from 'react'
import { EventListTable } from '../components/eventTabs/tables/EventListTable'
import { MobileEventListTable } from '../components/eventTabs/tables/MobileEventListTable'
import { useIsMobile } from '../hooks/useIsMobile'
import { ApplicationListTable } from '../components/tables/ApplicationListTable'

export const ApplicationListPage = () => {
  const isMobile = useIsMobile()
  // if (isMobile) return <MobileEventListTable readOnly={false} />

  return <ApplicationListTable />
}
