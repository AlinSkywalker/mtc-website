import { Container, Grid, Link, Typography } from '@mui/material'
import React from 'react'

export const NotFoundPage = () => {
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
        <div className='message'>
          <Typography variant='h3' sx={{ mb: 2 }}>
            Страница не найдена
          </Typography>
          <Link variant='h6' sx={{ cursor: 'pointer' }} href='/'>
            Перейти на главную {'->'}
          </Link>
        </div>
      </Grid>
    </Container>
  )
}
