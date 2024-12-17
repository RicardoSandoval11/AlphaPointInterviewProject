import React from "react";
import { createStackNavigator } from "@react-navigation/stack"
import { useContext } from "react";
import { AuthenticationContext } from "../store/AuthenticationContext";
import { LoadingContext } from "../store/LoadingContext";
import { CryptoContext } from "../store/CryptoContext";
import { LoadingScreen } from "../screens/global/LoadingScreen";
import { CryptoListScreen } from "../screens/crypto/CryptoListScreen";
import { LoginScreen } from "../screens/authentication/LoginScreen";
import { CryptoDetailsScreen } from "../screens/crypto/CryptoDetailsScreen";


export type RootStackParamList = {
    CryptoCurrencies: undefined;
    CryptoDetails: { cryptoId: string };
    Loading: undefined;
    Login: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppScreens = () => {


    // Contexts
    const { isAuthenticated } = useContext(AuthenticationContext);
    const { isLoading } = useContext(LoadingContext);

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            {
                isLoading ? <Stack.Screen name="Loading" component={LoadingScreen}/>
                :
                isAuthenticated ? 
                    <>
                        <Stack.Screen name="CryptoCurrencies" component={CryptoListScreen}/>
                        <Stack.Screen name="CryptoDetails" component={CryptoDetailsScreen}/>
                    </>
                :
                    <Stack.Screen name="Login" component={LoginScreen}/>
            }
        </Stack.Navigator>
    )
}