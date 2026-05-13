import apiClient from '../api/api'
import { useQuery } from '@tanstack/react-query'

export function useFetchMembershipApplicationList() {
  return useQuery({
    queryKey: ['membershipApplication'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/membershipApplication`)
      return data
    },
  })
}
