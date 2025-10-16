# BootBuys Stripe Backend

This is the backend server for BootBuys Stripe payment processing.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables (optional):
```bash
export STRIPE_SECRET_KEY=sk_test_your_secret_key_here
export PORT=3000
```

3. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### Health Check
- **GET** `/health` - Check if server is running

### Payment Intents
- **POST** `/api/payment-intents` - Create a new payment intent
- **GET** `/api/payment-intents/:id` - Get payment intent status
- **POST** `/api/payments/confirm` - Confirm a payment

## Environment Variables

- `STRIPE_SECRET_KEY` - Your Stripe secret key (defaults to test key)
- `PORT` - Server port (defaults to 3000)

## Testing

The server uses your test Stripe keys by default. Test cards:
- Success: `4242424242424242`
- Decline: `4000000000000002`
- 3D Secure: `4000002500003155`

## Deployment

Deploy to your preferred hosting service (Heroku, AWS, etc.) and update the `baseURL` in your iOS app's `StripeBackendAPI.swift`.


