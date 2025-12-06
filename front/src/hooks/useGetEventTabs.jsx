import { useIsMobile } from './useIsMobile'
import React from 'react'
import { EventMembersTab } from '../components/eventTabs/EventMembersTab'
import { EventDepartmentTab } from '../components/eventTabs/EventDepartmentTab'
import { EventContractorTab } from '../components/eventTabs/EventContractorTab'
import { EventBaseTab } from '../components/eventTabs/EventBaseTab'
import { EventFilesTab } from '../components/eventTabs/EventFilesTab'
import { EventStatisticsTab } from '../components/eventTabs/EventStatisticsTab'
import { EventProtocolTab } from '../components/eventTabs/EventProtocolTab'

import { EventManagementStuffTab } from '../components/eventTabs/EventManagementStuffTab'
import { EventInstructionLogTab } from '../components/eventTabs/EventInstructionLogTab'

import { EventDistrictInfoTab } from '../components/eventTabs/EventDistrictInfoTab'
import { MobileEventMembersTab } from '../components/eventTabs/MobileEventMembersTab'
import { EventDescriptionTab } from '../components/eventTabs/EventDescriptionTab'

export const useGetEventTabs = (eventData) => {
  const isMobile = useIsMobile()

  const eventTabs = [
    {
      name: 'description',
      path: `/`,
      label: 'Описание',
      component: <EventDescriptionTab eventId={eventData?.id} />,
      adminOnly: false,
    },
    {
      name: 'members',
      path: `/members`,
      label: 'Участники',
      component: isMobile ? (
        <MobileEventMembersTab eventId={eventData?.id} />
      ) : (
        <EventMembersTab eventId={eventData?.id} />
      ),
      adminOnly: false,
    },
    {
      name: 'department',
      path: `/department/`,
      label: 'Отделения',
      component: <EventDepartmentTab event={eventData} />,
      adminOnly: false,
    },
    {
      name: 'contractor',
      path: '/contractor',
      label: 'Контрагенты',
      component: <EventContractorTab />,
      adminOnly: true,
    },
    {
      name: 'base',
      path: '/base/',
      label: 'Проживание',
      component: <EventBaseTab />,
      adminOnly: true,
    },
    {
      name: 'managementStaff',
      path: `/management_staff`,
      label: 'Руководящий состав',
      component: <EventManagementStuffTab />,
      adminOnly: true,
    },
    {
      name: 'files',
      path: '/files',
      label: 'Файлы',
      component: <EventFilesTab />,
      adminOnly: false,
    },
    {
      name: 'statistics',
      path: `/statistics`,
      label: 'Статистика',
      component: <EventStatisticsTab />,
      adminOnly: true,
    },
    {
      name: 'protocol',
      path: `/protocol`,
      label: 'Протокол',
      component: <EventProtocolTab eventName={eventData?.event_name} />,
      adminOnly: false,
    },
    {
      name: 'instructionLog',
      path: `/instruction_log`,
      label: 'Книга распоряжений',
      component: <EventInstructionLogTab />,
      adminOnly: true,
    },
  ]
  const roEventTabs = eventTabs.filter((item) => !item.adminOnly)

  return { eventTabs, roEventTabs }
}
