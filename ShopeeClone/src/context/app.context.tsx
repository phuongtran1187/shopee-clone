import { createContext, useState } from 'react'
import { getAccessTokenFromLS } from 'src/utils/auth'

interface AppContextInterface {
  isAuthentication: boolean
  setIsAuthentication: React.Dispatch<React.SetStateAction<boolean>>
}

const initialAppContext: AppContextInterface = {
  isAuthentication: Boolean(getAccessTokenFromLS()),
  setIsAuthentication: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthentication, setIsAuthentication] = useState<boolean>(initialAppContext.isAuthentication)

  return (
    <AppContext.Provider
      value={{
        isAuthentication,
        setIsAuthentication
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
