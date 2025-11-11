import apiClient from '../api/api'
import { useQuery } from '@tanstack/react-query'
import { parseISO } from 'date-fns'

export function useFetchApplicationList() {
  return useQuery({
    queryKey: ['applicationList'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/applicationList`)
      return data
    },
  })
}
