import apiClient from '../api/api'
import { useQuery } from '@tanstack/react-query'

export function useFetchCompanyData() {
  return useQuery({
    queryKey: ['companyData'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/companyData/`)
      return data
    },
  })
}
