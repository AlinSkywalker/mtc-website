import apiClient from '../api/api'
import { useQuery } from '@tanstack/react-query'
import { parseISO } from 'date-fns'

export function useFetchMemberList(params) {
  let queryUrl = `/api/memberList`
  if (params?.possibleRole) queryUrl = `/api/memberList?possibleRole=${params?.possibleRole}`
  else if (params?.eventId) queryUrl = `/api/memberList?eventId=${params?.eventId}`
  return useQuery({
    queryKey: ['memberList', params?.possibleRole],
    queryFn: async () => {
      const { data } = await apiClient.get(queryUrl)
      return data
    },
  })
}

export function useFetchMember(id) {
  return useQuery({
    queryKey: ['member', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/memberList/${id}`)
      return {
        ...data,
        date_birth: data.date_birth ? parseISO(data.date_birth) : null,
        date_razr: data.date_razr ? parseISO(data.date_razr) : null,
        date_zeton: data.date_zeton ? parseISO(data.date_zeton) : null,
        date_instr: data.date_instr ? parseISO(data.date_instr) : null,
      }
    },
  })
}

export function useFetchMemberExamList(id) {
  return useQuery({
    queryKey: ['member', id, 'exam'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/memberList/${id}/exam`)
      return data
    },
  })
}

export function useFetchMemberAscentList(id) {
  return useQuery({
    queryKey: ['member', id, 'ascent'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/memberList/${id}/ascent`)
      return data
    },
  })
}

export function useFetchMemberEvent(id) {
  return useQuery({
    queryKey: ['member', id, 'events'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/memberList/${id}/events`)
      return data
    },
  })
}

export function useFetchMemberSportCategoryList(id) {
  return useQuery({
    queryKey: ['member', id, 'sportCategory'],
    queryFn: async () => {
      if (!id) return []
      const { data } = await apiClient.get(`/api/memberList/${id}/sportCategory`)
      return data
    },
  })
}

export function useFetchMemberLabaAscentList(id) {
  return useQuery({
    queryKey: ['member', id, 'labaAscent'],
    queryFn: async () => {
      if (!id) return []
      const { data } = await apiClient.get(`/api/memberList/${id}/labaAscent`)
      return data
    },
  })
}
