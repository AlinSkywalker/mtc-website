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

export const useGetEventTabs = (eventData) => {
  const isMobile = useIsMobile()

  const eventTabs = [
    {
      name: 'members',
      path: `/`,
      label: 'Участники',
      component: isMobile ? (
        <MobileEventMembersTab eventId={eventData?.id} />
      ) : (
        <EventMembersTab eventId={eventData?.id} />
      ),
    },
    {
      name: 'department',
      path: `/department/`,
      label: 'Отделения',
      component: <EventDepartmentTab event={eventData} />,
    },
    {
      name: 'contractor',
      path: '/contractor',
      label: 'Контрагенты',
      component: <EventContractorTab />,
    },
    {
      name: 'base',
      path: '/base/',
      label: 'Проживание',
      component: <EventBaseTab />,
    },
    {
      name: 'managementStaff',
      path: `/management_staff`,
      label: 'Руководящий состав',
      component: <EventManagementStuffTab />,
    },
    {
      name: 'files',
      path: '/files',
      label: 'Файлы',
      component: <EventFilesTab />,
    },
    {
      name: 'statistics',
      path: `/statistics`,
      label: 'Статистика',
      component: <EventStatisticsTab />,
    },
    {
      name: 'protocol',
      path: `/protocol`,
      label: 'Протокол',
      component: <EventProtocolTab eventName={eventData?.event_name} />,
    },
    {
      name: 'instructionLog',
      path: `/instruction_log`,
      label: 'Книга распоряжений',
      component: <EventInstructionLogTab />,
    },
  ]
  const roEventTabs = [
    {
      name: 'members',
      path: `/`,
      label: 'Участники',
      component: isMobile ? (
        <MobileEventMembersTab eventId={eventData?.id} />
      ) : (
        <EventMembersTab eventId={eventData?.id} />
      ),
    },
    {
      name: 'department',
      path: `/department/`,
      label: 'Отделения',
      component: <EventDepartmentTab event={eventData} />,
    },
    {
      name: 'protocol',
      path: `/protocol`,
      label: 'Протокол',
      component: <EventProtocolTab eventName={eventData?.event_name} />,
    },
    {
      name: 'files',
      path: '/files',
      label: 'Файлы',
      component: <EventFilesTab />,
    },
    // {
    //   name: 'district',
    //   path: `/district`,
    //   label: 'Район',
    //   component: <EventDistrictInfoTab />,
    // },
  ]

  return { eventTabs, roEventTabs }
}
