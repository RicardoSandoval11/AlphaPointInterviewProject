import { useContext } from "react"
import { AuthenticationContext } from "../store/AuthenticationContext"
import { LoadingContext } from "../store/LoadingContext";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const useAuthentication = () => {

    const { setIsAuthenticated, setUsername } = useContext(AuthenticationContext); 
    const { setIsLoading } = useContext(LoadingContext);

    const loginUser = async (username: string) => {

        try{
            setIsLoading(true);

            await AsyncStorage.setItem('username', username);

            setIsAuthenticated(true);
        }
        catch(error: any){
            console.error(error);
        }
        finally{
            setIsLoading(false);
        }

    }

    const logoutUser = async () => {
        try{

            setIsLoading(true);

            await AsyncStorage.clear();

            setIsAuthenticated(false);
        }
        catch(error: any){
            console.error(error);
        }
        finally{
            setIsLoading(false);
        }
    }

    const verifyIsAuthenticated = async () => {
        try{
            setIsLoading(true);

            const username: string | null = await AsyncStorage.getItem('username'); // You can user a secure storage like one offered by expo

            if(username != null){
                setIsAuthenticated(true);
                setUsername(username);
            }else{
                setIsAuthenticated(false);
            }
        }
        catch(error: any){
            console.error(error);
        }
        finally{
            setIsLoading(false);
        }
    }


    return {
        loginUser, 
        logoutUser,
        verifyIsAuthenticated
    }
}