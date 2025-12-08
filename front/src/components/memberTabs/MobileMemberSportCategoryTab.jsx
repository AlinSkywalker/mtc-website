import React, { useState } from 'react'
import { Card, CircularProgress, Container, Grid, Typography } from '@mui/material'
import { format, parseISO } from 'date-fns'

export const MobileMemberSportCategoryTab = ({ isLoading, data }) => {
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

  const renderItem = (item) => {
    const complDate = format(parseISO(item.date_completion || ''), 'dd.MM.yyyy')
    const prDate = format(parseISO(item.date_pr || ''), 'dd.MM.yyyy')
    const isExpanded = item.id === expandedItemId

    return (
      <Card
        sx={{ margin: '12px 0', padding: 1.5 }}
        onClick={() => setExpandedItemId(isExpanded ? '' : item.id)}
        key={item.id}
      >
        <Typography variant='h5' sx={{ fontSize: '19px' }}>
          {item.type} - {item.ball}
        </Typography>
        <Typography>
          <b>Дата выполнения:</b> {complDate}
        </Typography>
        {isExpanded && (
          <>
            <Typography>
              <b>Дата присвоения:</b> {prDate}
            </Typography>
            <Typography>
              <b>Номер приказа:</b> {item.nomer_prik}
            </Typography>
            <Typography>
              <b>Где присвоен:</b> {item.gde_pris}
            </Typography>
          </>
        )}
      </Card>
    )
  }

  return <Grid>{data?.map(renderItem)}</Grid>
}
