import apiClient from '../api/api'
import { useQuery } from '@tanstack/react-query'

export function useFetchBoardMembers() {
  return useQuery({
    queryKey: ['boardMembers'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/boardMembers/`)
      return data
    },
  })
}
