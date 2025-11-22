import React from 'react'
import { EventListTable } from '../components/eventTabs/tables/EventListTable'
import { MobileEventListTable } from '../components/eventTabs/tables/MobileEventListTable'
import { useIsMobile } from '../hooks/useIsMobile'
import { useIsAdmin } from '../hooks/useIsAdmin'

export const EventListPage = () => {
  const isMobile = useIsMobile()
  const readOnly = !useIsAdmin()
  if (isMobile) return <MobileEventListTable readOnly={readOnly} />

  return <EventListTable readOnly={readOnly} />
}
