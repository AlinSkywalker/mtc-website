import apiClient from '../api/api'
import { useQuery } from '@tanstack/react-query'

export function useFetchDictionaryByName({ dictionaryName, returnType }) {
  return useQuery({
    queryKey: [dictionaryName],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/${dictionaryName}?returnType=${returnType}`)
      return data
    },
  })
}
export function useFetchDictionaryByNameAndParentId(dictionaryName, parentId) {
  return useQuery({
    queryKey: [dictionaryName],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/${dictionaryName}?parentId=${parentId}`)
      return data
    },
  })
}

export function useFetchRegionDictionaryList() {
  return useQuery({
    queryKey: ['regionDictionary'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/regionDictionary`)
      return data
    },
  })
}
export function useFetchDistrictDictionaryList() {
  return useQuery({
    queryKey: ['districtDictionary'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/districtDictionary`)
      return data
    },
  })
}
export function useFetchSummitDictionaryList() {
  return useQuery({
    queryKey: ['summitDictionary'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/summitDictionary`)
      return data
    },
  })
}
export function useFetchRouteDictionaryList() {
  return useQuery({
    queryKey: ['routeDictionary'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/routeDictionary`)
      return data
    },
  })
}
export function useFetchLaboratoryDictionaryList() {
  return useQuery({
    queryKey: ['laboratoryDictionary'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/laboratoryDictionary`)
      return data
    },
  })
}
export function useFetchContractorDictionaryList() {
  return useQuery({
    queryKey: ['contractorDictionary'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/contractorDictionary`)
      return data
    },
  })
}

export function useFetchContractorByBaseIdDictionaryList(baseId) {
  return useQuery({
    queryKey: ['contractorDictionary', 'baseId', baseId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/contractorDictionary?baseId=${baseId}`)
      return data
    },
  })
}

export function useFetchBaseDictionaryList() {
  return useQuery({
    queryKey: ['baseDictionary'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/baseDictionary`)
      return data
    },
  })
}
export function useFetchCityDictionaryList() {
  return useQuery({
    queryKey: ['cityDictionary'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/cityDictionary`)
      return data
    },
  })
}
