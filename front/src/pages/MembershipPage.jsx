import { Container, Grid, Typography } from '@mui/material'
import React from 'react'

export const MembershipPage = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        height: '100vh',
        backgroundColor: '#fff',
        border: '1px solid transparent',
      }}
    >
      <Grid
        container
        justifyContent={'center'}
        sx={{ m: 2, textAlign: 'center' }}
        direction={'column'}
      >
        <Typography variant='h4' alignContent={'center'}>
          УCTAB
        </Typography>
        <Typography variant='h4' alignContent={'center'}>
          MФСОО «Центр альпинистской подготовки»
        </Typography>
      </Grid>
    </Container>
  )
}
