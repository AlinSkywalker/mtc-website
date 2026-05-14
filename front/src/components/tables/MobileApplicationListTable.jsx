import React from 'react'
import { Button, Grid, Link, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { useFetchApplicationList } from '../../queries/application'
import { MobileTableItem } from '../MobileTableItem'
import { format, parseISO } from 'date-fns'

export const MobileApplicationListTable = () => {
  const { isLoading, data } = useFetchApplicationList()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleClickName = (id) => () => {
    navigate(`/crm/member/${id}`)
  }

  const handleClickEvent = (id) => () => {
    navigate(`/crm/event/${id}`)
  }

  const handleAcceptApplication = (id) => () => {
    apiClient.post(`/api/applicationList/${id}/accept`).then((res) => {
      queryClient.invalidateQueries({
        queryKey: ['applicationList'],
      })
    })
  }

  const renderItem = (item) => {
    const dateStart = format(parseISO(item.date_start || ''), 'dd.MM.yyyy')
    const dateFinish = format(parseISO(item.date_finish || ''), 'dd.MM.yyyy')

    return (
      <MobileTableItem id={item.id} key={item.id}>
        <Link onClick={handleClickEvent(item.event)}>
          <Typography variant='h5'>{item.event_name}</Typography>
        </Link>
        <Link onClick={handleClickName(item.member)}>
          <Typography variant='h6'>{item.fio}</Typography>
        </Link>

        <Typography>
          <b>Дата заезда:</b> {dateStart}
        </Typography>
        <Typography>
          <b>Дата отъезда:</b> {dateFinish}
        </Typography>
        <Typography>
          <b>Тип отделения:</b> {item.department_type}
        </Typography>
        {!item.accepted && (
          <Grid
            container
            alignItems={'center'}
            sx={{ height: '100%', width: '100%' }}
            justifyContent='center'
          >
            <Button
              size='small'
              variant='contained'
              onClick={handleAcceptApplication(item.id)}
              disabled={item.accepted}
            >
              Принять
            </Button>
          </Grid>
        )}
      </MobileTableItem>
    )
  }

  return <Grid>{data?.map(renderItem)}</Grid>
}
