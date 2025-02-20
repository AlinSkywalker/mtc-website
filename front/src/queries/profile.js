import apiClient from '../api/api'
import { useQuery } from '@tanstack/react-query'
import parseISO from 'date-fns/parseISO'

export function useFetchProfile(id) {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      if (!id) return {}
      const { data } = await apiClient.get(`/api/profile/${id}`)
      return { ...data, date_birth: data.date_birth ? parseISO(data.date_birth) : null }
    },
  })
}
