import React, { useState, useMemo, useCallback } from 'react'
import {
  useFetchEventAllDepartmentMembersList,
  useFetchEventDepartmentList,
} from '../../../queries/eventDepartment'
import { formatISO, format } from 'date-fns'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Typography } from '@mui/material'
import './EventAllDepartmentMembersTableMobile.css'

export const EventAllDepartmentMembersTableMobile = ({ eventId, eventStart, eventFinish }) => {
  const { isLoading, data } = useFetchEventAllDepartmentMembersList(eventId)
  const { data: departmentData } = useFetchEventDepartmentList(eventId)
  const isPastEvent = new Date(eventFinish) < new Date()
  const [isShowPast, setIsShowPast] = useState(isPastEvent)
  const [collapsedDates, setCollapsedDates] = useState(new Set())

  const handleShowPast = () => {
    setIsShowPast((prev) => !prev)
  }

  const toggleDate = useCallback((dateStr) => {
    setCollapsedDates((prev) => {
      const next = new Set(prev)
      if (next.has(dateStr)) {
        next.delete(dateStr)
      } else {
        next.add(dateStr)
      }
      return next
    })
  }, [])

  // Build a map: "YYYY-MM-DD" -> { departmentId -> [members] }
  const membersByDateAndDept = useMemo(() => {
    const map = {}
    if (!data) return map
    for (const dateKey of Object.keys(data)) {
      map[dateKey] = {}
      const depts = data[dateKey]
      for (const deptId of Object.keys(depts)) {
        map[dateKey][deptId] = depts[deptId] || []
      }
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

  if (!data || !departmentData) return null

  return (
    <div className='mobile-members-container'>
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
          const membersForDate = membersByDateAndDept[dateStr] || {}

          return (
            <div key={dateStr} className='mobile-date-section'>
              <div className='mobile-date-header-row'>
                <Typography
                  variant='h6'
                  color='primary'
                  fontWeight={600}
                  className='mobile-date-header'
                >
                  {dateFormatted}
                </Typography>
                <IconButton
                  size='small'
                  onClick={() => toggleDate(dateStr)}
                  className='mobile-date-toggle'
                >
                  <ExpandMoreIcon
                    className={collapsedDates.has(dateStr) ? '' : 'expanded'}
                  />
                </IconButton>
              </div>
              {!collapsedDates.has(dateStr) && (
                <>
                  {departmentData.map((department) => {
                    const members = membersForDate[department.id] || []

                    return (
                      <div key={department.id} className='mobile-department-card'>
                        <div className='mobile-dept-name'>
                          {department.depart_tip} {department.depart_name}
                        </div>

                        {members.length > 0 ? (
                          <div className='mobile-dept-members'>
                            {members.map((member, idx) => (
                              <div key={idx} className='mobile-dept-member-item'>
                                {member}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className='mobile-dept-empty'>Нет участников</div>
                        )}
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          )
        })}
    </div>
  )
}
