import React from 'react'
import { EventListTable } from '../components/eventTabs/tables/EventListTable'
import { MobileEventListTable } from '../components/eventTabs/tables/MobileEventListTable'
import { useIsMobile } from '../hooks/useIsMobile'

export const EventListPage = () => {
  const isMobile = useIsMobile()
  if (isMobile) return <MobileEventListTable readOnly={false} />

  return <EventListTable readOnly={false} />
}
