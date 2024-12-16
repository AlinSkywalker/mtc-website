import React, { useState } from 'react'

import { Grid2 } from '@mui/material'

import { EventBaseHouseRoomTable } from './EventBaseHouseRoomTable'
import { EventDepartmentMemberTable } from './EventDepartmentMemberTable'

export const EventBaseTab = ({ eventId }) => {
  const [selectedBaseRoom, setSelectedDepartment] = useState()
  const [selectedDate, setSelectedDate] = useState()

  const onRowSelectionModelChange = (newRowSelectionModel) => {
    setSelectedDepartment(newRowSelectionModel[0])
    setSelectedDate()
  }

  return (
    <Grid2 container spacing={1}>
      <Grid2 item size={6}>
        <EventBaseHouseRoomTable
          eventId={eventId}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />
      </Grid2>
      {/* <Grid2 item size={5}>
        <EventDepartmentMemberTable
          eventId={eventId}
          selectedDepartmentId={selectedDepartment}
          selectedDate={selectedDate}
        />
      </Grid2> */}
    </Grid2>
  )
}
