import React, { useState } from 'react'

import { Grid2 } from '@mui/material'

import { EventBaseHouseRoomTable } from './EventBaseHouseRoomTable'
import { EventBaseHouseRoomMemberTable } from './EventBaseHouseRoomMemberTable'

export const EventBaseTab = ({ eventId }) => {
  const [selectedBaseRoom, setSelectedBaseRoom] = useState()

  const onRowSelectionModelChange = (newRowSelectionModel) => {
    setSelectedBaseRoom(newRowSelectionModel[0])
  }

  return (
    <Grid2 container spacing={1}>
      <Grid2 item size={7}>
        <EventBaseHouseRoomTable
          eventId={eventId}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />
      </Grid2>
      <Grid2 item size={5}>
        <EventBaseHouseRoomMemberTable eventId={eventId} selectedBaseRoom={selectedBaseRoom} />
      </Grid2>
    </Grid2>
  )
}
