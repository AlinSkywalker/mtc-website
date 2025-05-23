import React, { useState } from 'react'

import Grid from '@mui/material/Grid'

import { EventBaseHouseRoomTable } from './EventBaseHouseRoomTable'
import { EventBaseHouseRoomMemberTable } from './EventBaseHouseRoomMemberTable'

export const EventBaseTab = ({ eventId }) => {
  const [selectedBaseRoom, setSelectedBaseRoom] = useState()

  const onRowSelectionModelChange = (newRowSelectionModel) => {
    setSelectedBaseRoom(newRowSelectionModel[0])
  }

  return (
    <Grid container spacing={1}>
      <Grid size={7}>
        <EventBaseHouseRoomTable
          eventId={eventId}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />
      </Grid>
      <Grid size={5}>
        <EventBaseHouseRoomMemberTable eventId={eventId} selectedBaseRoom={selectedBaseRoom} />
      </Grid>
    </Grid>
  )
}
