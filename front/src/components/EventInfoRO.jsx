import React, { useState } from 'react'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { format } from 'date-fns'
import { CircularProgress, IconButton, Popover, Typography } from '@mui/material'
import { useIsMobile } from '../hooks/useIsMobile'
import { useFetchEventInstructorsList } from '../queries/event'
import { useFetchEventBaseList } from '../queries/eventBase'
import apiClient from '../api/api'
import CloseIcon from '@mui/icons-material/Close'
import { getFormattedNumber } from '../utils/numbers'

export const EventInfoRO = ({ eventData: data, isLoading }) => {
  const isMobile = useIsMobile()

  const { data: eventBaseData } = useFetchEventBaseList(data.id)
  const { data: eventInstructorsData } = useFetchEventInstructorsList(data.id)

  const [memberData, setMemberData] = useState(null)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(memberData)

  const handleClose = () => {
    setAnchorEl(null)
    setMemberData(null)
  }

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
  const price = getFormattedNumber(data.price)
  const price_sport = getFormattedNumber(data.price_sport)
  const price_tourist = getFormattedNumber(data.price_tourist)

  const dashedTextStyle = { textDecoration: 'underline dashed #1976d2', cursor: 'pointer' }

  const handleClickMember = async (memberId, event) => {
    try {
      setAnchorEl(event.currentTarget)
      const { data: member } = await apiClient.get(`/api/memberList/${memberId}`)

      setMemberData({
        member_photo: member.member_photo,
        aboutMe: member.about_me,
        fio: member.fio,
      })
    } catch (error) { }
  }
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
          <Typography sx={{ fontWeight: 'bold' }}>СТ</Typography>
          <Typography sx={dashedTextStyle} onClick={(e) => handleClickMember(data.st.id, e)}>
            {data.st.fio}
          </Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>ОБ</Typography>
          <Typography sx={dashedTextStyle} onClick={(e) => handleClickMember(data.ob.id, e)}>
            {data.ob.fio}
          </Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>Врач</Typography>
          <Typography sx={dashedTextStyle} onClick={(e) => handleClickMember(data.doctor.id, e)}>
            {data.doctor.fio}
          </Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>Район проведения</Typography>
          {data?.raion_name_list?.map((baseItem, index) => (
            <Typography key={index}>{baseItem}</Typography>
          ))}
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
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>Инструкторский состав</Typography>
          {eventInstructorsData?.map((item) => (
            <Typography
              key={item.id}
              sx={dashedTextStyle}
              onClick={(e) => handleClickMember(item.member_id, e)}
            >
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
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Grid container spacing={2} sx={{ p: 2, maxHeight: 350 }}>
          <img alt='' src={memberData?.member_photo} width='200' height='200' />
          <Grid sx={{ maxWidth: 400 }}>
            <Typography sx={{ fontWeight: 'bold' }}>{memberData?.fio}</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{memberData?.aboutMe}</Typography>
          </Grid>
          <Grid sx={{ width: 20 }}>
            <IconButton
              aria-label='close'
              onClick={handleClose}
              sx={(theme) => ({
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Popover>
    </CardContent>
  )
}
