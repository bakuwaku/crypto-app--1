// Theme toggle functionality
const themeToggle = document.getElementById("theme-toggle")
const themeToggleIcon = themeToggle.querySelector(".theme-toggle-icon")

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem("theme")
if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  document.body.classList.add("dark-theme")
  themeToggleIcon.textContent = "☀️"
}

// Theme toggle event listener
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme")
  if (document.body.classList.contains("dark-theme")) {
    localStorage.setItem("theme", "dark")
    themeToggleIcon.textContent = "☀️"
  } else {
    localStorage.setItem("theme", "light")
    themeToggleIcon.textContent = "🌙"
  }
})

// Format currency function
function formatCurrency(value, maximumFractionDigits = 2) {
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(numValue)
}

// Format percentage function
function formatPercentage(value) {
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value

  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  }).format(numValue / 100)
}

// Fetch top cryptocurrencies
async function fetchTopCryptos() {
  try {
    const response = await fetch("https://api.coincap.io/v2/assets?limit=10")
    if (!response.ok) {
      throw new Error("Failed to fetch data")
    }
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching cryptocurrencies:", error)
    return []
  }
}

// Render crypto list
async function renderCryptoList() {
  const cryptoListElement = document.getElementById("crypto-list")

  try {
    const cryptos = await fetchTopCryptos()

    if (cryptos.length === 0) {
      cryptoListElement.innerHTML = '<div class="empty-state">No cryptocurrencies found</div>'
      return
    }

    const cryptoItems = cryptos
      .map((crypto) => {
        const priceChange = Number.parseFloat(crypto.changePercent24Hr)
        const isPositive = priceChange >= 0

        return `
        <a href="/chart.html?id=${crypto.id}" class="crypto-item">
          <div class="crypto-info">
            <div class="crypto-rank">${crypto.rank}</div>
            <div class="crypto-name-container">
              <div class="crypto-name">${crypto.name}</div>
              <div class="crypto-symbol">${crypto.symbol}</div>
            </div>
          </div>
          <div class="crypto-price-container">
            <div class="crypto-price">${formatCurrency(crypto.priceUsd)}</div>
            <div class="crypto-change ${isPositive ? "positive" : "negative"}">
              ${isPositive ? "↑" : "↓"} ${formatPercentage(crypto.changePercent24Hr)}
            </div>
          </div>
        </a>
      `
      })
      .join("")

    cryptoListElement.innerHTML = cryptoItems
  } catch (error) {
    console.error("Error rendering crypto list:", error)
    cryptoListElement.innerHTML = '<div class="empty-state">Failed to load cryptocurrencies</div>'
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  renderCryptoList()
})
