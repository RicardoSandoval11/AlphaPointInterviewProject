import React, { useContext, useEffect, useState } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { View, Text, Pressable } from "react-native";
import { RootStackParamList } from "../../screen-groups/AppScreens";
import { AuthenticationContext } from "../../store/AuthenticationContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { CryptoContext } from "../../store/CryptoContext";
import { format } from "date-fns";
import { WebView } from 'react-native-webview';  // Import WebView for rendering the chart
import { useCryptoCurrencies } from "../../hooks/useCryptoCurrencies";

type CryptoDetailsScreenRouteProp = RouteProp<RootStackParamList, 'CryptoDetails'>;

interface Props {
    route: CryptoDetailsScreenRouteProp;
}

export const CryptoDetailsScreen = ({ route }: Props) => {
    const { cryptoId } = route.params;
    const { username } = useContext(AuthenticationContext);
    const { setCryptoDetails, setCryptoPrices } = useContext(CryptoContext);
    const { retrieveCryptoCurrencyPrice } = useCryptoCurrencies();
    const navigation = useNavigation();

    useEffect(() => {
        const executeAsync = async () => {
            for (let i = 0; i < 5; i++) {
                await retrieveCryptoCurrencyPrice(parseInt(cryptoId));
                await new Promise((resolve) => setTimeout(resolve, 3000));
            }
        };

        let interval = setInterval(() => {
            executeAsync();
        }, 30000);

        return () => clearInterval(interval);
    }, [cryptoId, retrieveCryptoCurrencyPrice]);

    const { cryptoPrices, cryptoDetails } = useContext(CryptoContext);
    const [prices, setPrices] = useState<number[]>([]);
    const [times, setTimes] = useState<Date[]>([]);

    useEffect(() => {
        const filterDataForToday = (data: { price: number; timestamp: number }[]) => {
            const startOfDay = new Date().setHours(0, 0, 0, 0);
            const endOfDay = new Date().setHours(23, 59, 59, 999);

            return data.filter((item) => item.timestamp >= startOfDay && item.timestamp <= endOfDay);
        };

        const filteredData = filterDataForToday(cryptoPrices);

        const formattedData = filteredData.map((item) => ({
            ...item,
            formattedTime: format(new Date(item.timestamp), "HH:mm"),
        }));

        setPrices(formattedData.map((item) => item.price));
        setTimes(formattedData.map((item) => new Date(item.timestamp)));
    }, [cryptoPrices, cryptoDetails]);

    const moveBack = () => {
        setCryptoDetails(null);
        setCryptoPrices([]);
        navigation.goBack();
    };

    const data = {
        labels: times.map((time) => format(time, "HH:mm")),
        datasets: [
            {
                label: "Price",
                data: prices,
                fill: false,
                borderColor: "rgb(134, 65, 244)",
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
    };

    // HTML code to be rendered in the WebView
    const chartHTML = `
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </head>
      <body>
        <canvas id="myChart" width="400" height="200"></canvas>
        <script>
          const ctx = document.getElementById('myChart').getContext('2d');
          const myChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: ${JSON.stringify(times.map((time) => format(time, "HH:mm")))},
              datasets: [{
                label: 'Price',
                data: ${JSON.stringify(prices)},
                fill: false,
                borderColor: 'rgb(134, 65, 244)',
                tension: 0.1
              }]
            },
            options: {
              responsive: true,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Time'
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Price'
                  }
                }
              }
            }
          });
        </script>
      </body>
    </html>
  `;

    console.log(times, prices)
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{
                backgroundColor: 'black',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 15
            }}>
                <View style={{ padding: 10 }}>
                    <Text>{`Welcome Back ${username}`}</Text>
                </View>
                <View>
                    <Pressable onPress={moveBack}>
                        <Text>Go Back</Text>
                    </Pressable>
                </View>
            </View>

            {cryptoId === null || cryptoId === undefined ? (
                <Text>Invalid ID</Text>
            ) : cryptoDetails != null ? (
                <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <View style={{ width: '100%', padding: 10 }}>
                        <Text style={{ fontWeight: 900, color: 'black' }}>
                            The next update will occur in 30 seconds...
                        </Text>
                    </View>

                    <View style={{ width: '100%', height: 300 }}>
                        <WebView
                            originWhitelist={['*']}
                            source={{ html: chartHTML }}
                            style={{ height: 300, width: 300, margin: 'auto' }}
                        />
                    </View>

                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        width: '95%',
                        backgroundColor: '#d6e3ff',
                        borderRadius: 15,
                        margin: 10
                    }}>
                        <View style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginVertical: 15
                        }}>
                            <Text style={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: 'black'
                            }}>
                                {cryptoDetails.name}
                            </Text>
                        </View>

                        <View style={{
                            width: '100%',
                            display: 'flex',
                            padding: 15,
                            flexDirection: 'row',
                            justifyContent: 'flex-start'
                        }}>
                            <Text style={{ fontSize: 20, color: 'black' }}>
                                Price {parseFloat(cryptoDetails.price_usd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </Text>
                        </View>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: 600,
                                    width: '100%',
                                    padding: 10,
                                    color: 'black'
                                }}
                            >
                                Percent Change 1hr: {cryptoDetails.percent_change_1h}</Text>
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: 600,
                                    width: '100%',
                                    padding: 10,
                                    color: 'black'
                                }}
                            >
                                Percent Change 24hr: {cryptoDetails.percent_change_24h}</Text>
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: 600,
                                    width: '100%',
                                    padding: 10,
                                    color: 'black'
                                }}
                            >
                                Percent Change 7 days: {cryptoDetails.percent_change_7d}</Text>
                        </View>
                    </View>
                </View>
            ) : (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 25,
                        fontWeight: 900,
                        color: 'black'
                    }}>
                        No Data Available Yet...
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};
