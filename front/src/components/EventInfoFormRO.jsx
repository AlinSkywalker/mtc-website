import React from 'react'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { format } from 'date-fns'
import { CircularProgress, Typography } from '@mui/material'
import { useIsMobile } from '../hooks/useIsMobile'
import { useFetchEventInstructorsList } from '../queries/event'
import { useFetchEventBaseList } from '../queries/eventBase'

export const EventInfoFormRO = ({ eventData: data, isLoading }) => {
  const isMobile = useIsMobile()

  const { data: eventBaseData } = useFetchEventBaseList(data.id)
  const { data: eventInstructorsData } = useFetchEventInstructorsList(data.id)

  if (isLoading) {
    return (
      <Container
        maxWidth={false}
        sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
      >
        <CircularProgress />
      </Container>
    )
  }
  const price = new Intl.NumberFormat('ru', { style: 'currency', currency: 'RUB' }).format(
    data.price,
  )
  const price_sport = data.price_sport
    ? new Intl.NumberFormat('ru', { style: 'currency', currency: 'RUB' }).format(data.price_sport)
    : ''
  const price_tourist = data.price_tourist
    ? new Intl.NumberFormat('ru', { style: 'currency', currency: 'RUB' }).format(data.price_tourist)
    : ''
  const dashedTextStyle = { textDecoration: 'underline dashed #1976d2', cursor: 'pointer' }
  const handleClickMember = () => { }
  return (
    <CardContent>
      <Grid container flexDirection='row' spacing={2}>
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>Описание</Typography>
          <Typography>{data.event_desc}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 2}>
          <Typography sx={{ fontWeight: 'bold' }}>Дата начала</Typography>
          <Typography>{format(data.event_start, 'dd.MM.yyyy')}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 2}>
          <Typography sx={{ fontWeight: 'bold' }}>Дата окончания</Typography>
          <Typography>{format(data.event_finish, 'dd.MM.yyyy')}</Typography>
        </Grid>
        {!isMobile && <Grid size={4}></Grid>}
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }} onClick={handleClickMember}>
            СТ
          </Typography>
          <Typography sx={dashedTextStyle}>{data.st.fio}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>ОБ</Typography>
          <Typography sx={dashedTextStyle}>{data.ob.fio}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>Врач</Typography>
          <Typography sx={dashedTextStyle}>{data.doctor.fio}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>Район проведения</Typography>
          <Typography>{data.raion_name}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 2}>
          <Typography sx={{ fontWeight: 'bold' }}>Инструкторский сбор</Typography>
          <Typography>{price}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 2}>
          <Typography sx={{ fontWeight: 'bold' }}>Цена для спортсменов</Typography>
          <Typography>{price_sport}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 2}>
          <Typography sx={{ fontWeight: 'bold' }}>Цена для туристовв</Typography>
          <Typography>{price_tourist}</Typography>
        </Grid>
        <Grid size={12}>
          <Typography sx={{ fontWeight: 'bold' }}>Инструкторский состав</Typography>
          {eventInstructorsData?.map((item) => (
            <Typography key={item.id} sx={dashedTextStyle}>
              {item.fio}
            </Typography>
          ))}
        </Grid>
        <Grid size={12}>
          <Typography sx={{ fontWeight: 'bold' }}>Проживание</Typography>
          {eventBaseData?.map((item) => (
            <Typography key={item.id}>{item.base_name}</Typography>
          ))}
        </Grid>
      </Grid>
    </CardContent>
  )
}
