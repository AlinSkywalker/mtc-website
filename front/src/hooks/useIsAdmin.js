import { AuthContext } from '../components/AuthContext'
import { useContext } from 'react'

export const useIsAdmin = () => {
  const {
    userInfo: { role },
  } = useContext(AuthContext)
  return role === 'ADMIN_ROLE'
}

export const useIsMainAdmin = () => {
  const {
    userInfo: { memberId },
  } = useContext(AuthContext)
  return memberId === 4
}

export const useIsBoardMember = () => {
  const {
    userInfo: { isBoardMember },
  } = useContext(AuthContext)
  return isBoardMember || useIsMainAdmin()
}
