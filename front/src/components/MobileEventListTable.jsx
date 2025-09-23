import React from 'react'
import { useFetchEventList } from '../queries/event'
import { Card, Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { format, parseISO } from 'date-fns'

export const MobileEventListTable = ({ readOnly = false }) => {
  const { isLoading, data } = useFetchEventList()
  const navigate = useNavigate()

  const handleItemClickName = (id) => () => {
    if (readOnly) navigate(`/event/${id}/`)
    else navigate(`/admin/event/${id}/`)
  }

  const renderEventItem = (eventItem) => {
    const eventStart = format(parseISO(eventItem.event_start || ''), 'dd.MM.yyyy')
    const eventFinish = format(parseISO(eventItem.event_finish || ''), 'dd.MM.yyyy')
    return (
      <Card onClick={handleItemClickName(eventItem.id)} sx={{ margin: 2, padding: 2 }}>
        <Typography variant='h5'>{eventItem.event_name}</Typography>
        <Typography>
          {eventStart} - {eventFinish}
        </Typography>
        <Typography>{eventItem.event_desc}</Typography>
      </Card>
    )
  }
  return <Grid>{data?.map(renderEventItem)}</Grid>
}
