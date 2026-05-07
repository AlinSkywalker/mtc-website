import apiClient from '../api/api'
import { useQuery } from '@tanstack/react-query'

export function useFetchRegionalOffices() {
  return useQuery({
    queryKey: ['regionalOffices'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/regionalOffices/`)
      return data
    },
  })
}
