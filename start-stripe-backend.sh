#!/bin/bash

# BootBuys Stripe Backend Startup Script

echo "🚀 Starting BootBuys Stripe Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Navigate to backend directory
cd "$(dirname "$0")/stripe-backend"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🔥 Starting server on http://localhost:3000"
echo "📱 Health check: http://localhost:3000/health"
echo "💳 Payment intents: http://localhost:3000/api/payment-intents"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start


