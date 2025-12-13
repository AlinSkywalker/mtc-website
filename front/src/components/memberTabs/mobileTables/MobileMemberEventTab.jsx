import React, { useState } from 'react'
import { Card, CircularProgress, Container, Grid, Typography } from '@mui/material'
import { format, parseISO } from 'date-fns'
import { useNavigate } from 'react-router-dom'

export const MobileMemberEventTab = ({ isLoading, data }) => {
  const navigate = useNavigate()

  const handleItemClickName = (id) => () => {
    navigate(`/crm/event/${id}/`)
  }

  if (isLoading)
    return (
      <Container
        maxWidth={false}
        sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
      >
        <CircularProgress />
      </Container>
    )

  const renderItem = (eventItem) => {
    const eventStart = format(parseISO(eventItem.event_start || ''), 'dd.MM.yyyy')
    const eventFinish = format(parseISO(eventItem.event_finish || ''), 'dd.MM.yyyy')
    return (
      <Card
        onClick={handleItemClickName(eventItem.id)}
        sx={{ margin: 2, padding: 2 }}
        key={eventItem.id}
      >
        <Typography variant='h5'>{eventItem.event_name}</Typography>
        <Typography>
          {eventStart} - {eventFinish}
        </Typography>
        <Typography>{eventItem.event_desc}</Typography>
      </Card>
    )
  }

  return <Grid>{data?.map(renderItem)}</Grid>
}
