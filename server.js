require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' })); // Limit payload for 100+ user scale

// Create PaymentIntent endpoint with Connect support
app.post('/api/payment-intents', async (req, res) => {
  try {
    const { amount, currency = 'eur', metadata = {}, sellerId, sellerStripeAccountId, deliveryFee = 0 } = req.body;
    
    // Validate amount (amount comes in euros from iOS app)
    if (!amount || amount < 0.50) {
      return res.status(400).json({ error: 'Invalid amount. Minimum amount is €0.50' });
    }
    
    // CRITICAL: Validate seller Stripe account ID
    const hasValidSellerAccount = sellerStripeAccountId && 
                                   typeof sellerStripeAccountId === 'string' && 
                                   sellerStripeAccountId.startsWith('acct_') &&
                                   sellerStripeAccountId.length > 10;
    
    // If no valid seller account, reject the payment
    if (!hasValidSellerAccount) {
      console.error(`❌ REJECTED: No valid Stripe Connect account for seller ${sellerId}`);
      console.error(`   - Received sellerStripeAccountId: "${sellerStripeAccountId}"`);
      return res.status(400).json({ 
        error: 'Seller has not set up their payment account. The seller must complete Stripe verification before they can receive payments.' 
      });
    }
    
    // Verify the seller's Stripe account is active
    try {
      const sellerAccount = await stripe.accounts.retrieve(sellerStripeAccountId);
      if (!sellerAccount.charges_enabled) {
        console.error(`❌ REJECTED: Seller account ${sellerStripeAccountId} cannot accept charges`);
        return res.status(400).json({ 
          error: 'Seller\'s payment account is not fully verified. They need to complete their Stripe verification.' 
        });
      }
      console.log(`✅ Seller account verified: charges_enabled=${sellerAccount.charges_enabled}, payouts_enabled=${sellerAccount.payouts_enabled}`);
    } catch (accountError) {
      console.error(`❌ REJECTED: Could not verify seller account ${sellerStripeAccountId}:`, accountError.message);
      return res.status(400).json({ 
        error: 'Could not verify seller\'s payment account. Please try again.' 
      });
    }
    
    // Calculate platform fee (7% for all boots - fee only on boot price, not delivery)
    const platformFeePercentage = 0.07; // 7% for all boots
    const platformFee = Math.round(amount * platformFeePercentage * 100); // Convert to cents
    const totalAmount = Math.round(amount * 100) + Math.round((deliveryFee || 0) * 100); // Total with delivery
    const sellerReceives = totalAmount - platformFee; // Seller gets total minus platform fee
    
    console.log(`💰 Using Stripe Connect for seller: ${sellerStripeAccountId}`);
    console.log(`💰 ===== PAYMENT BREAKDOWN =====`);
    console.log(`💰 Boot Price: €${amount.toFixed(2)}`);
    console.log(`💰 Delivery Fee: €${(deliveryFee || 0).toFixed(2)}`);
    console.log(`💰 BootBuys Fee (7% of boot): €${(platformFee / 100).toFixed(2)}`);
    console.log(`💰 Buyer Pays Total: €${(totalAmount / 100).toFixed(2)}`);
    console.log(`💰 Seller Receives (before Stripe fees): €${(sellerReceives / 100).toFixed(2)}`);
    console.log(`💰 ===============================`);
    
    // PaymentIntent configuration with Connect
    // Use application_fee_amount - Stripe automatically transfers the rest to the seller
    const paymentIntentParams = {
      amount: totalAmount, // Total amount buyer pays (boot price + delivery)
      currency: currency,
      capture_method: 'manual', // Hold payment in escrow until delivery confirmed
      application_fee_amount: platformFee, // Platform fee goes to BootBuys (7%)
      transfer_data: {
        destination: sellerStripeAccountId // Seller receives the rest automatically
      },
      metadata: {
        ...metadata,
        sellerId: sellerId || 'unknown',
        sellerStripeAccountId: sellerStripeAccountId,
        platformFee: platformFee.toString(),
        platformFeePercentage: '7',
        sellerReceives: sellerReceives.toString(),
        bootPrice: Math.round(amount * 100).toString(),
        deliveryFee: Math.round((deliveryFee || 0) * 100).toString()
      },
      payment_method_types: ['card', 'revolut_pay']
    };
    
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

// Debug endpoint to check seller account status
app.get('/api/debug/seller/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    console.log(`🔍 DEBUG: Checking seller account: ${accountId}`);
    
    if (!accountId || !accountId.startsWith('acct_')) {
      return res.json({ 
        valid: false, 
        error: 'Invalid account ID format',
        received: accountId 
      });
    }
    
    const account = await stripe.accounts.retrieve(accountId);
    res.json({
      valid: true,
      accountId: account.id,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
      requirements: account.requirements?.currently_due || []
    });
  } catch (error) {
    res.json({ 
      valid: false, 
      error: error.message 
    });
  }
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
    const { accountId, refreshUrl, returnUrl } = req.body;
    
    if (!accountId || typeof accountId !== 'string') {
      return res.status(400).json({ error: 'accountId is required' });
    }
    if (!accountId.startsWith('acct_')) {
      return res.status(400).json({ error: 'Invalid Stripe account format' });
    }

    // Ensure account has capabilities required for account_onboarding (fixes legacy accounts)
    try {
      const account = await stripe.accounts.retrieve(accountId);
      const caps = account.capabilities || {};
      const needsUpdate = !caps.card_payments?.requested || !caps.transfers?.requested;
      if (needsUpdate) {
        await stripe.accounts.update(accountId, {
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
        });
        console.log(`Updated capabilities for account ${accountId}`);
      }
    } catch (retrieveErr) {
      console.error('Account retrieve/update failed:', retrieveErr);
      const msg = retrieveErr.code === 'resource_missing' ? 'Stripe account not found. Please connect with Stripe again.' : retrieveErr.message;
      return res.status(500).json({ error: msg });
    }
    
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl || 'bootbuys://stripe-refresh',
      return_url: returnUrl || 'bootbuys://stripe-return',
      type: 'account_onboarding',
    });
    
    if (!accountLink?.url) {
      throw new Error('Stripe did not return an onboarding URL');
    }
    
    res.json({ url: accountLink.url });
  } catch (error) {
    console.error('Error creating account link:', error);
    const code = error.code || error.type;
    const rawMsg = (error.message || String(error)).toLowerCase();
    let msg = 'Failed to create Stripe link. Please try again.';
    if (code === 'resource_missing' || rawMsg.includes('no such account')) {
      msg = 'Stripe account not found. Please tap "Connect with Stripe" to set up again.';
    } else if (rawMsg.includes('capabilities')) {
      msg = 'Account setup issue. Please try again.';
    } else if (rawMsg.includes('invalid') || rawMsg.includes('invalid_request')) {
      msg = 'Invalid Stripe account. Please connect with Stripe again.';
    }
    res.status(500).json({ error: msg });
  }
});

