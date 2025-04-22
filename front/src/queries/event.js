import apiClient from '../api/api'
import { useQuery } from '@tanstack/react-query'
import parseISO from 'date-fns/parseISO'

export function useFetchEventList() {
  return useQuery({
    queryKey: ['eventList'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/eventList`)
      return data
    },
  })
}

export function useFetchEvent(id) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/eventList/${id}`)
      return {
        ...data,
        event_start: parseISO(data.event_start),
        event_finish: parseISO(data.event_finish),
      }
    },
  })
}

export function useFetchEventBaseList(eventId) {
  let fetchUrl = `/api/eventList/${eventId}/eventBase`
  return useQuery({
    queryKey: ['event', eventId, 'eventBase'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchBaseForEvent({ eventId }) {
  let fetchUrl = `/api/eventList/${eventId}/baseForEvent`
  return useQuery({
    queryKey: ['event', eventId, 'baseForEvent'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchEventSmenaList(eventId) {
  return useQuery({
    queryKey: ['event', eventId, 'smena'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/eventList/${eventId}/smena`)
      return data
    },
  })
}

export function useFetchEventDepartmentList(eventId) {
  return useQuery({
    queryKey: ['event', eventId, 'department'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/eventList/${eventId}/department`)
      return data
    },
  })
}

export function useFetchEventDepartmentWithPlanAtDateList(eventId, date) {
  return useQuery({
    queryKey: ['event', eventId, 'departmentsWithPlan', date],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/api/eventList/${eventId}/departments/departmentWithPlan/${date}`,
      )
      return data
    },
  })
}

export function useFetchEventDepartmentById(eventId, departmentId) {
  return useQuery({
    queryKey: ['event', eventId, 'department', departmentId],
    queryFn: async () => {
      if (!eventId || !departmentId) return []
      const { data } = await apiClient.get(`/api/eventList/${eventId}/department/${departmentId}`)
      return data
    },
  })
}

export function useFetchEventDepartmentMemberList({ eventId, departmentId, selectedDate }) {
  let fetchUrl = `/api/eventList/${eventId}/department/${departmentId}/member`
  if (selectedDate) {
    fetchUrl += `?selectedDate=${selectedDate}`
  }
  return useQuery({
    queryKey: ['event', eventId, 'department', departmentId, 'member', selectedDate],
    queryFn: async () => {
      if (!eventId || !departmentId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchEventMemberList(eventId) {
  return useQuery({
    queryKey: ['event', eventId, 'member'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/eventList/${eventId}/member`)
      return data
    },
  })
}

export function useFetchEventMemberListForDepartment({ eventId, departmentId, selectedDate }) {
  let fetchUrl = `/api/eventList/${eventId}/memberForDepartment/${departmentId}`
  if (selectedDate) {
    fetchUrl += `?selectedDate=${selectedDate}`
  }
  return useQuery({
    queryKey: ['event', eventId, 'memberForDepartment', departmentId],
    queryFn: async () => {
      if (!eventId || !departmentId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchEventBaseHouseRoomList(eventId) {
  let fetchUrl = `/api/eventList/${eventId}/baseHouseRoom`
  return useQuery({
    queryKey: ['event', eventId, 'baseHouseRoom'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchBaseHouseForEvent({ eventId }) {
  let fetchUrl = `/api/eventList/${eventId}/baseHouseForEvent`
  return useQuery({
    queryKey: ['event', eventId, 'baseHouseForEvent'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchBaseHouseRoomForEvent({ eventId, houseId }) {
  let fetchUrl = `/api/eventList/${eventId}/baseHouseRoomForEvent`
  if (houseId) fetchUrl += `?houseId=${houseId}`
  return useQuery({
    queryKey: ['event', eventId, 'baseHouseRoomForEvent', houseId],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchEventBaseHouseRoomMemberList(eventId, selectedBaseRoom) {
  let fetchUrl = `/api/eventList/${eventId}/baseHouseRoom/${selectedBaseRoom}/member`
  return useQuery({
    queryKey: ['event', eventId, 'baseHouseRoomMember', selectedBaseRoom],
    queryFn: async () => {
      if (!eventId || !selectedBaseRoom) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchMemberForEventRoom({ eventId, selectedBaseRoom }) {
  let fetchUrl = `/api/eventList/${eventId}/memberForEventRoom/${selectedBaseRoom}`
  return useQuery({
    queryKey: ['event', eventId, 'memberForEventRoom', selectedBaseRoom],
    queryFn: async () => {
      if (!eventId || !selectedBaseRoom) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}
export function useFetchEventFileList(eventId) {
  let fetchUrl = `/api/eventList/${eventId}/files`
  return useQuery({
    queryKey: ['event', eventId, 'files'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchEventContractorList(eventId) {
  let fetchUrl = `/api/eventList/${eventId}/contractor`
  return useQuery({
    queryKey: ['event', eventId, 'contractor'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchContractorForEvent({ eventId }) {
  let fetchUrl = `/api/eventList/${eventId}/contractorForEvent`
  return useQuery({
    queryKey: ['event', eventId, 'contractorForEvent'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchEventDepartmentPlanList(eventId, departmentId) {
  let fetchUrl = `/api/eventList/${eventId}/department/${departmentId}/plan`
  return useQuery({
    queryKey: ['event', eventId, 'department', departmentId, 'plan'],
    queryFn: async () => {
      if (!eventId || !departmentId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}
export function useFetchEventAllDepartmentPlanList(eventId) {
  let fetchUrl = `/api/eventList/${eventId}/departments/allDepartmentPlan`
  return useQuery({
    queryKey: ['event', eventId, 'department', 'allDepartmentPlan'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchEventAllDepartmentMembersList(eventId) {
  let fetchUrl = `/api/eventList/${eventId}/departments/allDepartmentMembers`
  return useQuery({
    queryKey: ['event', eventId, 'department', 'allDepartmentMembers'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchEventAllDepartmentPlanJournalList(eventId, date) {
  let fetchUrl = `/api/eventList/${eventId}/departments/allDepartmentPlanJournal/${date}`
  return useQuery({
    queryKey: ['event', eventId, 'department', 'allDepartmentPlanJournal', date],
    queryFn: async () => {
      if (!eventId || !date) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchEventStatistics(eventId) {
  let fetchUrl = `/api/eventList/${eventId}/statistics`
  return useQuery({
    queryKey: ['event', eventId, 'statistics'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}
export function useFetchEventProtocol(eventId) {
  let fetchUrl = `/api/eventList/${eventId}/protocol`
  return useQuery({
    queryKey: ['event', eventId, 'protocol'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}
