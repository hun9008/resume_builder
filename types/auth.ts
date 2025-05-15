export type User = {
  username: string
  password: string
  resumeData?: any
}

export type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  register: (username: string, authCode: string, password: string) => Promise<boolean>
}
