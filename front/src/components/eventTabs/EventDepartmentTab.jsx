import React, { useState } from 'react'

import { Grid2 } from '@mui/material'

import { EventDepartmentTable } from './EventDepartmentTable'
import { EventDepartmentMemberTable } from './EventDepartmentMemberTable'
import { EventDepartmentDateTable } from './EventDepartmentDateTable'

export const EventDepartmentTab = ({ eventId }) => {
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
    <Grid2 container spacing={1}>
      <Grid2 item size={6}>
        <EventDepartmentTable
          eventId={eventId}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />
      </Grid2>
      <Grid2 item size={1}>
        <EventDepartmentDateTable
          eventId={eventId}
          selectedDepartmentId={selectedDepartment}
          selectedDate={selectedDate}
          onRowSelectionModelChange={onRowSelectionModelDateTableChange}
        />
      </Grid2>
      <Grid2 item size={5}>
        <EventDepartmentMemberTable
          eventId={eventId}
          selectedDepartmentId={selectedDepartment}
          selectedDate={selectedDate}
        />
      </Grid2>
    </Grid2>
  )
}
