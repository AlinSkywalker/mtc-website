import React, { useState } from 'react'

import Grid from '@mui/material/Grid'

import { EventDepartmentTable } from './EventDepartmentTable'

export const EventDepartmentTab = ({ eventId, eventStart, eventFinish }) => {
  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <EventDepartmentTable eventId={eventId} eventStart={eventStart} eventFinish={eventFinish} />
      </Grid>
    </Grid>
  )
}
