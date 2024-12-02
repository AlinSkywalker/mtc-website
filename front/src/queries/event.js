import apiClient from '../api/api'
import { useQuery } from '@tanstack/react-query'

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
      return data
    },
  })
}
