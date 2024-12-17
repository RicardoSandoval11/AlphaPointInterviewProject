import { useState } from "react"
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View, Alert } from "react-native"
import { useAuthentication } from "../../hooks/useAuthentication";

export const LoginScreen = () => {

    const [username, setUsername] = useState('');
    const [loading, setIsLoading] = useState(false);

    const { loginUser } = useAuthentication();

    const onHandleSubmit = () => {

        setIsLoading(true);

        if(username.length == 0){

            Alert.alert('Invalid username', 'Insert a valid username', [
                {
                    text: 'Ok',
                    onPress: () => {
                        setUsername('');
                    }
                },
            ]);

            setIsLoading(false);

            return;
        }

        loginUser(username);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{width: '100%'}}>
                <TextInput
                    onChangeText={setUsername}
                    inputMode='text'
                    value={username}
                    placeholder="Username"
                    placeholderTextColor="#000"
                    editable={true}
                    style={styles.inputField}
                />
                <View
                    style={{
                        width: '80%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        flexWrap: 'nowrap',
                        margin: 'auto'
                    }}
                >
                    <Pressable
                        onPress={onHandleSubmit}
                        disabled={loading}
                        style={styles.button}
                    >
                        <Text 
                            style={{
                                color: 'white'
                            }}
                        >
                            Login
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    inputField: {
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: 'black',
        width: '80%',
        margin: 'auto',
        marginVertical: 10,
        borderColor: 'black',
        borderWidth: 1
    },
    button: {
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        margin: 'auto',
        backgroundColor: 'black',
        marginTop: 10,
        width: '47%',
    }
})