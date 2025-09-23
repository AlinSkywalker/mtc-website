import React from 'react'
import { EventListTable } from '../components/EventListTable'
import { useIsMobile } from '../hooks/useIsMobile'
import { MobileEventListTable } from '../components/MobileEventListTable'

export const EventListPageRO = () => {
  const isMobile = useIsMobile()

  if (isMobile) return <MobileEventListTable readOnly={true} />

  return <EventListTable readOnly={true} />
}
