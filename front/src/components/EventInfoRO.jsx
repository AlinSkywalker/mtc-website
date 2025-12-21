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
import { EventMemberPopover } from './EventMemberPopover'
import { EventBasePopover } from './EventBasePopover'

const dashedTextStyle = { textDecoration: 'underline dashed #1976d2', cursor: 'pointer' }

export const EventInfoRO = ({ eventData: data, isLoading }) => {
  const isMobile = useIsMobile()

  const { data: eventBaseData } = useFetchEventBaseList(data.id)
  const { data: eventInstructorsData } = useFetchEventInstructorsList(data.id)

  const [memberData, setMemberData] = useState(null)
  const [baseData, setBaseData] = useState(null)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [anchorElBase, setAnchorElBase] = React.useState(null)
  const open = Boolean(anchorEl)
  const openBase = Boolean(anchorElBase)

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

  const handleClickMember = async (memberId, event) => {
    try {
      setAnchorEl(event.currentTarget)

      setMemberData(memberId)
    } catch (error) { }
  }

  const handleClickBase = async (baseId, event) => {
    try {
      setAnchorElBase(event.currentTarget)

      setBaseData(baseId)
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
            <Typography
              key={item.id}
              sx={dashedTextStyle}
              onClick={(e) => handleClickBase(item.base_id, e)}
            >
              {item.base_name}
            </Typography>
          ))}
        </Grid>
      </Grid>
      {open && (
        <EventMemberPopover
          memberId={memberData}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          open={open}
        />
      )}
      {openBase && (
        <EventBasePopover
          baseId={baseData}
          anchorEl={anchorElBase}
          setAnchorEl={setAnchorElBase}
          open={openBase}
        />
      )}
    </CardContent>
  )
}
