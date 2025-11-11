import React, { useState } from 'react'
import { Card, CircularProgress, Container, Grid, Typography } from '@mui/material'
import { format, parseISO } from 'date-fns'

export const MobileMemberLabaAscentTab = ({ isLoading, data }) => {
  // const readOnly = !useIsAdmin()

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

  const renderAscentItem = (ascentItem) => {
    const ascDate = format(parseISO(ascentItem.ascent_date || ''), 'dd.MM.yyyy')
    const isExpanded = ascentItem.id === expandedItemId

    return (
      <Card
        sx={{ margin: '12px 0', padding: 1.5 }}
        onClick={() => setExpandedItemId(isExpanded ? '' : ascentItem.id)}
        key={ascentItem.id}
      >
        <Typography variant='h5' sx={{ fontSize: '19px' }}>
          {ascentItem.laba_name}, {ascentItem.labatr_name} ({ascentItem.labatr_sl})
        </Typography>
        <Typography>{ascDate}</Typography>
        {isExpanded && (
          <>
            <Typography>
              <b>Страховка:</b> {ascentItem.ascent_belay}
            </Typography>
            <Typography>
              <b>Тип пролаза:</b> {ascentItem.ascent_type}
            </Typography>
          </>
        )}
      </Card>
    )
  }

  return <Grid>{data?.map(renderAscentItem)}</Grid>
}
