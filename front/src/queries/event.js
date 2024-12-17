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

export function useFetchEventDepartmentById(eventId, departmentId) {
  return useQuery({
    queryKey: ['event', eventId, 'department', departmentId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/eventList/${eventId}/department/${departmentId}`)
      return data
    },
  })
}

export function useFetchEventDepartmentMemberList(eventId, departmentId, selectedDate) {
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

export function useFetchBaseHouseRoomForEvent({ eventId }) {
  let fetchUrl = `/api/eventList/${eventId}/baseHouseRoomForEvent`
  return useQuery({
    queryKey: ['event', eventId, 'baseHouseRoomForEvent'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchEventBaseHouseRoomMemberList(eventId, selectedBaseRoom) {
  let fetchUrl = `/api/eventList/${eventId}/baseHouseRoomMember`
  return useQuery({
    queryKey: ['event', eventId, 'baseHouseRoomMember', selectedBaseRoom],
    queryFn: async () => {
      if (!eventId) return []
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
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}
