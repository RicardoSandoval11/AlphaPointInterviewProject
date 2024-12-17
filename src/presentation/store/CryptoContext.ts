import { createContext, Dispatch, SetStateAction } from "react";
import { TickerSpecificCoin } from "../../interfaces/TickerSpecificCoinResponse";
import { PriceItem } from "../../interfaces/StoragePrices";


interface CryptoContextValue {
    cryptoCurrencies: CryptoCurrency[],
    setCryptoCurrencies: Dispatch<SetStateAction<CryptoCurrency[]>>,
    cryptoDetails: TickerSpecificCoin | null,
    setCryptoDetails: Dispatch<SetStateAction<TickerSpecificCoin | null>>
    cryptoPrices: PriceItem[],
    setCryptoPrices: Dispatch<SetStateAction<PriceItem[]>>
}

const defaultValue : CryptoContextValue = {
    cryptoCurrencies: [],
    setCryptoCurrencies: () => {},
    cryptoDetails: null,
    setCryptoDetails: () => {},
    cryptoPrices: [],
    setCryptoPrices: () => {}
}

export const CryptoContext = createContext(defaultValue);