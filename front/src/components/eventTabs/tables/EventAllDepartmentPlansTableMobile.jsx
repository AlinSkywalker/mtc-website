import React, { useState, useMemo } from 'react'
import {
  useFetchEventAllDepartmentPlanList,
  useFetchEventDepartmentList,
} from '../../../queries/eventDepartment'
import { formatISO, format } from 'date-fns'
import { EventDepartmentPlanDialog } from '../dialogs/EventDepartmentPlanDialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import ScheduleIcon from '@mui/icons-material/Schedule'
import Tooltip from '@mui/material/Tooltip'
import './EventAllDepartmentPlansTableMobile.css'
import { Typography } from '@mui/material'

export const EventAllDepartmentPlansTableMobile = ({
  eventId,
  eventStart,
  eventFinish,
  eventDistrict,
}) => {
  const { isLoading, data } = useFetchEventAllDepartmentPlanList(eventId)
  const { data: departmentData } = useFetchEventDepartmentList(eventId)
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

  // Build a map: "YYYY-MM-DD" -> { departmentId -> [plans] }
  const plansByDateAndDept = useMemo(() => {
    const map = {}
    if (!data) return map
    for (const plan of data) {
      const dateKey = plan.start
      if (!map[dateKey]) map[dateKey] = {}
      if (!map[dateKey][plan.department]) map[dateKey][plan.department] = []
      map[dateKey][plan.department].push(plan)
    }
    return map
  }, [data])

  // Generate array of dates in range
  const datesInRange = useMemo(() => {
    const start = new Date(eventStart)
    const end = new Date(eventFinish)
    const result = []
    const current = new Date(start)
    while (current <= end) {
      result.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return result
  }, [eventStart, eventFinish])

  const renderPlanText = (plan) => {
    const typeBold = <strong>{plan.type}</strong>

    if (plan?.type === 'Занятие' || plan?.type === 'Отдых' || plan?.type === 'Подход/отход') {
      return (
        <>
          {typeBold}. {plan.laba_name}
        </>
      )
    } else if (plan?.type === 'Восхождение') {
      return (
        <>
          {typeBold}. {plan.rout_name} ({plan.rout_comp}) - {plan.mount_name}
        </>
      )
    }
    return plan?.type ? typeBold : ''
  }

  if (!data || !departmentData) return null

  return (
    <div className='mobile-plans-container'>
      {!isPastEvent && (
        <div className='mobile-toolbar'>
          <Tooltip title='Показать прошедшие даты'>
            <Button
              color='primary'
              onClick={handleShowPast}
              startIcon={<ScheduleIcon />}
              variant='contained'
            >
              {isShowPast ? 'Скрыть прошедшие даты' : 'Показать прошедшие даты'}
            </Button>
          </Tooltip>
        </div>
      )}
      {datesInRange
        .filter((date) => {
          if (isShowPast) return true
          const currentDate = new Date()
          currentDate.setHours(0, 0, 0, 0)
          return date >= currentDate
        })
        .map((date) => {
          const dateStr = formatISO(date, { representation: 'date' })
          const dateFormatted = format(date, 'dd.MM.yyyy')
          const plansForDate = plansByDateAndDept[dateStr] || {}

          return (
            <div key={dateStr} className='mobile-date-section'>
              <Typography
                variant='h6'
                color='primary'
                fontWeight={600}
                className='mobile-date-header'
              >
                {dateFormatted}
              </Typography>
              {departmentData.map((department) => {
                const plans = plansForDate[department.id] || []

                return (
                  <div key={department.id} className='mobile-department-card'>
                    <div className='mobile-dept-name'>
                      {department.depart_tip} {department.depart_name}
                    </div>

                    {plans.length > 0 ? (
                      <div className='mobile-dept-plans'>
                        {plans.map((plan, idx) => (
                          <div key={idx} className='mobile-dept-plan-item'>
                            <span className='mobile-dept-plan-text'>{renderPlanText(plan)}</span>
                            <IconButton
                              size='small'
                              onClick={handleOpenDialog(department.id, dateStr, plan)}
                              className='mobile-edit-btn'
                            >
                              <EditIcon fontSize='small' />
                            </IconButton>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Button
                        variant='outlined'
                        size='small'
                        onClick={handleOpenDialog(department.id, dateStr)}
                        className='mobile-add-btn'
                      >
                        + Добавить
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
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
    </div>
  )
}
