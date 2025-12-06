import React from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { useFetchEvent } from '../queries/event'
import { useLocation, useParams, Route, Routes, Link } from 'react-router-dom'
import { CircularProgress, Typography } from '@mui/material'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'

import { useGetUserEventPermisson } from '../hooks/useGetUserPermisson'
import { useIsAdmin } from '../hooks/useIsAdmin'
import { useGetEventTabs } from '../hooks/useGetEventTabs'
import { format } from 'date-fns'

export const EventInfoPage = () => {
  const params = useParams()
  const { id: currentId } = params

  const location = useLocation()

  const { isLoading, data } = useFetchEvent(currentId)
  const { isCurrentMemberST } = useGetUserEventPermisson(currentId)
  const isAdmin = useIsAdmin()
  const readOnly = !isAdmin && !isCurrentMemberST

  const basePath = `/event/${currentId}`

  const { eventTabs, roEventTabs } = useGetEventTabs(data)
  const tabs = readOnly ? roEventTabs : eventTabs
  const currentTab = tabs.findIndex(
    (tab) =>
      `${basePath}${tab.path}` === location.pathname ||
      (tab.path !== '/' && location.pathname.startsWith(`${basePath}${tab.path}`)),
  )

  if (isLoading) {
    return (
      <Container
        maxWidth={false}
        sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
      >
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container
      maxWidth={false}
      sx={{ minHeight: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
    >
      <Card sx={{}}>
        <Grid
          container
          flexDirection='row'
          // spacing={isMobile ? 0 : 2}
          sx={{ margin: '8px 0' }}
          alignItems={'center'}
        >
          <Grid size={12}>
            <Typography variant='h5' sx={{ paddingLeft: 2 }}>
              {data.event_name}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography
              variant='h5'
              sx={{ paddingLeft: 2 }}
            >{`${format(data.event_start, 'dd.MM.yyyy')}-${format(data.event_finish, 'dd.MM.yyyy')}`}</Typography>
          </Grid>
        </Grid>
      </Card>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab !== -1 ? currentTab : false}
          variant='scrollable'
          scrollButtons='auto'
          allowScrollButtonsMobile
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} component={Link} to={`${basePath}${tab.path}`} />
          ))}
        </Tabs>
      </Box>
      <Routes>
        {eventTabs.map((tab, index) => (
          <Route key={index} path={`${tab.path}/*`} element={tab.component} />
        ))}
      </Routes>
    </Container>
  )
}
