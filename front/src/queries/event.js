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

export function useFetchEventDepartmentMemberList(eventId, departmentId) {
  return useQuery({
    queryKey: ['event', eventId, 'department', departmentId],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/api/eventList/${eventId}/department/${departmentId}/member`,
      )
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
