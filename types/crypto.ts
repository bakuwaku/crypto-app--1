export interface Crypto {
  id: string
  rank: string
  symbol: string
  name: string
  supply: string
  maxSupply: string | null
  marketCapUsd: string
  volumeUsd24Hr: string
  priceUsd: string
  changePercent24Hr: string
  vwap24Hr: string
}

export interface CryptoHistory {
  priceUsd: string
  time: number
  date: string
}

export interface Alert {
  id: string
  cryptoId: string
  cryptoName: string
  cryptoSymbol: string
  targetPrice: number
  isAbove: boolean
  createdAt: Date
}
