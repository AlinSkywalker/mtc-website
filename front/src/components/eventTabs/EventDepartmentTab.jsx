import React, { useState } from 'react'

import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'

import { EventDepartmentTable } from './tables/EventDepartmentTable'
import { EventDepartmentPlansTab } from './EventDepartmentPlansTab'
import { EventAllDepartmentMembersTable } from './tables/EventAllDepartmentMembersTable'
import { EventAllDepartmentMembersTableMobile } from './tables/EventAllDepartmentMembersTableMobile'
import { EventMemberDepartment } from './components/EventMemberDepartment'
import { useLocation, Route, Routes, Link } from 'react-router-dom'
import { useIsAdmin } from '../../hooks/useIsAdmin'
import { useIsMobile } from '../../hooks/useIsMobile'
import { EventMemberDepartmentMobile } from './components/EventMemberDepartmentMobile'

export const EventDepartmentTab = ({ event }) => {
  const location = useLocation()
  const readOnly = !useIsAdmin()
  const isMobile = useIsMobile()
  if (!event) return
  const basePath = `/crm/event/${event.id}/department`

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
      component: isMobile ? (
        <EventMemberDepartmentMobile eventId={event.id} />
      ) : (
        <EventMemberDepartment eventId={event.id} />
      ),
    },
    {
      name: 'depMembersView',
      path: `/depMembersView`,
      label: 'Просмотр состава',
      component: isMobile ? (
        <EventAllDepartmentMembersTableMobile
          eventId={event.id}
          eventStart={event.event_start}
          eventFinish={event.event_finish}
        />
      ) : (
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
