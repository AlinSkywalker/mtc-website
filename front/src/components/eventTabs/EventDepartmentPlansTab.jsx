import React, { useContext, useMemo, useState } from 'react'

import Grid from '@mui/material/Grid'
import { useFetchEventDepartmentList } from '../../queries/eventDepartment'
import { EventDepartmentPlansTable } from './tables/EventDepartmentPlansTable'
import { EventAllDepartmentPlansTable } from './tables/EventAllDepartmentPlansTable'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { format, parseISO } from 'date-fns'
import { useIsAdmin } from '../../hooks/useIsAdmin'
import { useGetUserEventPermisson } from '../../hooks/useGetUserPermisson'
import { AuthContext } from '../AuthContext'

export const EventDepartmentPlansTab = ({ eventId, eventDistrict, eventStart, eventFinish }) => {
  const isAdmin = useIsAdmin()
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const { isLoading, data } = useFetchEventDepartmentList(eventId)
  const { isCurrentMemberST } = useGetUserEventPermisson(eventId)
  const { userInfo: { memberId: currentUserId } } = useContext(AuthContext)

  const selectedDepartmentStartDate = useMemo(() => {
    return data?.find((item) => item.id === selectedDepartment)?.depart_dates
  }, [selectedDepartment, data])
  const selectedDepartmentEndDate = useMemo(() => {
    return data?.find((item) => item.id === selectedDepartment)?.depart_datef
  }, [selectedDepartment, data])
  const handleSelectDepartment = (event, newValue) => {
    setSelectedDepartment(newValue)
  }
  if (!data || data?.lenght == 0) return
  const visibleDepartments = data.filter(
    (item) => isCurrentMemberST || item.depart_inst === currentUserId || isAdmin,
  )

  const isToggleDisplayed = visibleDepartments.length !== 0

  return (
    <Grid container spacing={1}>
      {isToggleDisplayed && (
        <ToggleButtonGroup
          value={selectedDepartment}
          exclusive
          onChange={handleSelectDepartment}
          aria-label='text alignment'
        >
          <ToggleButton value={'all'} aria-label='left aligned' key={0}>
            {`ВСЕ ОТДЕЛЕНИЯ`}
          </ToggleButton>
          {visibleDepartments.map((item) => (
            <ToggleButton value={item.id} aria-label='left aligned' key={item.id}>
              {`${item.depart_tip} ${item.depart_name} (${format(parseISO(item.depart_dates), 'dd.MM')} - ${format(parseISO(item.depart_datef), 'dd.MM')})`}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
      {selectedDepartment && selectedDepartment !== 'all' && (
        <Grid size={12}>
          <EventDepartmentPlansTable
            eventId={eventId}
            departmentId={selectedDepartment}
            eventDistrict={eventDistrict}
            departmentStartDate={selectedDepartmentStartDate}
            departmentEndDate={selectedDepartmentEndDate}
          />
        </Grid>
      )}
      {selectedDepartment && selectedDepartment === 'all' && (
        <Grid size={12}>
          <EventAllDepartmentPlansTable
            eventId={eventId}
            eventStart={eventStart}
            eventFinish={eventFinish}
          />
        </Grid>
      )}
    </Grid>
  )
}
