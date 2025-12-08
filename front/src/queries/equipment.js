import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/api'

export function useFetchStorageList() {
  return useQuery({
    queryKey: ['dictionary', 'storage'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/dictionary/storage`)
      return data
    },
  })
}

export function useFetchEquipmentTypeList() {
  return useQuery({
    queryKey: ['dictionary', 'equipmentType'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/dictionary/equipmentType`)
      return data
    },
  })
}
