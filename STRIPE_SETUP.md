# BootBuys - Real Stripe Integration Setup

## 🚀 Quick Start

### 1. Set Up Backend Server

```bash
# Navigate to backend directory
cd stripe-backend

# Run setup script
./setup.sh

# Start the server
npm start
```

The server will run on `http://localhost:3000`

### 2. Add Stripe SDK to Xcode

1. Open your BootBuys project in Xcode
2. Go to **File → Add Package Dependencies**
3. Enter URL: `https://github.com/stripe/stripe-ios`
4. Select version `23.0.0` or later
5. Add both `Stripe` and `StripePaymentSheet` to your target

### 3. Configure Stripe Keys

Your Stripe keys are already configured in:
- **PaymentConfig.swift** - Publishable key
- **stripe-backend/.env** - Secret key

### 4. Test the Integration

1. Start the backend server: `npm start`
2. Run your iOS app
3. Try purchasing a boot
4. Use test card: `4242 4242 4242 4242`

## 🔧 How It Works

### Payment Flow:
1. **Card Details Entry** → User enters payment info
2. **Payment Confirmation** → Shows payment summary
3. **Stripe PaymentSheet** → Real Stripe payment processing
4. **Success Screen** → Order confirmation

### Backend API:
- `POST /api/payment-intents` - Creates PaymentIntent
- `POST /api/payments/confirm` - Confirms payment
- `GET /health` - Health check

## 🧪 Test Cards

Use these test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Any future expiry date and any 3-digit CVV will work.

## 🚨 Important Notes

- **Backend must be running** for payments to work
- **Use test keys** in development
- **Replace with live keys** for production
- **Server runs on localhost:3000** by default

## 🔍 Troubleshooting

### Payment fails:
1. Check if backend server is running
2. Verify Stripe keys are correct
3. Check network connectivity
4. Look at server logs for errors

### SDK not found:
1. Make sure Stripe SDK is added to Xcode project
2. Check import statements
3. Clean and rebuild project

## 📱 Production Deployment

For production:
1. Replace test keys with live keys
2. Deploy backend to cloud service
3. Update `baseURL` in PaymentConfig.swift
4. Enable webhook endpoints
5. Set up proper error monitoring

## 🎉 You're Ready!

Your BootBuys app now has **real Stripe integration** with:
- ✅ Real payment processing
- ✅ Secure payment handling
- ✅ Professional payment UI
- ✅ Complete order management


