import React from 'react'
import { useFetchEventAllDepartmentList, useFetchEventDepartmentList } from '../../queries/event'
import Grid from '@mui/material/Grid2'
import { getDatesInRange } from '../../utils/getDatesInRange'
import './EventAllDepartmentPlansTableStyle.css'

export const EventAllDepartmentPlansTable = ({ eventId, eventStart, eventFinish }) => {
  const { isLoading, data } = useFetchEventAllDepartmentList(eventId)
  const { data: departmentData } = useFetchEventDepartmentList(eventId)
  const dates = getDatesInRange(new Date(eventStart), new Date(eventFinish))
  if (!data || !departmentData) return

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
        {/* {depPlan?.type === 'Восхождение' && <Grid item>{depPlan.mount_name}</Grid>} */}
      </Grid>
    )
  }
  return (
    <Grid container sx={{ width: '100%', overflowX: 'scroll' }}>
      <Grid item sx={{ width: '100%' }} container flexDirection={'row'} className='depPlanRow'>
        <Grid className={'depPlanCell depPlanDateCell depPlanTitleCell'}></Grid>
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
        const isPastDate = new Date() < new Date(item)
        let rowClassName = isPastDate ? 'depPlanRow depPlanRowPast' : 'depPlanRow'

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
