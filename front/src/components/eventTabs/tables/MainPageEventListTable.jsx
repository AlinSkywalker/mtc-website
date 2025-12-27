import React, { useState } from 'react'
import { useFetchMainPageEventList } from '../../../queries/event'
import { Grid, IconButton, Tooltip, Typography } from '@mui/material'

import { format, parseISO } from 'date-fns'
import { MobileTableItem } from '../../../components/MobileTableItem'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { getFormattedNumber } from '../../../utils/numbers'
import { EventMemberPopover } from '../../../components/EventMemberPopover'
import { EventBasePopover } from '../../../components/EventBasePopover'
import InfoOutlineIcon from '@mui/icons-material/InfoOutline'

const dashedTextStyle = { textDecoration: 'underline dashed #1976d2', cursor: 'pointer' }

export const MainPageEventListTable = () => {
  const { data } = useFetchMainPageEventList()
  const isMobile = useIsMobile()

  const [memberData, setMemberData] = useState(null)
  const [baseData, setBaseData] = useState(null)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [anchorElBase, setAnchorElBase] = React.useState(null)
  const open = Boolean(anchorEl)
  const openBase = Boolean(anchorElBase)

  const [expandedItemId, setExpandedItemId] = useState('')

  const renderEventItem = (eventItem) => {
    const eventStart = eventItem.event_start
      ? format(parseISO(eventItem.event_start), 'dd.MM.yyyy')
      : ''
    const eventFinish = eventItem.event_finish
      ? format(parseISO(eventItem.event_finish), 'dd.MM.yyyy')
      : ''

    const price = getFormattedNumber(eventItem.price)
    const price_sport = getFormattedNumber(eventItem.price_sport)
    const price_tourist = getFormattedNumber(eventItem.price_tourist)

    const handleClickMember = async (memberId, event) => {
      event.stopPropagation()
      try {
        setAnchorEl(event.currentTarget)

        setMemberData(memberId)
      } catch (error) { }
    }

    const handleClickBase = async (baseId, event) => {
      event.stopPropagation()
      try {
        setAnchorElBase(event.currentTarget)
        setBaseData(baseId)
      } catch (error) { }
    }

    const expandedData = (
      <>
        {!isMobile && <Grid size={4}></Grid>}
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>Описание</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{eventItem.event_full_desc}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>Старший тренер</Typography>
          <Typography>{eventItem.st_fio}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>Ответственный за безопасность</Typography>
          <Typography>{eventItem.ob_fio}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>Врач</Typography>
          <Typography>{eventItem.doctor_fio}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>Район проведения</Typography>
          {eventItem?.raion_name_list?.map((baseItem, index) => (
            <Typography key={index}>{baseItem}</Typography>
          ))}
        </Grid>
        <Grid size={isMobile ? 12 : 2}>
          <Grid container alignItems='center'>
            <Typography sx={{ fontWeight: 'bold' }}>Инструкторский сбор</Typography>
            <Tooltip
              title='Средства идут на проведение лекционных и практических занятий по различным предметам альпинисткой подготовки, проверке уровня профессиональных знаний и навыков участников, а также совершения восхождений согласно этапом подготовки. 
Включает в себя Стартовый и Организационный взносы'
            >
              <IconButton onClick={(e) => e.stopPropagation()}>
                <InfoOutlineIcon fontSize='small' color='info' />
              </IconButton>
            </Tooltip>
          </Grid>
          <Typography>{price}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 2}>
          <Grid container alignItems='center'>
            <Typography sx={{ fontWeight: 'bold' }}>Стартовый взнос</Typography>
            <Tooltip title='Средства идут на организацию соревнования, в том числе на оплату труда ответственного за безопасность, старшего тренера и судейской бригады, заполнение альпинистских книжек, составлений протоколов, изготовление медалей, грамот и других атрибутов.'>
              <IconButton onClick={(e) => e.stopPropagation()}>
                <InfoOutlineIcon fontSize='small' color='info' />
              </IconButton>
            </Tooltip>
          </Grid>
          <Typography>{price_sport}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 2}>
          <Grid container alignItems='center'>
            <Typography sx={{ fontWeight: 'bold' }}>Организационный взнос</Typography>
            <Tooltip title='Взымается с болельщиков, сочувствующих и просто отдыхающих пользующихся услугами организации текущего мероприятия, таких как бронирование жилья, трансфера к месту проведения мероприятия, предоставление информации об инфраструктуре района.'>
              <IconButton onClick={(e) => e.stopPropagation()}>
                <InfoOutlineIcon fontSize='small' color='info' />
              </IconButton>
            </Tooltip>
          </Grid>
          <Typography>{price_tourist}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>Отделения</Typography>
          {eventItem.depart_types_list?.map((departItem, index) => {
            const start = eventItem.depart_start_dates_list[index]
              ? format(parseISO(eventItem.depart_start_dates_list[index]), 'dd.MM.yyyy')
              : ''
            const finish = eventItem.depart_finish_dates_list[index]
              ? format(parseISO(eventItem.depart_finish_dates_list[index]), 'dd.MM.yyyy')
              : ''
            const instructorType = ['СО', 'НП', 'УТ'].includes(departItem) ? 'Инструктор' : 'Тренер'
            return (
              <div key={index}>
                <Typography component='span'>
                  {`${departItem} (${start} - ${finish}). ${instructorType} - `}
                </Typography>
                <Typography
                  sx={dashedTextStyle}
                  onClick={(e) => handleClickMember(eventItem.depart_instructors_id_list[index], e)}
                  component='span'
                >
                  {eventItem.depart_instructors_fio_list[index]}
                </Typography>
              </div>
            )
          })}
        </Grid>
        <Grid size={12}>
          <Typography sx={{ fontWeight: 'bold' }}>Проживание</Typography>
          {eventItem?.base_names_list?.map((baseItem, index) => (
            <Typography
              key={index}
              sx={dashedTextStyle}
              onClick={(e) => handleClickBase(eventItem?.base_id_list[index], e)}
            >
              {baseItem}
            </Typography>
          ))}
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
      </>
    )

    return (
      <MobileTableItem
        key={eventItem.id}
        id={eventItem.id}
        expandedData={expandedData}
        expandedItemId={expandedItemId}
        setExpandedItemId={setExpandedItemId}
      >
        <Typography variant='h5'>{eventItem.event_name}</Typography>
        <Typography>
          {eventStart} - {eventFinish}
        </Typography>
        <Typography>{eventItem.event_desc}</Typography>
      </MobileTableItem>
    )
  }
  if (!data) return null
  return (
    <Grid>
      <Grid sx={{ textAlign: 'center', m: 1 }}>
        <Typography variant='h4'>Предстоящие мероприятия</Typography>
      </Grid>

      {data?.map(renderEventItem)}
    </Grid>
  )
}
