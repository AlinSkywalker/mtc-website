import { AuthContext } from '../components/AuthContext'
import { useContext } from 'react'

export const useIsAdmin = () => {
  const {
    userInfo: { role },
  } = useContext(AuthContext)
  return role === 'ADMIN_ROLE'
}
