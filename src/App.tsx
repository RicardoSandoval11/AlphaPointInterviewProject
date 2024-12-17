import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { LoadingContext } from './presentation/store/LoadingContext';
import { AuthenticationContext } from './presentation/store/AuthenticationContext';
import { AppScreens } from './presentation/screen-groups/AppScreens';
import { CryptoContext } from './presentation/store/CryptoContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TickerSpecificCoin } from './interfaces/TickerSpecificCoinResponse';
import { PriceItem } from './interfaces/StoragePrices';

const queryClient = new QueryClient();

export const App = () => {

  // Authentication
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  // CryptoCurrency
  const [crytoCurrencyList, setCryptoCurrencyList] = useState<CryptoCurrency[]>([]);
  const [cryptoDetails, setCryptoDetails] = useState<TickerSpecificCoin | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<PriceItem[]>([]);


  return (
    <QueryClientProvider client={queryClient}>
      <LoadingContext.Provider
        value={{
          isLoading,
          setIsLoading
        }}
      >
        <AuthenticationContext.Provider
          value={{
            isAuthenticated,
            setIsAuthenticated,
            username,
            setUsername
          }}
        >
          <CryptoContext.Provider
            value={{
              cryptoCurrencies: crytoCurrencyList,
              setCryptoCurrencies: setCryptoCurrencyList,
              cryptoDetails,
              setCryptoDetails,
              cryptoPrices,
              setCryptoPrices
            }}
          >
            <NavigationContainer>
              <AppScreens/>
            </NavigationContainer>
          </CryptoContext.Provider>
        </AuthenticationContext.Provider>

      </LoadingContext.Provider>
    </QueryClientProvider>
  )
}