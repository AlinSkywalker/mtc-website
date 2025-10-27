import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/api'

export function useFetchEventDepartPlanLabaAscent(eventId, departmentId, planId) {
  let fetchUrl = `/api/eventList/${eventId}/department/${departmentId}/plan/${planId}/labaAscents`
  return useQuery({
    queryKey: ['event', eventId, 'department', departmentId, 'plan', planId, 'labaAscents'],
    queryFn: async () => {
      if (!eventId) return []
      const { data } = await apiClient.get(fetchUrl)
      return data
    },
  })
}
