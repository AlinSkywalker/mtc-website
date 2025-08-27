import React, { useState } from 'react'

import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'

import { EventDepartmentTable } from './EventDepartmentTable'
import { EventDepartmentPlansTab } from './EventDepartmentPlansTab'
import { EventAllDepartmentMembersTable } from './EventAllDepartmentMembersTable'
import { EventMemberDepartment } from './EventMemberDepartment'
import { useLocation, Route, Routes, Link } from 'react-router-dom'

export const EventDepartmentTab = ({ event, readOnly }) => {
  const location = useLocation()
  if (!event) return
  const basePath = readOnly
    ? `/event/${event.id}/department`
    : `/admin/event/${event.id}/department`
  const tabs = [
    {
      name: 'list',
      path: `/`,
      label: 'Список',
      component: (
        <EventDepartmentTable
          eventId={event.id}
          eventStart={event.event_start}
          eventFinish={event.event_finish}
          readOnly={readOnly}
        />
      ),
    },
    {
      name: 'depMembers',
      path: `/depMembers`,
      label: 'Состав',
      component: <EventMemberDepartment eventId={event.id} />,
    },
    {
      name: 'depMembersView',
      path: `/depMembersView`,
      label: 'Просмотр состава',
      component: (
        <EventAllDepartmentMembersTable
          eventId={event.id}
          eventStart={event.event_start}
          eventFinish={event.event_finish}
        />
      ),
    },
    {
      name: 'plans',
      path: `/plans`,
      label: 'Планы',
      component: (
        <EventDepartmentPlansTab
          eventId={event.id}
          eventDistrict={event.raion_id_list}
          eventStart={event.event_start}
          eventFinish={event.event_finish}
          readOnly={readOnly}
        />
      ),
    },
  ]
  if (readOnly) tabs.splice(1, 1)
  const currentTab = tabs.findIndex((tab) => `${basePath}${tab.path}` === location.pathname)
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab !== -1 ? currentTab : false}
          variant='scrollable'
          scrollButtons='auto'
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} component={Link} to={`${basePath}${tab.path}`} />
          ))}
        </Tabs>
      </Box>
      <Routes>
        {tabs.map((tab, index) => (
          <Route key={index} path={tab.path} element={tab.component} />
        ))}
      </Routes>
    </>
  )
}
