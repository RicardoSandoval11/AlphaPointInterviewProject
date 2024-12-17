import { View, Text, StyleSheet, Alert } from "react-native"
import { useAuthentication } from "../../hooks/useAuthentication"
import React, { useContext, useEffect, useState } from "react"
import { AuthenticationContext } from "../../store/AuthenticationContext"
import { LogoutButton } from "../../components/LogoutButton"
import { useQuery } from "@tanstack/react-query"
import { useCryptoCurrencies } from "../../hooks/useCryptoCurrencies"
import { FlatList, Pressable, TextInput } from "react-native-gesture-handler"
import { CryptoContext } from "../../store/CryptoContext"
import { SafeAreaView } from "react-native-safe-area-context"
import { CryptoItem, ItemProps } from "../../components/CryptoItem"
import { useNetInfo } from "@react-native-community/netinfo"

export const CryptoListScreen = () => {

    const { username } = useContext(AuthenticationContext);
    const { cryptoCurrencies, setCryptoCurrencies } = useContext(CryptoContext);

    const { loadInitialListAsync } = useCryptoCurrencies();

    const { isLoading, data } = useQuery({
        queryKey: ['initial-crypto-list'],
        queryFn: () => loadInitialListAsync(),
        staleTime: 1000 * 60 * 60 // Maintain for 60 minutes
    });

    // Verifying internet connection
    const { isConnected } = useNetInfo();

    useEffect(() => {

        if(isConnected != null && isConnected != undefined && !isConnected){
            Alert.alert('No Internet Connection', 'You do not have internet connection', [
                {
                    text: 'Ok',
                    onPress: () => {}
                },
            ]);
        }

    }, [isConnected]);

    // First Loading
    useEffect(() => {
        if(data != undefined)
            setCryptoCurrencies(data.sort((a,b) => a.rank - b.rank));
    }, [data]);

    // Filter handler
    const [rateChange, setRateChange] = useState('');

    const handleSubmit = () => {
        // Permitir solo números y un punto decimal
        const decimalRegex = /^-?\d*(\.\d+)?$/;

        if(rateChange === ''){
            setCryptoCurrencies(data!);
            return;
        }

        if (decimalRegex.test(rateChange)) {

            setCryptoCurrencies(cryptoCurrencies
                                    .filter(c => parseFloat(c.percent_change_24h) >= parseFloat(rateChange)));

        }else {
            Alert.alert('Invalid Rate', 'Insert a valid rate', [
                {
                    text: 'Ok',
                    onPress: () => {
                        setRateChange('');
                    }
                },
            ]);
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.header}>
                <View
                    style={{
                        padding: 10
                    }}
                >
                    <Text>{`Welcome Back ${username}`}</Text>
                </View>
                <View>
                    <LogoutButton/>
                </View>
            </View>
            <View
                style={{
                    backgroundColor: 'transparent',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    padding: 5,
                    alignItems: 'center',
                    marginVertical: 15,
                    width: '100%'
                }}
            >
                <TextInput
                    placeholder="Minimum 24-hr % Change (Ej. 1.34)"
                    inputMode="text"
                    onChangeText={setRateChange}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 15,
                        paddingHorizontal: 12,
                        marginRight: 15,
                        color: 'black',
                        fontSize: 12
                    }}
                    placeholderTextColor={'black'}
                />
                <Pressable
                    onPress={handleSubmit}
                    style={{
                        backgroundColor: 'black',
                        borderRadius: 15,
                        paddingHorizontal: 15,
                        paddingVertical: 10
                    }}
                >
                    <Text style={{
                        color: 'white'
                    }}>
                        Filter
                    </Text>
                </Pressable>
            </View>
            {
                isLoading ? 
                    <Text> Loading... </Text>
                :
                    cryptoCurrencies.length == 0 ?
                        <Text>No results were found...</Text>
                    :
                        <FlatList
                            data={cryptoCurrencies}
                            horizontal={false}
                            renderItem={(data) => <CryptoItem cryptoCurrency={data.item}/>}
                            keyExtractor={item => item.id}
                            maxToRenderPerBatch={5}
                            initialNumToRender={10}
                        />
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#d6e3ff',
        flex: 1
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        backgroundColor: 'black',
        alignItems: 'center',
        paddingVertical: 20,
        width: '100%'
    }
})