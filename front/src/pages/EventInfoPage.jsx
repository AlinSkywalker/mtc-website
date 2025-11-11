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

import { EventBaseTable } from '../components/tables/EventBaseTable'
import { EventInfoForm } from '../components/EventInfoForm'
import EditIcon from '@mui/icons-material/Edit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { EventManagementStuffTab } from '../components/eventTabs/EventManagementStuffTab'
import { EventInstructionLogTab } from '../components/eventTabs/EventInstructionLogTab'
import { useIsMobile } from '../hooks/useIsMobile'
import { EventDistrictInfoTab } from '../components/eventTabs/EventDistrictInfoTab'
import { EventInfoFormRO } from '../components/EventInfoFormRO'
import { MobileEventMembersTab } from '../components/eventTabs/MobileEventMembersTab'
import { useGetUserEventPermisson } from '../hooks/useGetUserPermisson'
import { useIsAdmin } from '../hooks/useIsAdmin'

export const EventInfoPage = () => {
  const [isDisplayForm, setIsDisplayForm] = useState(false)

  const params = useParams()
  const { id: currentId } = params

  const location = useLocation()
  const isMobile = useIsMobile()

  const { isLoading, data } = useFetchEvent(currentId)
  const { isCurrentMemberST } = useGetUserEventPermisson(currentId)
  const isAdmin = useIsAdmin()
  const readOnly = !isAdmin && !isCurrentMemberST

  const basePath = readOnly ? `/event/${currentId}` : `/admin/event/${currentId}`
  const eventTabs = [
    {
      name: 'members',
      path: `/`,
      label: 'Участники',
      component: isMobile ? (
        <MobileEventMembersTab eventId={currentId} />
      ) : (
        <EventMembersTab eventId={currentId} />
      ),
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
      name: 'managementStaff',
      path: `/management_staff`,
      label: 'Руководящий состав',
      component: <EventManagementStuffTab />,
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
      component: <EventProtocolTab eventName={data?.event_name} />,
    },
    {
      name: 'instructionLog',
      path: `/instruction_log`,
      label: 'Книга распоряжений',
      component: <EventInstructionLogTab />,
    },
  ]
  const roEventTabs = [
    {
      name: 'members',
      path: `/`,
      label: 'Участники',
      component: isMobile ? (
        <MobileEventMembersTab eventId={currentId} />
      ) : (
        <EventMembersTab eventId={currentId} />
      ),
    },
    {
      name: 'department',
      path: `/department/`,
      label: 'Отделения',
      component: <EventDepartmentTab event={data} />,
    },
    {
      name: 'protocol',
      path: `/protocol`,
      label: 'Протокол',
      component: <EventProtocolTab eventName={data?.event_name} />,
    },
    {
      name: 'district',
      path: `/district`,
      label: 'Район',
      component: <EventDistrictInfoTab />,
    },
  ]
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
          <Tooltip title={readOnly ? 'Просмотреть' : 'Редактировать'}>
            <IconButton onClick={handleEditClick} sx={{ alignSelf: 'center' }}>
              {readOnly ? <ExpandMoreIcon /> : <EditIcon />}
            </IconButton>
          </Tooltip>
        </Grid>
        {isDisplayForm && (
          <Grid container spacing={2}>
            <Grid size={isMobile ? 12 : 10}>
              <Card sx={{ minWidth: 275 }}>
                {readOnly ? (
                  <EventInfoFormRO eventData={data} isLoading={isLoading} />
                ) : (
                  <EventInfoForm eventData={data} isLoading={isLoading} readOnly={readOnly} />
                )}
              </Card>
            </Grid>
            {!readOnly && (
              <Grid size={isMobile ? 12 : 2}>
                <EventBaseTable eventId={currentId} readOnly={readOnly} />
              </Grid>
            )}
          </Grid>
        )}
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
