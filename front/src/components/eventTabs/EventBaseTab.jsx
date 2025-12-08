import React, { useState } from 'react'

import Grid from '@mui/material/Grid'

import { EventBaseHouseRoomTable } from './tables/EventBaseHouseRoomTable'
import { EventBaseHouseRoomMemberTable } from './tables/EventBaseHouseRoomMemberTable'
import { useParams, useLocation } from 'react-router-dom'
import { EventBaseSettlementTab } from './EventBaseSettlementTab'

export const EventBaseTab = () => {
  const { id: eventId } = useParams()
  const [selectedBaseRoom, setSelectedBaseRoom] = useState('')

  const onRowSelectionModelChange = (newRowSelectionModel) => {
    let newId = ''
    newRowSelectionModel.ids.forEach((item) => {
      newId = item
    })
    setSelectedBaseRoom(newId)
  }
  const location = useLocation()
  const basePath = `/crm/event/${eventId}/base`

  const tabs = [
    {
      name: 'baseList',
      path: '/',
      label: 'Список номеров',
      component: (
        <EventBaseHouseRoomTable
          eventId={eventId}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />
      ),
    },
    {
      name: 'settlement',
      path: '/settlement',
      label: 'Расселение',
      component: <EventBaseSettlementTab />,
    },
  ]
  const currentTab = tabs.findIndex((tab) => `${basePath}${tab.path}` === location.pathname)
  return (
    <>
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
      {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab !== -1 ? currentTab : false}
          variant='scrollable'
          scrollButtons='auto'
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} component={Link} to={`${basePath}${tab.path}`} />
          ))}
        </Tabs>
      </Box>
      <Routes>
        {tabs.map((tab, index) => (
          <Route key={index} path={`${tab.path}/*`} element={tab.component} />
        ))}
      </Routes> */}
    </>
  )
}
