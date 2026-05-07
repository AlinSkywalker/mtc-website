import React from 'react'
import { Typography, Grid, Container } from '@mui/material'
import { useFetchRegionalOffices } from '../queries/regionalOffices'

export const RegionalOfficesPage = () => {
  const { data } = useFetchRegionalOffices()

  const renderRegionalOffice = (
    /** @type {{ id: number; sub_name: string ; fio: string ; tel_1: string ; memb_email: string ; }} */ regionalOffice,
  ) => {
    return (
      <Grid key={regionalOffice.id} sx={{ mb: 1 }}>
        <Typography variant='h5' fontWeight={600}>
          {regionalOffice.sub_name}
        </Typography>
        <Typography variant='h6'>Руководитель: {regionalOffice.fio}</Typography>
        <Typography>Телефон: {regionalOffice.tel_1}</Typography>
        <Typography>Email: {regionalOffice.memb_email}</Typography>
      </Grid>
    )
  }
  return (
    <Container
      maxWidth={false}
      sx={{
        height: '100vh',
        backgroundColor: { xs: '#fff', md: '#f4f4f4' },
        border: '1px solid transparent',
      }}
    >
      <Grid container justifyContent={'center'} sx={{ m: 2, textAlign: 'center' }}>
        <Typography variant='h4' alignContent={'center'}>
          Региональные отделения
        </Typography>
      </Grid>

      {data?.map(renderRegionalOffice)}
    </Container>
  )
}
