import React, { useMemo, useState } from 'react'

import Grid from '@mui/material/Grid2'
import { useFetchEventDepartmentList } from '../../queries/event'
import { EventDepartmentPlansTable } from './EventDepartmentPlansTable'
import { EventAllDepartmentPlansTable } from './EventAllDepartmentPlansTable'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { format, parseISO } from 'date-fns'

export const EventDepartmentPlansTab = ({ eventId, eventDistrict, eventStart, eventFinish }) => {
  const [selectedDepartment, setSelectedDepartment] = useState()

  const { isLoading, data } = useFetchEventDepartmentList(eventId)

  const selectedDepartmentStartDate = useMemo(() => {
    return data?.find((item) => item.id === selectedDepartment)?.depart_dates
  }, [selectedDepartment, data])
  const handleSelectDepartment = (event, newValue) => {
    setSelectedDepartment(newValue)
  }
  if (!data || data?.lenght == 0) return
  // if (!selectedDepartment)
  return (
    <Grid container spacing={1}>
      <ToggleButtonGroup
        value={selectedDepartment}
        exclusive
        onChange={handleSelectDepartment}
        aria-label='text alignment'
      >
        <ToggleButton value={'all'} aria-label='left aligned' key={0}>
          {`ВСЕ ОТДЕЛЕНИЯ`}
        </ToggleButton>
        {data.map((item) => (
          <ToggleButton value={item.id} aria-label='left aligned' key={item.id}>
            {`${item.depart_tip} ${item.depart_name} (${format(parseISO(item.depart_dates), 'dd.MM.yyyy')} - ${format(parseISO(item.depart_datef), 'dd.MM.yyyy')})`}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {selectedDepartment && selectedDepartment !== 'all' && (
        <Grid item size={12}>
          <EventDepartmentPlansTable
            eventId={eventId}
            departmentId={selectedDepartment}
            eventDistrict={eventDistrict}
            departmentStartDate={selectedDepartmentStartDate}
          />
        </Grid>
      )}
      {selectedDepartment && selectedDepartment === 'all' && (
        <Grid item size={12}>
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
