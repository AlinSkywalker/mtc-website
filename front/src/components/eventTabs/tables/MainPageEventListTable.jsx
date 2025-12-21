import React, { useState } from 'react'
import { useFetchMainPageEventList } from '../../../queries/event'
import { Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { format, parseISO } from 'date-fns'
import { MobileTableItem } from '../../../components/MobileTableItem'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { getFormattedNumber } from '../../../utils/numbers'

export const MainPageEventListTable = () => {
  const { isLoading, data } = useFetchMainPageEventList()
  const isMobile = useIsMobile()
  const navigate = useNavigate()

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

    const expandedData = (
      <>
        {/* <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>Описание</Typography>
          <Typography>{eventItem.event_desc}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 2}>
          <Typography sx={{ fontWeight: 'bold' }}>Дата начала</Typography>
          <Typography>{eventStart}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 2}>
          <Typography sx={{ fontWeight: 'bold' }}>Дата окончания</Typography>
          <Typography>{eventFinish}</Typography>
        </Grid> */}
        {!isMobile && <Grid size={4}></Grid>}
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>СТ</Typography>
          <Typography>{eventItem.st_fio}</Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 4}>
          <Typography sx={{ fontWeight: 'bold' }}>ОБ</Typography>
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
          <Typography sx={{ fontWeight: 'bold' }}>Отделения</Typography>
          {eventItem.depart_types_list?.map((departItem, index) => {
            const start = eventItem.depart_start_dates_list[index]
              ? format(parseISO(eventItem.depart_start_dates_list[index]), 'dd.MM.yyyy')
              : ''
            const finish = eventItem.depart_finish_dates_list[index]
              ? format(parseISO(eventItem.depart_finish_dates_list[index]), 'dd.MM.yyyy')
              : ''
            return (
              <Typography key={index}>
                {`${departItem} (${start} - ${finish}). Инструктор - ${eventItem.depart_instructors_fio_list[index]}`}
              </Typography>
            )
          })}
        </Grid>
        <Grid size={12}>
          <Typography sx={{ fontWeight: 'bold' }}>Проживание</Typography>
          {eventItem?.base_names_list?.map((baseItem, index) => (
            <Typography key={index}>{baseItem}</Typography>
          ))}
        </Grid>
      </>
    )

    return (
      <MobileTableItem
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
  return <Grid>{data?.map(renderEventItem)}</Grid>
}
