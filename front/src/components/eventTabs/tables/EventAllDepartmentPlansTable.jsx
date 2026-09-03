import React, { useState } from 'react'
import {
  useFetchEventAllDepartmentPlanList,
  useFetchEventDepartmentList,
} from '../../../queries/eventDepartment'
import Grid from '@mui/material/Grid'
import { getDatesInRange } from '../../../utils/getDatesInRange'
import './EventAllDepartmentPlansTableStyle.css'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import ScheduleIcon from '@mui/icons-material/Schedule'
import Tooltip from '@mui/material/Tooltip'
import { formatISO } from 'date-fns'
import { EventDepartmentPlanDialog } from '../dialogs/EventDepartmentPlanDialog'

export const EventAllDepartmentPlansTable = ({
  eventId,
  eventStart,
  eventFinish,
  eventDistrict,
}) => {
  const { isLoading, data } = useFetchEventAllDepartmentPlanList(eventId)
  const { data: departmentData } = useFetchEventDepartmentList(eventId)
  const dates = getDatesInRange(new Date(eventStart), new Date(eventFinish))
  const isPastEvent = new Date(eventFinish) < new Date()
  const [isShowPast, setIsShowPast] = useState(isPastEvent)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const handleShowPast = () => {
    setIsShowPast((prev) => !prev)
  }

  const handleOpenDialog =
    (departmentId, date, plan = null) =>
      () => {
        setSelectedDepartmentId(departmentId)
        setSelectedDate(date)
        setSelectedPlan(plan)
        setDialogOpen(true)
      }

  const renderCell = (department, date) => {
    const plans = data.filter((plan) => plan.department === department.id && plan.start === date)

    const renderPlanPlace = (plan) => {
      if (plan?.type === 'Занятие' || plan?.type === 'Отдых' || plan?.type === 'Подход/отход') {
        return plan.laba_name
      } else if (plan?.type === 'Восхождение') {
        return `${plan.rout_name}(${plan.rout_comp}) - ${plan.mount_name}`
      }
      return ''
    }

    return (
      <Grid key={department.id} className={'depPlanCell depPlanCell-inner'}>
        {plans.length > 0 ? (
          plans.map((plan, index) => (
            <Grid
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: index < plans.length - 1 ? 0.5 : 0,
              }}
            >
              <Grid
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  flex: 1,
                }}
              >
                {plan.type}
                <Grid sx={{ textAlign: 'center', fontWeight: 'normal' }}>
                  {renderPlanPlace(plan)}
                </Grid>
              </Grid>
              <IconButton
                size='small'
                onClick={handleOpenDialog(department.id, date, plan)}
                className='editDepPlanButton'
              >
                <EditIcon fontSize='small' />
              </IconButton>
            </Grid>
          ))
        ) : (
          <Button
            variant='contained'
            size='small'
            onClick={handleOpenDialog(department.id, date)}
            className='addDepPlanButton'
          >
            Добавить
          </Button>
        )}
      </Grid>
    )
  }

  if (!data || !departmentData) return

  return (
    <Grid container sx={{ width: '100%', overflow: 'scroll', height: 'calc(100vh - 150px)' }}>
      <Grid
        sx={{ width: '100%', position: 'sticky', top: 0, zIndex: 1 }}
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
              className={'depPlanCell depPlanTitleCell'}
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
            <Grid className={'depPlanCell depPlanDateCell'}>{item.date.substring(0, 5)}</Grid>
            {departmentData.map((department) =>
              renderCell(department, formatISO(itemDate, { representation: 'date' })),
            )}
          </Grid>
        )
      })}
      <EventDepartmentPlanDialog
        eventId={eventId}
        departmentId={selectedDepartmentId}
        date={selectedDate}
        plan={selectedPlan}
        fixedDistrict={eventDistrict}
        open={dialogOpen}
        setOpen={setDialogOpen}
      />
    </Grid>
  )
}
