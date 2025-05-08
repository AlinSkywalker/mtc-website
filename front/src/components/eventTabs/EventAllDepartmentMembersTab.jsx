import React, { useState } from 'react'

import Grid from '@mui/material/Grid'
import { EventAllDepartmentMembersTable } from './EventAllDepartmentMembersTable'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { EventMemberDepartment } from './EventMemberDepartment'

export const EventAllDepartmentMembersTab = ({ eventId, eventStart, eventFinish }) => {
  const [viewMode, setViewMode] = useState('edit')
  const handleSelectViewMode = (event, newValue) => {
    setViewMode(newValue)
  }

  return (
    <Grid container spacing={1}>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleSelectViewMode}
        aria-label='text alignment'
      >
        <ToggleButton value={'edit'} aria-label='left aligned' key={0}>
          {`Редактирование`}
        </ToggleButton>
        <ToggleButton value={'view'} aria-label='left aligned' key={0}>
          {`Просмотр`}
        </ToggleButton>
      </ToggleButtonGroup>
      <Grid size={12}>
        {viewMode === 'view' && (
          <EventAllDepartmentMembersTable
            eventId={eventId}
            eventStart={eventStart}
            eventFinish={eventFinish}
          />
        )}
        {viewMode === 'edit' && <EventMemberDepartment eventId={eventId} />}
      </Grid>
    </Grid>
  )
}
