import React, { useState } from 'react'

import Grid from '@mui/material/Grid2'
import { useFetchEventDepartmentList } from '../../queries/event'
import { EventDepartmentPlansTable } from './EventDepartmentPlansTable'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { format, parseISO } from 'date-fns'

export const EventDepartmentPlansTab = ({ eventId, eventDistrict }) => {
  const [selectedDepartment, setSelectedDepartment] = useState()

  const { isLoading, data } = useFetchEventDepartmentList(eventId)

  const handleSelectDepartment = (event, newValue) => {
    setSelectedDepartment(newValue)
  }
  if (!data || data?.lenght == 0) return
  return (
    <Grid container spacing={1}>
      <ToggleButtonGroup
        value={selectedDepartment}
        exclusive
        onChange={handleSelectDepartment}
        aria-label='text alignment'
      >
        {data.map((item) => (
          <ToggleButton value={item.id} aria-label='left aligned' key={item.id}>
            {`${item.depart_tip} ${item.depart_name} (${format(parseISO(item.depart_dates), 'dd.MM.yyyy')} - ${format(parseISO(item.depart_datef), 'dd.MM.yyyy')})`}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Grid item size={12}>
        <EventDepartmentPlansTable
          eventId={eventId}
          departmentId={selectedDepartment}
          eventDistrict={eventDistrict}
        />
      </Grid>
    </Grid>
  )
}
