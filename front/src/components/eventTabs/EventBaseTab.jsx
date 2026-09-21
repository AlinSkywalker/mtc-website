import React from 'react'

import Grid from '@mui/material/Grid'

import { useIsAdmin } from '../../hooks/useIsAdmin'
import { useParams, useLocation, Routes, Route, Link } from 'react-router-dom'
import { EventBaseSettlementTab } from './EventBaseSettlementTab'
import { EventBaseTable } from '../tables/EventBaseTable'
import { Box, Tab, Tabs } from '@mui/material'

export const EventBaseTab = () => {
  const { id: eventId } = useParams()

  const readOnly = !useIsAdmin()

  const location = useLocation()
  const basePath = `/crm/event/${eventId}/base`

  const tabs = [
    {
      name: 'baseList',
      path: '/',
      label: 'Базы',
      component: <EventBaseTable eventId={eventId} readOnly={readOnly} />,
    },
    {
      name: 'settlement',
      path: '/settlement',
      label: 'Расселение',
      component: (
        <Grid container spacing={1}>
          <EventBaseSettlementTab />
        </Grid>
      ),
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
