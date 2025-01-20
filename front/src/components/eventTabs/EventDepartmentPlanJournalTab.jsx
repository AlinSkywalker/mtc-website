import React, { useState } from 'react'
import {
  useFetchEventAllDepartmentPlanList,
  useFetchEventDepartmentList,
} from '../../queries/event'
import Grid from '@mui/material/Grid2'
import { getDatesInRange } from '../../utils/getDatesInRange'
import './EventAllDepartmentPlansTableStyle.css'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

export const EventDepartmentPlanJournalTab = ({ eventId, eventStart, eventFinish }) => {
  const { isLoading, data } = useFetchEventAllDepartmentPlanList(eventId)
  const { data: departmentData } = useFetchEventDepartmentList(eventId)
  const dates = getDatesInRange(new Date(eventStart), new Date(eventFinish))
  const [isShowPast, setIsShowPast] = useState(false)
  const handleShowPast = () => {
    setIsShowPast((prev) => !prev)
  }
  const renderCell = (department, date) => {
    const depPlan = data.find(
      (plan) => plan.department === department.id && plan.start === date.date,
    )
    let planPlace = ''
    if (depPlan?.type === 'Занятие') {
      planPlace = depPlan.laba_name
    } else if (depPlan?.type === 'Восхождение') {
      planPlace = `${depPlan.rout_name}(${depPlan.rout_comp}) - ${depPlan.mount_name}`
    }
    return (
      <Grid key={department.id} className={'depPlanCell depPlanCell-inner'}>
        <Grid item sx={{ fontWeight: 'bold' }}>
          {depPlan?.type}
        </Grid>
        <Grid item sx={{ textAlign: 'center' }}>
          {planPlace}
        </Grid>
      </Grid>
    )
  }
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleString('ru-RU').substring(0, 10),
  )
  if (!data || !departmentData) return
  return (
    <Grid container sx={{ width: '100%', overflowX: 'scroll' }}>
      <Grid item sx={{ width: '100%' }} container flexDirection={'row'} className='depPlanRow'>
        <Grid className={'depPlanCell depPlanDateCell depPlanTitleCell'}>
          <Select label='Пол' fullWidth onChange={setSelectedDate} value={selectedDate}>
            {dates.map((item, index) => (
              <MenuItem value={item.date} key={index}>
                {item.date.substring(0, 5)}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        {departmentData.map((department) => {
          return (
            <Grid
              key={department.id}
              className={'depPlanCell depPlanTitleCell'}
            >{`${department.depart_tip} ${department.depart_name}`}</Grid>
          )
        })}
      </Grid>
      {dates.map((item) => {
        const isPastDate = new Date() > new Date(item.date)
        let rowClassName = isPastDate ? 'depPlanRow depPlanRowPast' : 'depPlanRow'
        if (!isShowPast && isPastDate) return
        return (
          <Grid
            key={item.id}
            item
            sx={{ width: '100%' }}
            container
            flexDirection={'row'}
            className={rowClassName}
          >
            <Grid className={'depPlanCell depPlanDateCell'}>{item.date}</Grid>
            {departmentData.map((department) => renderCell(department, item))}
          </Grid>
        )
      })}
    </Grid>
  )
}