// Get account status
app.get('/api/connect/accounts/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    
    const account = await stripe.accounts.retrieve(accountId);
    
    console.log(`📊 Checking Stripe account status for: ${accountId}`);
    console.log(`   - charges_enabled: ${account.charges_enabled}`);
    console.log(`   - payouts_enabled: ${account.payouts_enabled}`);
    console.log(`   - details_submitted: ${account.details_submitted}`);
    
    res.json({
      id: account.id,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
      email: account.email,
      requirements: account.requirements || {
        currently_due: [],
        eventually_due: [],
        disabled_reason: null
      }
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

// ===== PAYMENT RELEASE ENDPOINT =====

// Release payment to seller after buyer confirms delivery
app.post('/api/payments/release', async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;
    
    console.log(`🔄 Processing payment release for order ${orderId}, PaymentIntent: ${paymentIntentId}`);
    
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'PaymentIntent ID is required' });
    }
    
    // Retrieve the PaymentIntent with expanded data
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['latest_charge', 'transfer_data']
    });
    
    console.log(`📋 PaymentIntent status: ${paymentIntent.status}`);
    console.log(`📋 on_behalf_of: ${paymentIntent.on_behalf_of || 'NOT SET'}`);
    console.log(`📋 application_fee_amount: ${paymentIntent.application_fee_amount || 'NOT SET'}`);
    console.log(`📋 transfer_data: ${JSON.stringify(paymentIntent.transfer_data) || 'NOT SET'}`);
    
    // Check if payment is already captured
    if (paymentIntent.status === 'succeeded') {
      const charge = paymentIntent.latest_charge;
      if (charge && charge.captured) {
        console.log(`✅ Payment already captured for order ${orderId}`);
        return res.json({
          success: true,
          message: 'Payment already captured',
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
          sellerAccountId: paymentIntent.on_behalf_of,
          platformFee: paymentIntent.application_fee_amount
        });
      }
    }
    
    // Check if payment can be captured
    if (paymentIntent.status !== 'requires_capture') {
      console.error(`❌ Cannot capture payment - status is ${paymentIntent.status}, expected 'requires_capture'`);
      return res.status(400).json({ 
        error: `Payment cannot be captured. Current status: ${paymentIntent.status}` 
      });
    }
    
    // Capture the payment (releases from escrow)
    const capturedPayment = await stripe.paymentIntents.capture(paymentIntentId);
    
    console.log(`✅ Payment captured and released for order ${orderId}`);
    console.log(`💰 Total Amount: €${(capturedPayment.amount / 100).toFixed(2)}`);
    
    // Verify Stripe Connect was used
    if (capturedPayment.on_behalf_of) {
      console.log(`💰 ✅ Payment split via Stripe Connect:`);
      console.log(`   - Seller Account: ${capturedPayment.on_behalf_of}`);
      console.log(`   - Platform Fee (BootBuys): €${(capturedPayment.application_fee_amount / 100).toFixed(2)}`);
      console.log(`   - Seller Receives: €${(capturedPayment.transfer_data?.amount ? (capturedPayment.transfer_data.amount / 100).toFixed(2) : 'calculated by Stripe')}`);
    } else {
      console.error(`❌ WARNING: Payment was NOT split via Connect - it went to platform account!`);
    }
    
    res.json({
      success: true,
      paymentIntentId: capturedPayment.id,
      status: capturedPayment.status,
      amount: capturedPayment.amount,
      currency: capturedPayment.currency,
      captured: true,
      sellerAccountId: capturedPayment.on_behalf_of || null,
      platformFee: capturedPayment.application_fee_amount || 0,
      sellerReceives: capturedPayment.transfer_data?.amount || null,
      connectUsed: !!capturedPayment.on_behalf_of
    });
    
  } catch (error) {
    console.error('Error releasing payment:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ===== REFUND ENDPOINT =====

// Process refund for returned items
app.post('/api/payments/refund', async (req, res) => {
  try {
    const { paymentIntentId, orderId, amount, reason } = req.body;
    
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'PaymentIntent ID is required' });
    }
    
    // Retrieve the PaymentIntent to get the charge ID
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (!paymentIntent.latest_charge) {
      return res.status(400).json({ error: 'Payment not captured yet. Cannot refund uncaptured payment.' });
    }
    
    // Create refund
    const refundAmount = amount ? Math.round(amount * 100) : null; // If amount specified, use it; otherwise full refund
    const refund = await stripe.refunds.create({
      charge: paymentIntent.latest_charge,
      amount: refundAmount, // null = full refund
      reason: reason || 'requested_by_customer',
      metadata: {
        orderId: orderId || 'unknown',
        reason: reason || 'return'
      }
    });
    
    console.log(`✅ Refund processed: ${refund.id} for order ${orderId}`);
    
    res.json({
      id: refund.id,
      amount: refund.amount,
      currency: refund.currency,
      status: refund.status,
      reason: refund.reason
    });
    
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check for load balancers / monitoring (100+ user scale)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Stripe backend server running on port ${PORT}`);
  console.log(`📱 Ready to handle PaymentIntents`);
  console.log(`💰 Refund endpoint available at /api/payments/refund`);
});

module.exports = app;