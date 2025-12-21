import apiClient from '../api/api'
import { useQuery } from '@tanstack/react-query'
import { parseISO } from 'date-fns'

export function useFetchEventList(show = 'all') {
  return useQuery({
    queryKey: ['eventList', show],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/eventList?show=${show}`)
      return data
    },
  })
}

export function useFetchMainPageEventList() {
  return useQuery({
    queryKey: ['mainPageEventList'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/mainPageEventList`)
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
    staleTime: 5 * 1000,
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

export function useFetchEventMemberList(eventId) {
  return useQuery({
    queryKey: ['event', eventId, 'member'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/eventList/${eventId}/member`)
      return data
    },
  })
}
export function useFetchEventInstructorsList(eventId) {
  return useQuery({
    queryKey: ['event', eventId, 'instructors'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/eventList/${eventId}/instructors`)
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

export function useFetchEventManagementStaff(eventId) {
  let fetchUrl = `/api/eventList/${eventId}/eventManagementStuff`
  return useQuery({
    queryKey: ['event', eventId, 'eventManagementStuff'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchEventInstructionLog(eventId) {
  let fetchUrl = `/api/eventList/${eventId}/eventInstructionLog`
  return useQuery({
    queryKey: ['event', eventId, 'eventInstructionLog'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}

export function useFetchEventApplicationList(eventId) {
  let fetchUrl = `/api/eventList/${eventId}/eventApplication`
  return useQuery({
    queryKey: ['event', eventId, 'eventApplication'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}
