import React, { useState } from 'react'
import { useFetchMemberAscentList } from '../../queries/member'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { useFetchEventList } from '../../queries/event'
import { dateColumnType, dateTimeColumnType } from '../dataGridCell/GridEditDateCell'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
import { EditCascadeSelectMenu } from '../dataGridCell/EditCascadeSelectMenu'
import { GridEditInputCell } from '@mui/x-data-grid'
import { useIsAdmin } from '../../hooks/useIsAdmin'
import { format, parseISO } from 'date-fns'
import { Card, CircularProgress, Container, Grid, Typography } from '@mui/material'

export const MobileMemberAscentTab = ({ memberId }) => {
  const { isLoading, data } = useFetchMemberAscentList(memberId)

  const [expandedItemId, setExpandedItemId] = useState('')
  if (isLoading)
    return (
      <Container
        maxWidth={false}
        sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
      >
        <CircularProgress />
      </Container>
    )
  if (!memberId) return null

  const renderAscentItem = (ascentItem) => {
    const ascDate = format(parseISO(ascentItem.asc_date || ''), 'dd.MM.yyyy')
    const timeFinish = ascentItem.asc_timesf
      ? format(parseISO(ascentItem.asc_timesf || ''), 'dd.MM.yyyy HH:mm')
      : ''
    const timeStart = ascentItem.asc_times
      ? format(parseISO(ascentItem.asc_times || ''), 'dd.MM.yyyy HH:mm')
      : ''
    const isExpanded = ascentItem.id === expandedItemId

    return (
      <Card
        sx={{ margin: '12px 0', padding: 1.5 }}
        onClick={() => setExpandedItemId(isExpanded ? '' : ascentItem.id)}
        key={ascentItem.id}
      >
        <Typography variant='h5' sx={{ fontSize: '19px' }}>
          {ascentItem.mount_name}, {ascentItem.rout_name} ({ascentItem.rout_comp})
        </Typography>
        <Typography>{ascDate}</Typography>
        {isExpanded && (
          <>
            <Typography>
              <b>Роль:</b> {ascentItem.asc_typ}
            </Typography>
            <Typography>
              <b>Руководитель:</b> {ascentItem.asc_ruk}
            </Typography>
            <Typography>
              <b>Участников:</b> {ascentItem.asc_kolu}
            </Typography>
            <Typography>
              <b>Старт:</b> {timeStart}
            </Typography>
            <Typography>
              <b>На вершине:</b> {timeFinish}
            </Typography>
            <Typography>
              <b>Мероприятие:</b> {ascentItem.event_name}
            </Typography>
          </>
        )}
      </Card>
    )
  }

  return <Grid>{data?.map(renderAscentItem)}</Grid>
}
