import React, { useState } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { useFetchEvent } from '../queries/event'
import { useLocation } from 'react-router-dom'
import { CircularProgress, IconButton, Tooltip, Typography } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import Tabs from '@mui/material/Tabs'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import { EventMembersTab } from './eventTabs/EventMembersTab'
import { EventDepartmentTab } from './eventTabs/EventDepartmentTab'
import { EventContractorTab } from './eventTabs/EventContractorTab'
import { EventBaseTab } from './eventTabs/EventBaseTab'
import { EventFilesTab } from './eventTabs/EventFilesTab'
import { EventDepartmentPlansTab } from './eventTabs/EventDepartmentPlansTab'
import { EventStatisticsTab } from './eventTabs/EventStatisticsTab'
import { EventAllDepartmentMembersTab } from './eventTabs/EventAllDepartmentMembersTab'
import { EventProtocolTab } from './eventTabs/EventProtocolTab'

import { EventBaseTable } from './EventBaseTable'
import { EventInfoForm } from './EventInfoForm'
import EditIcon from '@mui/icons-material/Edit';


export const EventInfoPage = () => {
  const [value, setValue] = React.useState(0)
  const [isDisplayForm, setIsDisplayForm] = useState(false)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const location = useLocation()
  const locationSplitted = location.pathname.split('/')
  const currentId = locationSplitted[locationSplitted.length - 1]
  const { isLoading, data } = useFetchEvent(currentId)

  const eventTabs = [
    {
      name: 'members',
      label: 'Участники',
      component: <EventMembersTab eventId={currentId} />,
    },
    {
      name: 'department',
      label: 'Отделения',
      component: (
        <EventDepartmentTab
          eventId={currentId}
          eventStart={data?.event_start}
          eventFinish={data?.event_finish}
        />
      ),
    },
    {
      name: 'all_department_members',
      label: 'Состав отделений',
      component: (
        <EventAllDepartmentMembersTab
          eventId={currentId}
          eventStart={data?.event_start}
          eventFinish={data?.event_finish}
        />
      ),
    },
    {
      name: 'departmentPlans',
      label: 'Планы отделений',
      component: (
        <EventDepartmentPlansTab
          eventId={currentId}
          eventDistrict={data?.raion_id_list}
          eventStart={data?.event_start}
          eventFinish={data?.event_finish}
        />
      ),
    },
    // {
    //   name: 'departmentPlansJournal',
    //   label: 'Журнал связи',
    //   component: (
    //     <EventDepartmentPlanJournalTab
    //       eventId={currentId}
    //       eventStart={data?.event_start}
    //       eventFinish={data?.event_finish}
    //     />
    //   ),
    // },
    // {
    {
      name: 'contractor',
      label: 'Контрагенты',
      component: <EventContractorTab eventId={currentId} />,
    },
    {
      name: 'base',
      label: 'Проживание',
      component: <EventBaseTab eventId={currentId} />,
    },
    {
      name: 'files',
      label: 'Файлы',
      component: <EventFilesTab eventId={currentId} />,
    },
    {
      name: 'statistics',
      label: 'Статистика',
      component: <EventStatisticsTab eventId={currentId} />,
    },
    {
      name: 'protocol',
      label: 'Протокол',
      component: <EventProtocolTab eventId={currentId} />,
    },
  ]

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
        <Grid container flexDirection='row' spacing={2} sx={{ margin: "8px 0" }}>
          <Typography variant='h4' sx={{ paddingLeft: 2 }}>
            {data.event_name}
          </Typography>
          <Tooltip title="Редактировать">
            <IconButton onClick={handleEditClick} sx={{ alignSelf: 'center' }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        {isDisplayForm && (<Grid container spacing={2}>
          <Grid size={10}>
            <Card sx={{ minWidth: 275 }}>

              <EventInfoForm eventData={data} isLoading={isLoading} />
            </Card>
          </Grid>
          <Grid size={2}>
            <EventBaseTable eventId={currentId} />
          </Grid>
        </Grid>)}
      </Card>

      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs onChange={handleChange} variant='scrollable' scrollButtons='auto' value={value}>
            {eventTabs.map((tab, index) => (
              <Tab key={index} label={tab.label} value={index} />
            ))}
          </Tabs>
        </Box>
        {eventTabs.map((tab, index) => (
          <TabPanel key={index} value={index} sx={{ p: '10px 0' }}>
            {value === index && tab.component}
          </TabPanel>
        ))}
      </TabContext>
    </Container>
  )
}
