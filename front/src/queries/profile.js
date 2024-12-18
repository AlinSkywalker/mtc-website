import apiClient from '../api/api'
import { useQuery } from '@tanstack/react-query'

export function useFetchProfile(id) {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      if (!id) return {}
      const { data } = await apiClient.get(`/api/profile/${id}`)
      return data
    },
  })
}
