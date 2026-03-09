"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export interface User {
    id: number
    nombre: string
    apellido: string
    email: string
    telefono?: string
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    register: (data: { nombre: string; apellido: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const refreshUser = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/me')
            if (res.ok) {
                const data = await res.json()
                setUser(data.user)
            } else {
                setUser(null)
            }
        } catch {
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        refreshUser()
    }, [refreshUser])

    const login = useCallback(async (email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json()

            if (res.ok) {
                setUser(data.user)
                return { success: true }
            }
            return { success: false, error: data.error || 'Error al iniciar sesión' }
        } catch {
            return { success: false, error: 'Error de conexión' }
        }
    }, [])

    const register = useCallback(async (regData: { nombre: string; apellido: string; email: string; password: string }) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(regData),
            })
            const data = await res.json()

            if (res.ok) {
                setUser(data.user)
                return { success: true }
            }
            return { success: false, error: data.error || 'Error al registrarse' }
        } catch {
            return { success: false, error: 'Error de conexión' }
        }
    }, [])

    const logout = useCallback(async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            refreshUser,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
