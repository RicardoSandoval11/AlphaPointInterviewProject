import { View, Text, Pressable } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../screen-groups/AppScreens";

export interface ItemProps {
    cryptoCurrency: CryptoCurrency
}

export const CryptoItem = (props: ItemProps) => {

    const { cryptoCurrency } = props;

    const { isConnected } = useNetInfo();

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleViewDetails = () => {
        navigation.navigate('CryptoDetails', {
            cryptoId: cryptoCurrency.id
          });
    }

    return (
        <View
            style={{
                backgroundColor: 'white',
                borderRadius: 10,
                margin: 6,
                width: '90%',
                alignSelf: 'center',
                padding: 5
            }}
        >
            <View
                style={{
                    padding: 5
                }}
            >
                <Text
                    style={{
                        color: 'black',
                        fontWeight: '700'
                    }}
                >
                    {cryptoCurrency.name.toUpperCase()}
                </Text>
            </View>
            <View
                style={{
                    padding: 5
                }}
            >
                <Text
                    style={{
                        color: 'black'
                    }}
                >
                    {`Rank ${cryptoCurrency.rank}`}
                </Text>
            </View>
            <View
                style={{
                    paddingHorizontal: 5,
                    marginVertical: 2
                }}
            >
                <Text
                    style={{
                        color: 'black'
                    }}
                >{`Price: ${parseFloat(cryptoCurrency.price_usd).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                })}`}</Text>
            </View>
            <View>
                <Text style={{color: 'black', marginVertical: 2, marginHorizontal: 5}}>{`Percent change 24h: ${cryptoCurrency.percent_change_24h}`}</Text>
                <Text style={{color: 'black', marginVertical: 2, marginHorizontal: 5}}>{`Percent change 1h: ${cryptoCurrency.percent_change_1h}`}</Text>
                <Text style={{color: 'black', marginVertical: 2, marginHorizontal: 5}}>{`Percent change 7d: ${cryptoCurrency.percent_change_7d}`}</Text>
            </View>
            <View
                style={{
                    margin: 5,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                }}
            >
                <Pressable
                    style={{
                        backgroundColor: 'black',
                        borderRadius: 15,
                        paddingHorizontal: 10,
                        paddingVertical: 5
                    }}
                    disabled={!isConnected}
                    onPress={handleViewDetails}
                >
                    <Text style={{color: 'white'}}>View Details</Text>
                </Pressable>
            </View>
        </View>
    )

}