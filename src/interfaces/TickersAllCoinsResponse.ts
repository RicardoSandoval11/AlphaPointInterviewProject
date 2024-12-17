

interface TickersAllCoinsResponse {
    data: CryptoCurrency[],
    info: Information
}

interface Information {
    coins_num: number,
    time: number
}