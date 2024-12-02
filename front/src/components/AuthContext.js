import React, { createContext, useEffect, useState } from 'react'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const savedToken = localStorage.getItem('token')
  const [isAuthenticated, setIsAuthenticated] = useState(!!savedToken)
  const [userInfo, setUserInfo] = useState({ id: '', role: '' })

  useEffect(() => {
    const token = localStorage.getItem('token')
    // Validate token with the server and set isAuthenticated accordingly
    setIsAuthenticated(!!token)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userInfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
