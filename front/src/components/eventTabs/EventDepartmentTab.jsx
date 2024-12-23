import React, { useState } from 'react'

import Grid from '@mui/material/Grid2'

import { EventDepartmentTable } from './EventDepartmentTable'
import { EventDepartmentMemberTable } from './EventDepartmentMemberTable'
import { EventDepartmentDateTable } from './EventDepartmentDateTable'

export const EventDepartmentTab = ({ eventId, eventStart, eventFinish }) => {
  const [selectedDepartment, setSelectedDepartment] = useState()
  const [selectedDate, setSelectedDate] = useState()

  const onRowSelectionModelChange = (newRowSelectionModel) => {
    setSelectedDepartment(newRowSelectionModel[0])
    setSelectedDate()
  }

  const onRowSelectionModelDateTableChange = (newRowSelectionModel) => {
    setSelectedDate(newRowSelectionModel)
  }
  return (
    <Grid container spacing={1}>
      <Grid item size={6}>
        <EventDepartmentTable
          eventId={eventId}
          onRowSelectionModelChange={onRowSelectionModelChange}
          eventStart={eventStart}
          eventFinish={eventFinish}
        />
      </Grid>
      <Grid item size={1}>
        <EventDepartmentDateTable
          eventId={eventId}
          selectedDepartmentId={selectedDepartment}
          selectedDate={selectedDate}
          onRowSelectionModelChange={onRowSelectionModelDateTableChange}
        />
      </Grid>
      <Grid item size={5}>
        <EventDepartmentMemberTable
          eventId={eventId}
          selectedDepartmentId={selectedDepartment}
          selectedDate={selectedDate}
        />
      </Grid>
    </Grid>
  )
}
