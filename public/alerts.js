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

// Alert class
class Alert {
  constructor(cryptoId, cryptoName, cryptoSymbol, targetPrice, isAbove) {
    this.id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
    this.cryptoId = cryptoId
    this.cryptoName = cryptoName
    this.cryptoSymbol = cryptoSymbol
    this.targetPrice = targetPrice
    this.isAbove = isAbove
    this.createdAt = new Date()
  }
}

// Alerts manager
class AlertsManager {
  constructor() {
    this.alerts = []
    this.loadAlerts()
  }

  loadAlerts() {
    const savedAlerts = localStorage.getItem("crypto-alerts")
    if (savedAlerts) {
      try {
        this.alerts = JSON.parse(savedAlerts)
      } catch (error) {
        console.error("Failed to parse saved alerts:", error)
        this.alerts = []
      }
    }
  }

  saveAlerts() {
    localStorage.setItem("crypto-alerts", JSON.stringify(this.alerts))
  }

  addAlert(cryptoId, cryptoName, cryptoSymbol, targetPrice, isAbove) {
    const alert = new Alert(cryptoId, cryptoName, cryptoSymbol, targetPrice, isAbove)
    this.alerts.push(alert)
    this.saveAlerts()
    return alert
  }

  removeAlert(id) {
    this.alerts = this.alerts.filter((alert) => alert.id !== id)
    this.saveAlerts()
  }

  getAlerts() {
    return this.alerts
  }
}

// Toast notification
function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast")
  const toastMessage = document.getElementById("toast-message")

  toastMessage.textContent = message
  toast.classList.remove("hidden")

  setTimeout(() => {
    toast.classList.add("hidden")
  }, duration)
}

// Fetch top cryptocurrencies
async function fetchTopCryptos(limit = 100) {
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

// Populate crypto select
async function populateCryptoSelect() {
  const selectElement = document.getElementById("crypto-select")

  try {
    const cryptos = await fetchTopCryptos()

    if (cryptos.length === 0) {
      selectElement.innerHTML = '<option value="">No cryptocurrencies available</option>'
      return
    }

    const options = cryptos
      .map(
        (crypto) =>
          `<option value="${crypto.id}" data-name="${crypto.name}" data-symbol="${crypto.symbol}" data-price="${crypto.priceUsd}">
        ${crypto.name} (${crypto.symbol})
      </option>`,
      )
      .join("")

    selectElement.innerHTML = '<option value="">Select a cryptocurrency</option>' + options

    // Set default price when crypto is selected
    selectElement.addEventListener("change", () => {
      const selectedOption = selectElement.options[selectElement.selectedIndex]
      if (selectedOption.value) {
        const currentPrice = Number.parseFloat(selectedOption.dataset.price)
        document.getElementById("target-price").value = currentPrice.toFixed(6)
      }
    })
  } catch (error) {
    console.error("Error populating crypto select:", error)
    selectElement.innerHTML = '<option value="">Failed to load cryptocurrencies</option>'
  }
}

// Render alerts list
function renderAlertsList() {
  const alertsListElement = document.getElementById("alerts-list")
  const alerts = alertsManager.getAlerts()

  if (alerts.length === 0) {
    alertsListElement.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔔</div>
        <p>You don't have any alerts set up yet.</p>
      </div>
    `
    return
  }

  const alertItems = alerts
    .map(
      (alert) => `
    <div class="alert-item">
      <div class="alert-info">
        <div class="alert-name">${alert.cryptoName} (${alert.cryptoSymbol})</div>
        <div class="alert-condition ${alert.isAbove ? "positive" : "negative"}">
          ${alert.isAbove ? "↑" : "↓"} Alert when price goes ${alert.isAbove ? "above" : "below"} ${formatCurrency(alert.targetPrice)}
        </div>
      </div>
      <button class="delete-btn" data-id="${alert.id}">🗑️</button>
    </div>
  `,
    )
    .join("")

  alertsListElement.innerHTML = alertItems

  // Add event listeners to delete buttons
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const alertId = button.dataset.id
      alertsManager.removeAlert(alertId)
      renderAlertsList()
      showToast("Alert deleted successfully")
    })
  })
}

// Initialize alerts manager
const alertsManager = new AlertsManager()

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  populateCryptoSelect()
  renderAlertsList()

  // Form submission
  document.getElementById("alert-form").addEventListener("submit", (e) => {
    e.preventDefault()

    const selectElement = document.getElementById("crypto-select")
    const selectedOption = selectElement.options[selectElement.selectedIndex]

    if (!selectedOption.value) {
      showToast("Please select a cryptocurrency")
      return
    }

    const cryptoId = selectedOption.value
    const cryptoName = selectedOption.dataset.name
    const cryptoSymbol = selectedOption.dataset.symbol
    const targetPrice = Number.parseFloat(document.getElementById("target-price").value)
    const isAbove = document.getElementById("above").checked

    if (isNaN(targetPrice) || targetPrice <= 0) {
      showToast("Please enter a valid price")
      return
    }

    alertsManager.addAlert(cryptoId, cryptoName, cryptoSymbol, targetPrice, isAbove)
    renderAlertsList()

    // Reset form
    document.getElementById("alert-form").reset()

    showToast(`Alert created for ${cryptoName}`)
  })
})
