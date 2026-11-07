import { createContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import * as authService from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('auth_user', null)

  const login = async (credentials) => {
    const loggedUser = await authService.login(credentials)
    setUser(loggedUser)
    return loggedUser
  }

  const register = async (data) => {
    const newUser = await authService.register(data)
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
