import { createContext, Dispatch, SetStateAction } from "react"


interface LoadingContextValue {
    isLoading: boolean,
    setIsLoading: Dispatch<SetStateAction<boolean>>
}


const defaultValue: LoadingContextValue = {
    isLoading: true,
    setIsLoading: () => {}
}


export const LoadingContext = createContext(defaultValue);