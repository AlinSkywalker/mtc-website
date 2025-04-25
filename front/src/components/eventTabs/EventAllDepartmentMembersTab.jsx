import React from 'react'

import Grid from '@mui/material/Grid'
import { EventAllDepartmentMembersTable } from './EventAllDepartmentMembersTable'

export const EventAllDepartmentMembersTab = ({ eventId, eventStart, eventFinish }) => {
  return (
    <Grid container spacing={1}>
      <Grid item size={12}>
        <EventAllDepartmentMembersTable
          eventId={eventId}
          eventStart={eventStart}
          eventFinish={eventFinish}
        />
      </Grid>
    </Grid>
  )
}
