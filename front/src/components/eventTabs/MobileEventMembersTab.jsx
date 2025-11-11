import React, { useState } from 'react'
import { useFetchEventMemberList } from '../../queries/event'
import { Card, CircularProgress, Container, Grid, Typography } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { red } from '@mui/material/colors'
import { format, parseISO } from 'date-fns'
import { useIsAdmin } from '../../hooks/useIsAdmin'

export const MobileEventMembersTab = ({ eventId }) => {
  const { isLoading, data } = useFetchEventMemberList(eventId)
  const isAdmin = useIsAdmin()

  const renderAlerts = (value) => {
    const alerts = value ?? []
    if (alerts.length !== 0) {
      const tooltipText = alerts.join(';\r\n')
      return (
        <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>}>
          <IconButton sx={{ color: red[500] }}>
            <ErrorIcon />
          </IconButton>
        </Tooltip>
      )
    } else {
      return value
    }
  }

  const [expandedItemId, setExpandedItemId] = useState('')
  const getBoolText = (value) => {
    return value ? 'Да' : 'Нет'
  }
  if (!eventId) return null
  if (isLoading)
    return (
      <Container
        maxWidth={false}
        sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
      >
        <CircularProgress />
      </Container>
    )
  const renderMemberItem = (memberItem) => {
    const memberStart = format(parseISO(memberItem.eventmemb_dates || ''), 'dd.MM.yyyy')
    const memberFinish = format(parseISO(memberItem.eventmemb_datef || ''), 'dd.MM.yyyy')
    const isExpanded = memberItem.id === expandedItemId

    return (
      <Card
        sx={{ margin: '12px 0', padding: 1.5 }}
        onClick={() => setExpandedItemId(isExpanded ? '' : memberItem.id)}
        key={memberItem.id}
      >
        <Typography variant='h5' sx={{ fontSize: '19px' }}>
          {isAdmin && renderAlerts(memberItem.alerts)}
          {memberItem.fio}
        </Typography>
        <Typography>
          {memberItem.eventmemb_role} (Разряд: {memberItem.ball})
        </Typography>
        <Typography>
          {memberStart} - {memberFinish}
        </Typography>
        {isExpanded && isAdmin && (
          <>
            <Typography>
              <b>Оплата:</b> {memberItem.eventmemb_pred}
            </Typography>
            <Typography>
              <b>Страховка:</b> {getBoolText(memberItem.eventmemb_nstrah)}
            </Typography>
            <Typography>
              <b>Справка:</b> {getBoolText(memberItem.eventmemb_nmed)}
            </Typography>
            <Typography>
              <b>Email:</b> {memberItem.memb_email}
            </Typography>
            <Typography>
              <b>Телефон:</b> {memberItem.tel_1}
            </Typography>
          </>
        )}
      </Card>
    )
  }

  return <Grid>{data?.map(renderMemberItem)}</Grid>
}
