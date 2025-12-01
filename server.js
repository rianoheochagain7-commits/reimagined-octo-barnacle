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
    console.log('📥 PaymentIntent request received:', JSON.stringify(req.body));
    const { amount, currency = 'eur', metadata = {}, sellerId, sellerAccountId } = req.body;
    
    // Parse and validate amount (amount comes in euros from iOS app)
    // Handle both string and number types
    console.log('🔍 Amount received:', amount, 'type:', typeof amount);
    
    let amountValue;
    if (amount === null || amount === undefined) {
      console.error('❌ Amount is null or undefined');
      return res.status(400).json({ error: 'Invalid amount. Amount is required' });
    } else if (typeof amount === 'string') {
      amountValue = parseFloat(amount);
      console.log('🔍 Parsed string amount:', amount, '→', amountValue);
    } else if (typeof amount === 'number') {
      amountValue = amount;
      console.log('🔍 Using number amount:', amountValue);
    } else {
      console.error('❌ Invalid amount type received:', typeof amount, amount);
      return res.status(400).json({ error: `Invalid amount type. Expected number or string, got ${typeof amount}` });
    }
    
    if (isNaN(amountValue) || amountValue < 0.50) {
      console.error('❌ Invalid amount value:', amountValue, '(received:', amount, 'type:', typeof amount, ')');
      return res.status(400).json({ error: `Invalid amount. Received: ${amount} (${typeof amount}), parsed: ${amountValue}. Minimum amount is €0.50` });
    }
    
    console.log('✅ Amount validated:', amountValue);
    
    // Extract boot price and delivery fee from metadata
    const bootPrice = parseFloat(metadata.bootPrice || amountValue);
    const deliveryFee = parseFloat(metadata.deliveryFee || 0);
    
    console.log(`Creating PaymentIntent: amount=€${amountValue}, bootPrice=€${bootPrice}, deliveryFee=€${deliveryFee}`);
    
    // Calculate platform fee (7% for all boots)
    // Platform fee is only on boot price, not delivery fee
    const platformFeePercentage = 0.07; // 7% for all boots
    const platformFee = Math.round(bootPrice * platformFeePercentage * 100); // Convert to cents
    const sellerAmount = Math.round(bootPrice * 100) - platformFee + Math.round(deliveryFee * 100); // Seller gets boot price - fee + delivery fee
    
    // Create PaymentIntent
    // If seller has Stripe Connect account, use Connect for split payments
    const paymentIntentParams = {
      amount: Math.round(amountValue * 100), // Convert euros to cents (total amount including delivery)
      currency: currency,
      metadata: {
        ...metadata,
        sellerId: sellerId || 'default_seller',
        sellerAccountId: sellerAccountId || '',
        platformFee: platformFee.toString(),
        platformFeePercentage: (platformFeePercentage * 100).toString(),
        sellerAmount: sellerAmount.toString(),
        bootPrice: bootPrice.toString(),
        deliveryFee: deliveryFee.toString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
    };
    
    // If seller has Stripe Connect account, use Connect for split payments
    if (sellerAccountId && sellerAccountId !== '') {
      paymentIntentParams.on_behalf_of = sellerAccountId;
      paymentIntentParams.application_fee_amount = platformFee; // Platform fee
      paymentIntentParams.transfer_data = {
        destination: sellerAccountId
      };
    }
    
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
    
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
    
    // Normalize country code to 2-character ISO format
    let countryCode = country.toUpperCase();
    
    // If country is not 2 characters, try to convert common country names
    if (countryCode.length !== 2) {
      const countryMap = {
        'IRELAND': 'IE',
        'UNITED KINGDOM': 'GB',
        'UK': 'GB',
        'UNITED STATES': 'US',
        'USA': 'US',
        'FRANCE': 'FR',
        'GERMANY': 'DE',
        'SPAIN': 'ES',
        'ITALY': 'IT',
        'NETHERLANDS': 'NL',
        'BELGIUM': 'BE',
        'PORTUGAL': 'PT',
        'AUSTRIA': 'AT',
        'SWITZERLAND': 'CH',
        'SWEDEN': 'SE',
        'NORWAY': 'NO',
        'DENMARK': 'DK',
        'FINLAND': 'FI',
        'POLAND': 'PL',
        'CZECH REPUBLIC': 'CZ',
        'GREECE': 'GR',
        'HUNGARY': 'HU',
        'ROMANIA': 'RO',
        'BULGARIA': 'BG',
        'CROATIA': 'HR',
        'SLOVAKIA': 'SK',
        'SLOVENIA': 'SI',
        'LITHUANIA': 'LT',
        'LATVIA': 'LV',
        'ESTONIA': 'EE',
        'LUXEMBOURG': 'LU',
        'MALTA': 'MT',
        'CYPRUS': 'CY'
      };
      
      countryCode = countryMap[countryCode] || 'IE'; // Default to Ireland
      console.log(`⚠️ Converted country '${country}' to '${countryCode}'`);
    }
    
    // Validate country code is 2 characters
    if (countryCode.length !== 2) {
      return res.status(400).json({ 
        error: 'Invalid country code. Must be a 2-character ISO code (e.g., IE, GB, US)' 
      });
    }
    
    const account = await stripe.accounts.create({
      type: 'express',
      country: countryCode,
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
    
    // For live mode, Stripe requires HTTPS URLs
    // Use the backend URL for return/refresh URLs since custom URL schemes don't work in live mode
    const baseURL = process.env.BASE_URL || 'https://reimagined-octo-barnacle.onrender.com';
    
    // Create HTTPS return URL that redirects to the app
    // The app can handle this URL to detect when onboarding is complete
    const returnURL = `${baseURL}/stripe-connect-return?account=${accountId}`;
    const refreshURL = `${baseURL}/stripe-connect-refresh?account=${accountId}`;
    
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshURL,
      return_url: returnURL,
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

// Handle Stripe Connect return (for redirect back to app)
app.get('/stripe-connect-return', (req, res) => {
  const accountId = req.query.account;
  // Redirect to app with account ID
  res.redirect(`bootbuys://stripe-connect-return?account=${accountId}`);
});

// Handle Stripe Connect refresh (if onboarding needs to be restarted)
app.get('/stripe-connect-refresh', (req, res) => {
  const accountId = req.query.account;
  // Redirect to app to restart onboarding
  res.redirect(`bootbuys://stripe-connect-refresh?account=${accountId}`);
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

// Create transfer to seller (fallback if Connect not used)
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

// Webhook endpoint for payment success (optional - for automatic transfers)
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle payment success
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const sellerAccountId = paymentIntent.metadata.sellerAccountId;
    
    // If using Connect, transfer happens automatically
    // This webhook is mainly for logging and notifications
    console.log('Payment succeeded:', paymentIntent.id);
    console.log('Seller account:', sellerAccountId);
  }
  
  res.json({ received: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Stripe backend server running on port ${PORT}`);
  console.log(`📱 Ready to handle PaymentIntents`);
});

module.exports = app;