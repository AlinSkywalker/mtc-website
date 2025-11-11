import { useFetchEvent } from '../queries/event'
import { AuthContext } from '../components/AuthContext'
import { useContext } from 'react'
import { useFetchEventDepartmentById } from '../queries/eventDepartment'

export const useGetUserEventPermisson = (eventId) => {
  const { data } = useFetchEvent(eventId)
  const {
    userInfo: { memberId: currentUserId },
  } = useContext(AuthContext)
  const isCurrentMemberST = data?.event_st === currentUserId
  const isCurrentMemberOB = data?.event_ob === currentUserId

  return { isCurrentMemberST, isCurrentMemberOB }
}

export const useGetUserDepartmentPermisson = (eventId, deptId) => {
  const { data } = useFetchEventDepartmentById(eventId, deptId)
  const {
    userInfo: { memberId: currentUserId },
  } = useContext(AuthContext)
  const isCurrentMemberInstructor = data?.depart_inst === currentUserId
  return { isCurrentMemberInstructor }
}
