import React from 'react'
import { EventListTable } from '../components/eventTabs/tables/EventListTable'
import { useIsMobile } from '../hooks/useIsMobile'
import { MobileEventListTable } from '../components/eventTabs/tables/MobileEventListTable'

export const EventListPageRO = () => {
  const isMobile = useIsMobile()

  if (isMobile) return <MobileEventListTable readOnly={true} />

  return <EventListTable readOnly={true} />
}
