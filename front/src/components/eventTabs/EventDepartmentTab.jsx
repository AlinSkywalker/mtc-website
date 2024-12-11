import React, { useState } from 'react'

import { Grid2 } from '@mui/material'

import { EventDepartmentTable } from './EventDepartmentTable'
import { EventDepartmentMemberTable } from './EventDepartmentMemberTable'

export const EventDepartmentTab = ({ eventId }) => {
  const [selectedDepartment, setSelectedDepartment] = useState()

  const onRowSelectionModelChange = (newRowSelectionModel) => {
    console.log('newRowSelectionModel', newRowSelectionModel)
    setSelectedDepartment(newRowSelectionModel[0])
  }
  return (
    <Grid2 container spacing={1}>
      <Grid2 item size={6}>
        <EventDepartmentTable
          eventId={eventId}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />
      </Grid2>
      <Grid2 item size={6}>
        <EventDepartmentMemberTable eventId={eventId} selectedDepartmentId={selectedDepartment} />
      </Grid2>
    </Grid2>
  )
}
