#!/bin/bash

echo "🚀 Setting up Stripe Backend Server for BootBuys"
echo "================================================"

# Create .env file
echo "📝 Creating .env file..."
cat > .env << EOF
# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
EOF

echo "✅ .env file created"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "🎉 Setup complete!"
echo ""
echo "To start the server:"
echo "  npm start"
echo ""
echo "To start in development mode:"
echo "  npm run dev"
echo ""
echo "Server will run on: http://localhost:3000"


