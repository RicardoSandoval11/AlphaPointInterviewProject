import { useContext } from "react";
import { api } from "../../config/apiConfig";
import { CryptoContext } from "../store/CryptoContext";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { TickerSpecificCoin } from "../../interfaces/TickerSpecificCoinResponse";
import { PriceItem, StoragePrices } from "../../interfaces/StoragePrices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetInfo } from "@react-native-community/netinfo";

export const useCryptoCurrencies = () => {

    const { setCryptoDetails, setCryptoPrices, cryptoDetails } = useContext(CryptoContext);

    const { isConnected } = useNetInfo();

    const loadInitialListAsync = async () => {
        try{            
            const { data } = await api.get<TickersAllCoinsResponse>(`https://api.coinlore.net/api/tickers/?limit=50`);

            return data.data;

        }catch(error: any){
            throw new Error('Something went wrong');
        }
    }

    const retrieveCryptoCurrencyPrice = async (currencyId: number) => {
        try{

            const currentPrices:  string | null = await AsyncStorage.getItem(`${currencyId}`);
            
            if(!isConnected){
                if(currentPrices != null){
                    setCryptoDetails(JSON.parse((await AsyncStorage.getItem(`details-${currencyId}`))!) as TickerSpecificCoin);
                    setCryptoPrices(JSON.parse(currentPrices) as PriceItem[]);
                }else{
                    setCryptoDetails(null);
                    setCryptoPrices([]);
                }

                return;
            }

            const { data } = await api.get<TickerSpecificCoin[]>(`https://api.coinlore.net/api/ticker/?id=${currencyId}`);
      
            await AsyncStorage.setItem(`details-${currencyId}`, JSON.stringify(data[0]));
            setCryptoDetails(data[0]);

            let prices: PriceItem[] = [];

            if(currentPrices == null){

                prices = [{
                    price: parseFloat(data[0].price_usd),
                    timestamp: new Date().getTime()
                }];

                await AsyncStorage.setItem(`${currencyId}`, JSON.stringify(prices));

            }else{

                prices = JSON.parse(currentPrices) as PriceItem[];
                prices.push({
                    price: parseFloat(data[0].price_usd),
                    timestamp: new Date().getTime()
                });
                await AsyncStorage.setItem(`${currencyId}`, JSON.stringify(prices));
            }

            setCryptoPrices(prices);

        }
        catch(error: any){
            throw new Error('Something went wrong');
        }
    }

    return {
        loadInitialListAsync,
        retrieveCryptoCurrencyPrice
    }
}