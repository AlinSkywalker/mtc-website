import React from 'react'
import { EventListTable } from '../components/EventListTable'

export const ReadOnlyEventListPage = () => {
  return <EventListTable readOnly={true} />
}
