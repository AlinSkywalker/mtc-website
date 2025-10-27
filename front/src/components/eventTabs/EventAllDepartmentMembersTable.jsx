import React, { Fragment, useState } from 'react'
import {
  useFetchEventAllDepartmentMembersList,
  useFetchEventDepartmentList,
} from '../../queries/eventDepartment'
import Grid from '@mui/material/Grid'
import { getDatesInRange } from '../../utils/getDatesInRange'
import './EventAllDepartmentPlansTableStyle.css'
import IconButton from '@mui/material/IconButton'
import ScheduleIcon from '@mui/icons-material/Schedule'
import Tooltip from '@mui/material/Tooltip'
import { formatISO } from 'date-fns'
import { Typography } from '@mui/material'

export const EventAllDepartmentMembersTable = ({ eventId, eventStart, eventFinish }) => {
  const { isLoading, data } = useFetchEventAllDepartmentMembersList(eventId)
  const { data: departmentData } = useFetchEventDepartmentList(eventId)
  const dates = getDatesInRange(new Date(eventStart), new Date(eventFinish))
  const isPastEvent = new Date(eventFinish) < new Date()
  const [isShowPast, setIsShowPast] = useState(isPastEvent)
  const handleShowPast = () => {
    setIsShowPast((prev) => !prev)
  }
  const renderCell = (department, date) => {
    const depMembers = data[date]?.[department.id] || []

    return (
      <Grid key={department.id} className={'depPlanCell depPlanCell-inner depMembersCell'}>
        <Grid sx={{ textAlign: 'center' }}>
          {depMembers.map((item, index) => (
            <Fragment key={index}>
              <Typography variant='caption' className='depMember'>{item}</Typography>
            </Fragment>
          ))}
        </Grid>
      </Grid>
    )
  }
  if (!data || !departmentData) return
  return (
    <Grid container sx={{ width: '100%', overflow: 'scroll', height: 'calc(100vh - 150px)' }}>
      <Grid>
        <Grid
          sx={{ width: '100%', position: 'sticky', top: 0 }}
          container
          flexDirection={'row'}
          className='depPlanRow'
          flexWrap='nowrap'
        >
          <Grid className={'depPlanCell depPlanDateCell depPlanTitleCell'}>
            <Tooltip title='Показать прошедшие даты'>
              <IconButton aria-label='delete' color='primary' onClick={handleShowPast}>
                <ScheduleIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          {departmentData.map((department) => {
            return (
              <Grid
                key={department.id}
                className={'depPlanCell depPlanTitleCell depMembersCell'}
              >{`${department.depart_tip} ${department.depart_name}`}</Grid>
            )
          })}
        </Grid>
        {dates.map((item) => {
          const parts = item.date.match(/(\d+)/g)
          const itemDate = new Date(parts[2], parts[1] - 1, parts[0])
          const currentDate = new Date()
          currentDate.setHours(0, 0, 0, 0)
          const isPastDate = currentDate > itemDate
          let rowClassName = isPastDate ? 'depPlanRow depPlanRowPast' : 'depPlanRow'
          if (!isShowPast && isPastDate) return
          return (
            <Grid
              key={item.id}
              sx={{ width: '100%' }}
              container
              flexDirection={'row'}
              className={rowClassName}
              flexWrap='nowrap'
            >
              <Grid className={'depPlanCell depPlanDateCell depMembersCell'}>
                {item.date.substring(0, 5)}
              </Grid>
              {departmentData.map((department) =>
                renderCell(department, formatISO(itemDate, { representation: 'date' })),
              )}
            </Grid>
          )
        })}
      </Grid>
    </Grid>
  )
}
