import React, { createContext, useEffect, useState } from 'react'

/**
 * @typedef {Object} UserInfo
 * @property {string} id
 * @property {string} role
 * @property {string} memberId
 * @property {boolean} isClubMember
 * @property {boolean} isBoardMember
 */

/**
 * @typedef {Object} AuthContextValue
 * @property {boolean} isAuthenticated
 * @property {function(boolean): void} setIsAuthenticated
 * @property {UserInfo} userInfo
 * @property {function(UserInfo): void} setUserInfo
 */

/**
 * @type {React.Context<AuthContextValue>}
 */

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const savedToken = localStorage.getItem('token')
  const [isAuthenticated, setIsAuthenticated] = useState(!!savedToken)
  const [userInfo, setUserInfo] = useState({
    id: '',
    role: '',
    memberId: '',
    isClubMember: false,
    isBoardMember: false,
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    // Validate token with the server and set isAuthenticated accordingly
    setIsAuthenticated(!!token)
  }, [])

  const contextValue = { isAuthenticated, setIsAuthenticated, userInfo, setUserInfo }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
