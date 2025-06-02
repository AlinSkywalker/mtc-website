import React, { useState } from 'react'

import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'

import { EventBaseHouseRoomTable } from './EventBaseHouseRoomTable'
import { EventBaseHouseRoomMemberTable } from './EventBaseHouseRoomMemberTable'
import { useParams, useLocation, Route, Routes, Link } from 'react-router-dom'
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
  const basePath = `/admin/event/${eventId}/base`

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
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
      </Routes>
    </>
  )
}
