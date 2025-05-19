import type { Crypto, CryptoHistory } from "@/types/crypto"

const API_BASE_URL = "https://api.coincap.io/v2"

export async function getTopCryptos(limit = 20): Promise<Crypto[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/assets?limit=${limit}`)

    if (!response.ok) {
      throw new Error("Failed to fetch top cryptocurrencies")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching top cryptocurrencies:", error)
    return []
  }
}

export async function getCryptoById(id: string): Promise<Crypto | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch cryptocurrency with id: ${id}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error fetching cryptocurrency with id ${id}:`, error)
    return null
  }
}

export async function getCryptoHistory(id: string, interval = "d1"): Promise<CryptoHistory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/assets/${id}/history?interval=${interval}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch history for cryptocurrency with id: ${id}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error fetching history for cryptocurrency with id ${id}:`, error)
    return []
  }
}
