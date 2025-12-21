import React, { useState } from 'react'

import { format, parseISO } from 'date-fns'
import { Card, CircularProgress, Container, Grid, Typography } from '@mui/material'

export const MobileMemberEquipmentTab = ({ isLoading, data }) => {
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
    const isExpanded = item.id === expandedItemId
    const { stor_name, equip_type, equip_name, quantity, loss } = item

    return (
      <Card
        sx={{ margin: '12px 0', padding: 1.5 }}
        onClick={() => setExpandedItemId(isExpanded ? '' : item.id)}
        key={item.id}
      >
        <Typography variant='h5' sx={{ fontSize: '19px' }}>
          {equip_type}, {equip_name}
        </Typography>
        <Typography>
          <b>Количество:</b> {quantity}
        </Typography>
        {isExpanded && (
          <>
            <Typography>
              <b>Склад:</b> {stor_name}
            </Typography>
            <Typography>
              <b>Утеряно:</b> {loss ? 'Да' : 'Нет'}
            </Typography>
          </>
        )}
      </Card>
    )
  }

  return <Grid>{data?.map(renderItem)}</Grid>
}
