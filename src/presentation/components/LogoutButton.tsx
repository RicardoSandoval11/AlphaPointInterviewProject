import { Pressable, StyleSheet, Text } from "react-native"
import { useAuthentication } from "../hooks/useAuthentication"


export const LogoutButton = () => {

    const { logoutUser } = useAuthentication();

    return (
        <Pressable 
            style={styles.button}
            onPress={logoutUser}
        >
            <Text>Logout</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 'auto',
        backgroundColor: 'transparent',
        width: '47%',
        padding: 2
    }
})