//Es el **"cerebro de autenticación" de la app**: crea un **contexto global** (`AuthContext`) 
// que guarda el usuario y expone las funciones `login`, `register` y `logout`, para que **cualquier componente**
//  pueda saber si hay sesión iniciada y entrar/salir sin pasar props de padre a hijo. El usuario se guarda en **localStorage**
//  (`auth_user`), así **la sesión sobrevive al recargar la página**; las funciones llaman al servicio real (`authService`) 
// y actualizan el estado con el usuario devuelto.

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

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
