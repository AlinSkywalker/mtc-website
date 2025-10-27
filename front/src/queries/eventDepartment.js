import apiClient from '../api/api'
import { useQuery } from '@tanstack/react-query'

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
      if (!eventId || !departmentId || !selectedDate) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}
export function useFetchEventMemberDepartmentList({ eventId, memberId }) {
  let fetchUrl = `/api/eventList/${eventId}/member/${memberId}/departmentByDate`
  return useQuery({
    queryKey: ['event', eventId, 'member', memberId, 'departmentByDate'],
    queryFn: async () => {
      if (!eventId || !memberId) return []
      const { data } = await apiClient.get(fetchUrl)
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

export function useFetchEventDepartmentListForMember({ eventId, memberId, selectedDate = '' }) {
  let fetchUrl = `/api/eventList/${eventId}/departmentForMember/${memberId}`
  if (selectedDate) {
    fetchUrl += `?selectedDate=${selectedDate}`
  }
  return useQuery({
    queryKey: ['event', eventId, 'departmentForMember', memberId],
    queryFn: async () => {
      if (!eventId || !memberId) return []
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
