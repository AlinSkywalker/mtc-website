import React, { useState } from 'react'

import { format, parseISO } from 'date-fns'
import { Card, CircularProgress, Container, Grid, Typography } from '@mui/material'

export const MobileMemberExamTab = ({ isLoading, data }) => {
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

  const renderExamItem = (examItem) => {
    const zachDate = examItem.zach_date
      ? format(parseISO(examItem.zach_date || ''), 'dd.MM.yyyy')
      : ''
    const isExpanded = examItem.id === expandedItemId

    return (
      <Card
        sx={{ margin: '12px 0', padding: 1.5 }}
        onClick={() => setExpandedItemId(isExpanded ? '' : examItem.id)}
        key={examItem.id}
      >
        <Typography variant='h5' sx={{ fontSize: '19px' }}>
          {examItem.zach_name}, {examItem.zach_grade}
        </Typography>
        <Typography>{zachDate}</Typography>
        {isExpanded && (
          <>
            <Typography>
              <b>Экзаменатор 1:</b> {examItem.zach_e1}
            </Typography>
            <Typography>
              <b>Экзаменатор 2:</b> {examItem.zach_e2}
            </Typography>
            <Typography>
              <b>Заметки:</b> {examItem.zach_note}
            </Typography>
          </>
        )}
      </Card>
    )
  }

  return <Grid>{data?.map(renderExamItem)}</Grid>
}
