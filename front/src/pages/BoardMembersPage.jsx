import React from 'react'

import { Typography, Grid, Container } from '@mui/material'
import { useFetchBoardMembers } from '../queries/boardMembers'
import DefaultImage from '../assets/default_profile.jpg'

export const BoardMembersPage = () => {
  const { data } = useFetchBoardMembers()

  const renderBoardMember = (
    /** @type {{ id: number; position: string ; fio: string ; tel_1: string ; memb_email: string ; }} */ boardMember,
  ) => {
    return (
      <Grid key={boardMember.id} sx={{ mb: 1 }}>
        <Typography variant='h5' fontWeight={600} sx={{ mb: 1 }}>
          {boardMember.position}
        </Typography>
        <Grid container>
          <Grid sx={{ mr: 2 }}>
            <img alt='' src={boardMember?.photo_preview || DefaultImage} width='100' height='100' />
          </Grid>
          <Grid>
            <Typography variant='h6'>{boardMember.fio}</Typography>
            <Typography>Телефон: {boardMember.tel_1}</Typography>
            <Typography>Email: {boardMember.memb_email}</Typography>
          </Grid>
        </Grid>
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
