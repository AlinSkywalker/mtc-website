import React, { useState } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { useFetchEvent } from '../queries/event'
import { useLocation, useParams, Route, Routes, Link } from 'react-router-dom'
import { Button, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'

import { EventBaseTable } from '../components/tables/EventBaseTable'
import { EventInfoForm } from '../components/EventInfoForm'
import EditIcon from '@mui/icons-material/Edit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useIsMobile } from '../hooks/useIsMobile'
import { EventInfoFormRO } from '../components/EventInfoFormRO'
import { useGetUserEventPermisson } from '../hooks/useGetUserPermisson'
import { useIsAdmin } from '../hooks/useIsAdmin'
import { useGetEventTabs } from '../hooks/useGetEventTabs'
import { EventApplicationDialog } from '../components/dialogs/EventApplicationDialog'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

export const EventInfoPage = () => {
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false)
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
  const handleEditClick = () => {
    setIsDisplayForm(!isDisplayForm)
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
          spacing={2}
          sx={{ margin: '8px 0' }}
          alignItems={'center'}
        >
          <Typography variant='h5' sx={{ paddingLeft: 2 }}>
            {data.event_name}
          </Typography>
          <Tooltip title={readOnly ? 'Просмотреть' : 'Редактировать'}>
            <IconButton onClick={handleEditClick} sx={{ alignSelf: 'center' }}>
              {readOnly ? <ExpandMoreIcon /> : <EditIcon />}
            </IconButton>
          </Tooltip>
          {data.event_finish > new Date() && (
            <>
              {isMobile ? (
                <Tooltip title='Подать заявку'>
                  <IconButton
                    onClick={() => setIsApplicationDialogOpen(true)}
                    sx={{ alignSelf: 'center' }}
                  >
                    {<PersonAddIcon />}
                  </IconButton>
                </Tooltip>
              ) : (
                <Button variant='contained' onClick={() => setIsApplicationDialogOpen(true)}>
                  Подать заявку
                </Button>
              )}
            </>
          )}
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
      <EventApplicationDialog
        eventId={currentId}
        open={isApplicationDialogOpen}
        setOpen={setIsApplicationDialogOpen}
      />
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
