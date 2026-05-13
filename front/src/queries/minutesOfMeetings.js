import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/api'

export const useFetchMinutesOfMeetings = () => {
  return useQuery({
    queryKey: ['minutesOfMeetings'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/minutesOfMeetings/`)
      return data
    },
  })
}
