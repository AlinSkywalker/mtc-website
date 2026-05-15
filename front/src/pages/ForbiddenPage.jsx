import { Container, Grid, Typography } from '@mui/material'
import React from 'react'

import HttpsIcon from '@mui/icons-material/Https'

export const ForbiddenPage = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        height: '100vh',
        backgroundColor: '#fff',
        border: '1px solid transparent',
        pb: 3,
        overflowY: 'scroll',
      }}
    >
      <Grid
        container
        direction={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{ height: '100vh', textAlign: 'center' }}
      >
        <Grid>
          <HttpsIcon sx={{ fontSize: 70 }} />
        </Grid>

        <div className='message'>
          <Typography variant='h3' sx={{ mb: 2 }}>
            Доступ к этой странице запрещен
          </Typography>
          <Typography variant='h6'>Обратитесь к администратору системы</Typography>
        </div>
      </Grid>
    </Container>
  )
}
