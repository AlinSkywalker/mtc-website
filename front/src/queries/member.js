import apiClient from '../api/api'
import { useQuery } from '@tanstack/react-query'

export function useFetchMemberList() {
  return useQuery({
    queryKey: ['memberList'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/memberList`)
      return data
    },
  })
}

export function useFetchMember(id) {
  return useQuery({
    queryKey: ['member', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/memberList/${id}`)
      return data
    },
  })
}
