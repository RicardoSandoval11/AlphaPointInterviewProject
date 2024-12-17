

export interface StoragePrices {
    id: string,
    prices: PriceItem[]
}

export interface PriceItem {
    price: number,
    timestamp: number
}