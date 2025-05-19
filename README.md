# CryptoTracker
##Name: Ester Manukyan
A simple cryptocurrency tracking application that allows users to view cryptocurrency prices, charts, and set price alerts.

## Features

- View top cryptocurrencies by market capitalization
- View detailed price charts for individual cryptocurrencies
- Set price alerts for when cryptocurrencies go above or below a target price

## Technologies Used

- HTML, CSS, and JavaScript for the frontend
- Express.js for the backend
- Chart.js for rendering price charts
- CoinCap API for cryptocurrency data

## API Endpoints Used

- Fetch top cryptocurrencies: https://api.coincap.io/v2/assets
- Fetch historical price data: https://api.coincap.io/v2/assets/{id}/history?interval=d1

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Open your browser and navigate to `http://localhost:3000`

## Deployment

This application can be deployed to Vercel using the included `vercel.json` configuration file.

## License

MIT
