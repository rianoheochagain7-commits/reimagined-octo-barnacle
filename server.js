require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create PaymentIntent endpoint with Connect support
app.post('/api/payment-intents', async (req, res) => {
  try {
    const { amount, currency = 'eur', metadata = {}, sellerId } = req.body;
    
    // Validate amount
    if (!amount || amount < 50) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    // Calculate platform fee (5% for boots under €100, 7% for boots €100+)
    const platformFeePercentage = amount >= 100 ? 0.07 : 0.05; // 7% for €100+, 5% for under €100
    const platformFee = Math.round(amount * platformFeePercentage * 100); // Convert to cents
    const sellerAmount = Math.round(amount * 100) - platformFee;
    
    // Create PaymentIntent with Connect
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata: {
        ...metadata,
        sellerId: sellerId || 'default_seller',
        platformFee: platformFee.toString(),
        platformFeePercentage: (platformFeePercentage * 100).toString(),
        sellerAmount: sellerAmount.toString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
      // For Connect: specify application_fee_amount
      application_fee_amount: platformFee,
    });
    
    res.json({
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    });
    
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Confirm PaymentIntent endpoint
app.post('/api/payments/confirm', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'PaymentIntent ID is required' });
    }
    
    // Retrieve PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.json({
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    });
    
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ===== STRIPE CONNECT ENDPOINTS =====

// Create Connect Account for sellers
app.post('/api/connect/accounts', async (req, res) => {
  try {
    const { email, country = 'IE' } = req.body;
    
    const account = await stripe.accounts.create({
      type: 'express',
      country: country,
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    
    res.json({
      accountId: account.id,
      email: account.email,
      country: account.country
    });
  } catch (error) {
    console.error('Error creating Connect account:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create account link for onboarding
app.post('/api/connect/account-links', async (req, res) => {
  try {
    const { accountId } = req.body;
    
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: 'http://localhost:3000/reauth',
      return_url: 'http://localhost:3000/return',
      type: 'account_onboarding',
    });
    
    res.json({
      url: accountLink.url
    });
  } catch (error) {
    console.error('Error creating account link:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get account status
app.get('/api/connect/accounts/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    
    const account = await stripe.accounts.retrieve(accountId);
    
    res.json({
      id: account.id,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
      email: account.email
    });
  } catch (error) {
    console.error('Error retrieving account:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create transfer to seller
app.post('/api/transfers', async (req, res) => {
  try {
    const { amount, currency = 'eur', destination, metadata = {} } = req.body;
    
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      destination: destination,
      metadata: metadata,
    });
    
    res.json({
      id: transfer.id,
      amount: transfer.amount,
      currency: transfer.currency,
      destination: transfer.destination
    });
  } catch (error) {
    console.error('Error creating transfer:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Stripe backend server running on port ${PORT}`);
  console.log(`📱 Ready to handle PaymentIntents`);
});

module.exports = app;