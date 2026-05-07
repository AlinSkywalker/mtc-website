import React from 'react'

import { Typography, Grid, Container } from '@mui/material'
import { useFetchBoardMembers } from '../queries/boardMembers'

export const BoardMembersPage = () => {
  const { data } = useFetchBoardMembers()

  const renderBoardMember = (
    /** @type {{ id: number; position: string ; fio: string ; tel_1: string ; memb_email: string ; }} */ boardMember,
  ) => {
    return (
      <Grid key={boardMember.id} sx={{ mb: 1 }}>
        <Typography variant='h5' fontWeight={600}>
          {boardMember.position}
        </Typography>
        <Typography variant='h6'>{boardMember.fio}</Typography>
        <Typography>Телефон: {boardMember.tel_1}</Typography>
        <Typography>Email: {boardMember.memb_email}</Typography>
      </Grid>
    )
  }
  return (
    <Container
      maxWidth={false}
      sx={{
        height: '100vh',
        backgroundColor: '#fff',
        border: '1px solid transparent',
      }}
    >
      <Grid container justifyContent={'center'} sx={{ m: 2 }}>
        <Typography variant='h4' alignContent={'center'}>
          Члены правления
        </Typography>
      </Grid>

      {data?.map(renderBoardMember)}
    </Container>
  )
}
