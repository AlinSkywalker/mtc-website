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

export function useFetchEquipmentTemplate() {
  return useQuery({
    queryKey: ['equipmentTemplate'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/dictionary/equipmentTemplate`)
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useFetchEquipmentTemplateEquip(templateId) {
  return useQuery({
    queryKey: ['equipmentTemplateEquipDictionary', templateId],
    queryFn: async () => {
      if (!templateId) return []
      const { data } = await apiClient.get(`/api/dictionary/equipmentTemplate/${templateId}/equip`)
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}
