import { createContext, Dispatch, SetStateAction } from "react"


interface AuthenticationContextValue {
    isAuthenticated: boolean,
    username: string,
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>,
    setUsername: Dispatch<SetStateAction<string>>
}

const defaultValue : AuthenticationContextValue = {
    isAuthenticated: false,
    username: '',
    setIsAuthenticated: () => {},
    setUsername: () => {}
}


export const AuthenticationContext = createContext(defaultValue);