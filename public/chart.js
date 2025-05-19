import { Chart } from "@/components/ui/chart"
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

// Format large numbers
function formatNumber(value) {
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(numValue)
}

// Fetch top cryptocurrencies
async function fetchTopCryptos(limit = 20) {
  try {
    const response = await fetch(`https://api.coincap.io/v2/assets?limit=${limit}`)
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

// Fetch a specific cryptocurrency by ID
async function fetchCryptoById(id) {
  try {
    const response = await fetch(`https://api.coincap.io/v2/assets/${id}`)
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

// Fetch historical data for a cryptocurrency
async function fetchCryptoHistory(id, interval = "d1") {
  try {
    const response = await fetch(`https://api.coincap.io/v2/assets/${id}/history?interval=${interval}`)
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

// Render crypto grid
async function renderCryptoGrid() {
  const cryptoGridElement = document.getElementById("crypto-grid")

  try {
    const cryptos = await fetchTopCryptos()

    if (cryptos.length === 0) {
      cryptoGridElement.innerHTML = '<div class="empty-state">No cryptocurrencies found</div>'
      return
    }

    const cryptoCards = cryptos
      .map((crypto) => {
        const priceChange = Number.parseFloat(crypto.changePercent24Hr)
        const isPositive = priceChange >= 0

        return `
        <div class="crypto-card" data-id="${crypto.id}">
          <div class="crypto-card-header">
            <div class="crypto-info">
              <div class="crypto-rank">${crypto.rank}</div>
              <div class="crypto-name">${crypto.name}</div>
            </div>
            <div class="crypto-symbol">${crypto.symbol}</div>
          </div>
          <div class="crypto-card-content">
            <div class="crypto-price">${formatCurrency(crypto.priceUsd)}</div>
            <div class="crypto-change ${isPositive ? "positive" : "negative"}">
              ${isPositive ? "↑" : "↓"} ${formatPercentage(crypto.changePercent24Hr)}
            </div>
          </div>
          <div class="crypto-chart-icon">📊</div>
        </div>
      `
      })
      .join("")

    cryptoGridElement.innerHTML = cryptoCards

    // Add event listeners to crypto cards
    document.querySelectorAll(".crypto-card").forEach((card) => {
      card.addEventListener("click", () => {
        const cryptoId = card.dataset.id
        showCryptoDetail(cryptoId)
      })
    })
  } catch (error) {
    console.error("Error rendering crypto grid:", error)
    cryptoGridElement.innerHTML = '<div class="empty-state">Failed to load cryptocurrencies</div>'
  }
}

// Show crypto detail
async function showCryptoDetail(cryptoId) {
  const cryptoDetailElement = document.getElementById("crypto-detail")
  const cryptoGridElement = document.getElementById("crypto-grid")

  try {
    // Show loading state
    cryptoDetailElement.classList.remove("hidden")
    cryptoGridElement.classList.add("hidden")

    // Fetch crypto data
    const crypto = await fetchCryptoById(cryptoId)
    if (!crypto) {
      throw new Error(`Cryptocurrency with id ${cryptoId} not found`)
    }

    // Fetch historical data
    const history = await fetchCryptoHistory(cryptoId)

    // Update UI with crypto data
    document.getElementById("crypto-name").textContent = `${crypto.name} (${crypto.symbol})`

    const priceElement = document.getElementById("crypto-price")
    priceElement.textContent = formatCurrency(crypto.priceUsd)

    const changeElement = document.getElementById("crypto-change")
    const priceChange = Number.parseFloat(crypto.changePercent24Hr)
    const isPositive = priceChange >= 0
    changeElement.textContent = formatPercentage(crypto.changePercent24Hr)
    changeElement.className = `crypto-change ${isPositive ? "positive" : "negative"}`

    // Create stats cards
    const statsElement = document.getElementById("crypto-stats")
    statsElement.innerHTML = `
      <div class="card stat-card">
        <div class="stat-label">Market Cap</div>
        <div class="stat-value">${formatCurrency(crypto.marketCapUsd, 0)}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">24h Volume</div>
        <div class="stat-value">${formatCurrency(crypto.volumeUsd24Hr, 0)}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">Supply</div>
        <div class="stat-value">${formatNumber(crypto.supply)} ${crypto.symbol}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">Rank</div>
        <div class="stat-value">#${crypto.rank}</div>
      </div>
    `

    // Create chart
    createPriceChart(history)
  } catch (error) {
    console.error("Error showing crypto detail:", error)
    cryptoDetailElement.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">❌</div>
        <p>Failed to load cryptocurrency details</p>
        <button id="back-to-list-error" class="btn btn-primary mt-4">Back to List</button>
      </div>
    `

    document.getElementById("back-to-list-error")?.addEventListener("click", () => {
      cryptoDetailElement.classList.add("hidden")
      cryptoGridElement.classList.remove("hidden")
    })
  }
}

// Create price chart
function createPriceChart(historyData) {
  const ctx = document.getElementById("price-chart").getContext("2d")

  // Prepare data for chart
  const chartData = historyData.map((item) => ({
    x: new Date(item.time),
    y: Number.parseFloat(item.priceUsd),
  }))

  // Destroy existing chart if it exists
  if (window.priceChart) {
    window.priceChart.destroy()
  }

  // Create new chart
  window.priceChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Price (USD)",
          data: chartData,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
            tooltipFormat: "MMM d, yyyy",
          },
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          title: {
            display: true,
            text: "Price (USD)",
          },
          ticks: {
            callback: (value) => formatCurrency(value, 0),
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => formatCurrency(context.parsed.y),
          },
        },
        legend: {
          display: false,
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
    },
  })
}

// Check for URL parameters
function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search)
  const cryptoId = urlParams.get("id")

  if (cryptoId) {
    showCryptoDetail(cryptoId)
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  renderCryptoGrid()
  checkUrlParams()

  // Back button event listener
  document.getElementById("back-to-list")?.addEventListener("click", () => {
    document.getElementById("crypto-detail").classList.add("hidden")
    document.getElementById("crypto-grid").classList.remove("hidden")
    // Update URL without refreshing the page
    history.pushState({}, "", "/chart.html")
  })
})
