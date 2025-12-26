import React, { useState } from 'react'
import { useFetchEventList } from '../../../queries/event'
import { Card, Grid, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { format, parseISO } from 'date-fns'
import { MobileTableItem } from '../../../components/MobileTableItem'

export const MobileEventListTable = () => {
  const [show, setShow] = useState('future')
  const { isLoading, data } = useFetchEventList(show)

  const navigate = useNavigate()

  const handleItemClickName = (id) => {
    navigate(`/crm/event/${id}/`)
  }

  const handleChangeShow = (event, show) => {
    if (show) {
      setShow(show)
    }
  }

  const rightPanel = (
    <>
      <ToggleButtonGroup
        value={show}
        exclusive
        onChange={handleChangeShow}
        aria-label='text alignment'
        sx={{ width: '100%' }}
      >
        <ToggleButton value='future' aria-label='left aligned' sx={{ width: '50%' }}>
          Будущие
        </ToggleButton>
        <ToggleButton value='past' aria-label='centered' sx={{ width: '50%' }}>
          Прошедшие
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  )

  const renderEventItem = (eventItem) => {
    const eventStart = format(parseISO(eventItem.event_start || ''), 'dd.MM.yyyy')
    const eventFinish = format(parseISO(eventItem.event_finish || ''), 'dd.MM.yyyy')
    return (
      <MobileTableItem handleItemClick={handleItemClickName} id={eventItem.id}>
        <Typography variant='h5'>{eventItem.event_name}</Typography>
        <Typography>
          {eventStart} - {eventFinish}
        </Typography>
        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{eventItem.event_desc}</Typography>
      </MobileTableItem>
    )
  }
  return (
    <Grid>
      {rightPanel}
      {data?.map(renderEventItem)}
    </Grid>
  )
}
