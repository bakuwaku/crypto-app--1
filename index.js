const express = require("express")
const path = require("path")
const app = express()
const PORT = process.env.PORT || 3000

// Serve static files from the public directory
app.use(express.static("public"))

// API routes can be added here if needed
// For example, to proxy requests to CoinCap API to avoid CORS issues
app.get("/api/assets", async (req, res) => {
  try {
    const response = await fetch("https://api.coincap.io/v2/assets")
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error("Error fetching data:", error)
    res.status(500).json({ error: "Failed to fetch data" })
  }
})

app.get("/api/assets/:id/history", async (req, res) => {
  try {
    const { id } = req.params
    const { interval = "d1" } = req.query
    const response = await fetch(`https://api.coincap.io/v2/assets/${id}/history?interval=${interval}`)
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error("Error fetching history:", error)
    res.status(500).json({ error: "Failed to fetch history data" })
  }
})

app.get("/api/assets/:id", async (req, res) => {
  try {
    const { id } = req.params
    const response = await fetch(`https://api.coincap.io/v2/assets/${id}`)
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error("Error fetching asset:", error)
    res.status(500).json({ error: "Failed to fetch asset data" })
  }
})

// For all other routes, serve the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
