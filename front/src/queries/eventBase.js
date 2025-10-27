import apiClient from '../api/api'
import { useQuery } from '@tanstack/react-query'

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

export function useFetchEventFullBase(eventId) {
  let fetchUrl = `/api/eventList/${eventId}/fullBase`
  return useQuery({
    queryKey: ['event', eventId, 'fullBase'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}
