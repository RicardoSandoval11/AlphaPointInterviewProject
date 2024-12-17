import { View, Text } from "react-native"
import { useAuthentication } from "../../hooks/useAuthentication"
import { useEffect } from "react";


export const LoadingScreen = () => {

    const { verifyIsAuthenticated } = useAuthentication();

    useEffect(() => {
        verifyIsAuthenticated();
    }, []);

    return (
        <View>
            <Text>Loading...</Text>
        </View>
    )
}