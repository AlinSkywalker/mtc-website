import React, { useState } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { useFetchEvent } from '../queries/event'
import { useLocation, useParams, Route, Routes, Link } from 'react-router-dom'
import { CircularProgress, IconButton, Tooltip, Typography } from '@mui/material'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import { EventMembersTab } from '../components/eventTabs/EventMembersTab'
import { EventDepartmentTab } from '../components/eventTabs/EventDepartmentTab'
import { EventContractorTab } from '../components/eventTabs/EventContractorTab'
import { EventBaseTab } from '../components/eventTabs/EventBaseTab'
import { EventFilesTab } from '../components/eventTabs/EventFilesTab'
import { EventStatisticsTab } from '../components/eventTabs/EventStatisticsTab'
import { EventProtocolTab } from '../components/eventTabs/EventProtocolTab'

import { EventBaseTable } from '../components/EventBaseTable'
import { EventInfoForm } from '../components/EventInfoForm'
import EditIcon from '@mui/icons-material/Edit'

export const EventInfoPage = () => {
  const [isDisplayForm, setIsDisplayForm] = useState(false)

  const params = useParams()
  const { id: currentId } = params

  const location = useLocation()

  const { isLoading, data } = useFetchEvent(currentId)

  const basePath = `/admin/event/${currentId}`
  const eventTabs = [
    {
      name: 'members',
      path: `/`,
      label: 'Участники',
      component: <EventMembersTab eventId={currentId} />,
    },
    {
      name: 'department',
      path: `/department/`,
      label: 'Отделения',
      component: <EventDepartmentTab event={data} />,
    },
    {
      name: 'contractor',
      path: '/contractor',
      label: 'Контрагенты',
      component: <EventContractorTab />,
    },
    {
      name: 'base',
      path: '/base/',
      label: 'Проживание',
      component: <EventBaseTab />,
    },
    {
      name: 'files',
      path: '/files',
      label: 'Файлы',
      component: <EventFilesTab />,
    },
    {
      name: 'statistics',
      path: `/statistics`,
      label: 'Статистика',
      component: <EventStatisticsTab />,
    },
    {
      name: 'protocol',
      path: `/protocol`,
      label: 'Протокол',
      component: <EventProtocolTab />,
    },
  ]
  const currentTab = eventTabs.findIndex(
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
  const handleEditClick = () => {
    setIsDisplayForm(!isDisplayForm)
  }
  return (
    <Container
      maxWidth={false}
      sx={{ minHeight: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
    >
      <Card sx={{}}>
        <Grid container flexDirection='row' spacing={2} sx={{ margin: '8px 0' }}>
          <Typography variant='h4' sx={{ paddingLeft: 2 }}>
            {data.event_name}
          </Typography>
          <Tooltip title='Редактировать'>
            <IconButton onClick={handleEditClick} sx={{ alignSelf: 'center' }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        {isDisplayForm && (
          <Grid container spacing={2}>
            <Grid size={10}>
              <Card sx={{ minWidth: 275 }}>
                <EventInfoForm eventData={data} isLoading={isLoading} />
              </Card>
            </Grid>
            <Grid size={2}>
              <EventBaseTable eventId={currentId} />
            </Grid>
          </Grid>
        )}
      </Card>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab !== -1 ? currentTab : false}
          variant='scrollable'
          scrollButtons='auto'
        >
          {eventTabs.map((tab, index) => (
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
