import React, { useState } from 'react'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { format } from 'date-fns'
import { CircularProgress, IconButton, Tooltip, Typography } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useIsMobile } from '../hooks/useIsMobile'
import { useFetchEventInstructorsList } from '../queries/event'
import { useFetchEventBaseList } from '../queries/eventBase'
import { getFormattedNumber } from '../utils/numbers'
import { EventMemberPopover } from './EventMemberPopover'
import { EventBasePopover } from './EventBasePopover'
import InfoOutlineIcon from '@mui/icons-material/InfoOutline'

const dashedTextStyle = { textDecoration: 'underline dashed #1976d2', cursor: 'pointer' }

export const EventInfoRO = ({ eventData: data, isLoading }) => {
  const isMobile = useIsMobile()

  const { data: eventBaseData } = useFetchEventBaseList(data.id)
  const { data: eventInstructorsData } = useFetchEventInstructorsList(data.id)

  const [memberData, setMemberData] = useState(null)
  const [baseData, setBaseData] = useState(null)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [anchorElBase, setAnchorElBase] = React.useState(null)
  const [priceDescOpen, setPriceDescOpen] = useState(false)
  const [priceSportDescOpen, setPriceSportDescOpen] = useState(false)
  const [priceTouristDescOpen, setPriceTouristDescOpen] = useState(false)
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
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{data.event_full_desc}</Typography>
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
          <Typography sx={{ fontWeight: 'bold' }}>Старший тренер</Typography>
          <Typography sx={dashedTextStyle} onClick={(e) => handleClickMember(data.st.id, e)}>
            {data.st.fio}
          </Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>Ответственный за безопасность</Typography>
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
          <Grid container alignItems='center'>
            <Typography sx={{ fontWeight: 'bold' }}>Путевка на учебную смену</Typography>
            <Tooltip
              enterTouchDelay={0}
              title='Средства идут на проведение лекционных и практических занятий по различным предметам альпинисткой подготовки, проверке уровня профессиональных знаний и навыков участников, а также совершения восхождений согласно этапом подготовки. 
Включает в себя Стартовый и Организационный взносы'
            >
              <IconButton onClick={(e) => e.stopPropagation()}>
                <InfoOutlineIcon fontSize='small' color='info' />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid container alignItems='center' spacing={1}>
            <Typography>{price}</Typography>
            {data.price_desc && (
              <IconButton size='small' onClick={() => setPriceDescOpen(!priceDescOpen)}>
                {priceDescOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </Grid>
          {priceDescOpen && (
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
              {data.price_desc}
            </Typography>
          )}
        </Grid>
        <Grid size={isMobile ? 12 : 2}>
          <Grid container alignItems='center'>
            <Typography sx={{ fontWeight: 'bold' }}>Путевка на спортивную смену</Typography>
            <Tooltip
              enterTouchDelay={0}
              title='Средства идут на организацию соревнования, в том числе на оплату труда ответственного за безопасность, старшего тренера и судейской бригады, заполнение альпинистских книжек, составлений протоколов, изготовление медалей, грамот и других атрибутов.'
            >
              <IconButton onClick={(e) => e.stopPropagation()}>
                <InfoOutlineIcon fontSize='small' color='info' />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid container alignItems='center' spacing={1}>
            <Typography>{price_sport}</Typography>
            {data.price_sport_desc && (
              <IconButton size='small' onClick={() => setPriceSportDescOpen(!priceSportDescOpen)}>
                {priceSportDescOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </Grid>
          {priceSportDescOpen && (
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
              {data.price_sport_desc}
            </Typography>
          )}
        </Grid>
        <Grid size={isMobile ? 12 : 2}>
          <Grid container alignItems='center'>
            <Typography sx={{ fontWeight: 'bold' }}>Предоплата</Typography>
            <Tooltip
              enterTouchDelay={0}
              title='Взымается с болельщиков, сочувствующих и просто отдыхающих пользующихся услугами организации текущего мероприятия, таких как бронирование жилья, трансфера к месту проведения мероприятия, предоставление информации об инфраструктуре района.'
            >
              <IconButton onClick={(e) => e.stopPropagation()}>
                <InfoOutlineIcon fontSize='small' color='info' />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid container alignItems='center' spacing={1}>
            <Typography>{price_tourist}</Typography>
            {data.price_tourist_desc && (
              <IconButton size='small' onClick={() => setPriceTouristDescOpen(!priceTouristDescOpen)}>
                {priceTouristDescOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </Grid>
          {priceTouristDescOpen && (
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
              {data.price_tourist_desc}
            </Typography>
          )}
        </Grid>
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>Инструкторско/тренерский состав</Typography>
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
