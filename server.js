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
    
    // Validate amount (amount comes in euros from iOS app)
    if (!amount || amount < 0.50) {
      return res.status(400).json({ error: 'Invalid amount. Minimum amount is €0.50' });
    }
    
    // Calculate platform fee (5% for boots under €100, 7% for boots €100+)
    const platformFeePercentage = amount >= 100 ? 0.07 : 0.05; // 7% for €100+, 5% for under €100
    const platformFee = Math.round(amount * platformFeePercentage * 100); // Convert to cents
    const sellerAmount = Math.round(amount * 100) - platformFee;
    
    // Create PaymentIntent
    // Note: If using Stripe Connect, you would need to specify on_behalf_of and application_fee_amount
    // For now, we'll create a standard PaymentIntent. Connect can be added later if needed.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert euros to cents
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
      // Apple Pay is automatically included when using PaymentSheet on iOS
      // and when the device/user supports it
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

// Create Connect Account for sellers (INDIVIDUAL accounts - not businesses!)
app.post('/api/connect/accounts', async (req, res) => {
  try {
    const { email, country = 'IE', firstName, lastName } = req.body;
    
    // Normalize country code
    let normalizedCountry = (country || 'IE').toUpperCase().trim();
    if (normalizedCountry === 'IRELAND') normalizedCountry = 'IE';
    if (normalizedCountry === 'UNITED KINGDOM' || normalizedCountry === 'UK') normalizedCountry = 'GB';
    
    console.log(`Creating INDIVIDUAL Connect account for ${email} in ${normalizedCountry}`);
    
    const account = await stripe.accounts.create({
      type: 'express',
      country: normalizedCountry,
      email: email,
      business_type: 'individual', // KEY: This makes it a personal account, not business!
      capabilities: {
        transfers: { requested: true }, // Only transfers - no card_payments needed
      },
      // Pre-fill individual info to reduce onboarding friction
      individual: {
        email: email,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
      },
      settings: {
        payouts: {
          schedule: {
            interval: 'manual', // We control when payouts happen
          },
        },
      },
    });
    
    console.log(`✅ Created individual Connect account: ${account.id}`);
    
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
    
    // Use the deployed backend URL for redirects, which will then redirect to the app
    const baseUrl = process.env.BASE_URL || 'https://bootbuys-stripe.onrender.com';
    
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${baseUrl}/stripe-connect-refresh?accountId=${accountId}`,
      return_url: `${baseUrl}/stripe-connect-return?accountId=${accountId}`,
      type: 'account_onboarding',
      collection_options: {
        fields: 'eventually_due', // Only collect what's required, not everything upfront
        future_requirements: 'omit', // Don't ask for future requirements
      },
    });
    
    console.log(`✅ Created account link for ${accountId}: ${accountLink.url}`);
    
    res.json({
      url: accountLink.url
    });
  } catch (error) {
    console.error('Error creating account link:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe Connect return handler - redirects back to the app
app.get('/stripe-connect-return', (req, res) => {
  const { accountId } = req.query;
  console.log(`✅ Stripe Connect onboarding completed for account: ${accountId}`);
  // Redirect to the app using deep link
  res.redirect(`bootbuys://stripe-connect-return?accountId=${accountId}&success=true`);
});

// Stripe Connect refresh handler - user needs to restart onboarding
app.get('/stripe-connect-refresh', (req, res) => {
  const { accountId } = req.query;
  console.log(`⚠️ Stripe Connect onboarding refresh needed for account: ${accountId}`);
  // Redirect to the app to retry
  res.redirect(`bootbuys://stripe-connect-refresh?accountId=${accountId}`);
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

// ===== PAYMENT RELEASE (Called when buyer confirms delivery) =====
app.post('/api/payments/release', async (req, res) => {
  try {
    const { paymentIntentId, sellerConnectAccountId, orderId } = req.body;
    
    console.log(`💰 Releasing payment for order ${orderId}`);
    console.log(`   PaymentIntent: ${paymentIntentId}`);
    console.log(`   Seller Account: ${sellerConnectAccountId}`);
    
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'PaymentIntent ID is required' });
    }
    
    // Get the PaymentIntent to find the amount
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: `Payment not successful. Status: ${paymentIntent.status}` });
    }
    
    const totalAmount = paymentIntent.amount; // Already in cents
    const platformFee = parseInt(paymentIntent.metadata.platformFee || '0');
    const sellerAmount = totalAmount - platformFee;
    
    console.log(`   Total: €${(totalAmount/100).toFixed(2)}, Platform Fee: €${(platformFee/100).toFixed(2)}, Seller Gets: €${(sellerAmount/100).toFixed(2)}`);
    
    // If seller has a Connect account, transfer to them
    if (sellerConnectAccountId && sellerConnectAccountId.startsWith('acct_')) {
      const transfer = await stripe.transfers.create({
        amount: sellerAmount,
        currency: paymentIntent.currency,
        destination: sellerConnectAccountId,
        transfer_group: orderId,
        metadata: {
          orderId: orderId,
          paymentIntentId: paymentIntentId,
        },
      });
      
      console.log(`✅ Transfer created: ${transfer.id} - €${(sellerAmount/100).toFixed(2)} to ${sellerConnectAccountId}`);
      
      res.json({
        success: true,
        transferId: transfer.id,
        amount: sellerAmount,
        message: 'Payment released to seller'
      });
    } else {
      // No Connect account - log for manual payout
      console.log(`⚠️ No Connect account for seller. Manual payout needed for €${(sellerAmount/100).toFixed(2)}`);
      res.json({
        success: true,
        transferId: null,
        amount: sellerAmount,
        message: 'Payment recorded. Manual payout required (no Connect account).'
      });
    }
    
  } catch (error) {
    console.error('Error releasing payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== REFUND ENDPOINT =====
app.post('/api/payments/refund', async (req, res) => {
  try {
    const { paymentIntentId, reason = 'requested_by_customer' } = req.body;
    
    console.log(`💸 Processing refund for PaymentIntent: ${paymentIntentId}`);
    
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'PaymentIntent ID is required' });
    }
    
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: reason,
    });
    
    console.log(`✅ Refund created: ${refund.id}`);
    
    res.json({
      success: true,
      refundId: refund.id,
      amount: refund.amount,
      status: refund.status
    });
    
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== PUSH NOTIFICATIONS (via Firebase Admin SDK) =====
// Note: For production, initialize Firebase Admin SDK here
// For now, this endpoint logs the notification request

app.post('/api/notifications/send', async (req, res) => {
  try {
    const { userId, title, body, data = {} } = req.body;
    
    console.log(`📱 Notification Request:`);
    console.log(`   To: ${userId}`);
    console.log(`   Title: ${title}`);
    console.log(`   Body: ${body}`);
    console.log(`   Data: ${JSON.stringify(data)}`);
    
    // TODO: Implement Firebase Admin SDK to send actual push notifications
    // For now, just log and return success
    // In production, you would:
    // 1. Fetch user's FCM token from Firebase
    // 2. Use Firebase Admin SDK to send the notification
    
    res.json({
      success: true,
      message: 'Notification logged (Firebase Admin SDK not configured)'
    });
    
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== AUTO-COMPLETE ORDERS (Cron job endpoint) =====
// This endpoint should be called periodically (e.g., every hour) by a scheduler
// It auto-completes orders that have been shipped for more than 5 days

app.post('/api/orders/auto-complete', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    // Simple API key check for security
    if (apiKey !== process.env.CRON_API_KEY && apiKey !== 'bootbuys-cron-2024') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    console.log('🔄 Auto-complete: Checking for orders to auto-complete...');
    
    // This would connect to Firebase to:
    // 1. Find all orders with status = 'shipped'
    // 2. Check if shippedAt is more than 5 days ago
    // 3. Update status to 'completed'
    // 4. Release payment to seller
    
    // For now, log the request - Firebase Admin SDK needed for actual implementation
    console.log('⚠️ Auto-complete: Firebase Admin SDK not configured');
    console.log('   To enable: Add Firebase Admin credentials to server');
    
    res.json({
      success: true,
      message: 'Auto-complete check logged. Firebase Admin SDK needed for full implementation.',
      checkedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in auto-complete:', error);
    res.status(500).json({ error: error.message });
  }
});

// Manual endpoint to check and complete a specific order after 5 days
app.post('/api/orders/check-auto-complete', async (req, res) => {
  try {
    const { orderId, shippedAt, paymentIntentId, sellerConnectAccountId } = req.body;
    
    if (!orderId || !shippedAt) {
      return res.status(400).json({ error: 'orderId and shippedAt are required' });
    }
    
    const shippedDate = new Date(shippedAt);
    const now = new Date();
    const daysSinceShipped = (now - shippedDate) / (1000 * 60 * 60 * 24);
    
    console.log(`📦 Order ${orderId}: Shipped ${daysSinceShipped.toFixed(1)} days ago`);
    
    if (daysSinceShipped >= 5) {
      console.log(`✅ Order ${orderId}: Eligible for auto-complete`);
      
      // If we have payment info, release the payment
      if (paymentIntentId) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
          
          if (paymentIntent.status === 'succeeded') {
            const totalAmount = paymentIntent.amount;
            const platformFee = parseInt(paymentIntent.metadata.platformFee || '0');
            const sellerAmount = totalAmount - platformFee;
            
            if (sellerConnectAccountId && sellerConnectAccountId.startsWith('acct_')) {
              const transfer = await stripe.transfers.create({
                amount: sellerAmount,
                currency: paymentIntent.currency,
                destination: sellerConnectAccountId,
                transfer_group: orderId,
                metadata: {
                  orderId: orderId,
                  reason: 'auto_complete_after_5_days'
                },
              });
              
              console.log(`💰 Auto-complete: Payment released for order ${orderId}: €${(sellerAmount/100).toFixed(2)}`);
              
              return res.json({
                success: true,
                autoCompleted: true,
                daysSinceShipped: daysSinceShipped,
                transferId: transfer.id,
                amount: sellerAmount
              });
            }
          }
        } catch (paymentError) {
          console.error('Error releasing payment:', paymentError);
        }
      }
      
      return res.json({
        success: true,
        autoCompleted: true,
        daysSinceShipped: daysSinceShipped,
        message: 'Order eligible for auto-complete. Update order status to completed.'
      });
    } else {
      const daysRemaining = (5 - daysSinceShipped).toFixed(1);
      return res.json({
        success: true,
        autoCompleted: false,
        daysSinceShipped: daysSinceShipped,
        daysRemaining: daysRemaining,
        message: `Order will auto-complete in ${daysRemaining} days if buyer doesn't respond`
      });
    }
    
  } catch (error) {
    console.error('Error checking auto-complete:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== EMAIL NOTIFICATIONS =====
// Note: For production, configure a proper email service (SendGrid, Mailgun, etc.)
// For now, this logs the email that would be sent

app.post('/api/emails/send', async (req, res) => {
  try {
    const { to, subject, type, data } = req.body;
    
    console.log(`📧 Email Request:`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Type: ${type}`);
    console.log(`   Data: ${JSON.stringify(data)}`);
    
    // Email templates based on type
    let emailBody = '';
    switch (type) {
      case 'order_placed':
        emailBody = `
          Hi ${data.buyerName},
          
          Your order has been placed successfully!
          
          Order Details:
          - Item: ${data.bootName}
          - Price: €${data.price}
          - Order ID: ${data.orderId}
          
          The seller will ship your item soon.
          
          Thanks for using BootBuys!
        `;
        break;
        
      case 'new_sale':
        emailBody = `
          Congratulations ${data.sellerName}!
          
          You made a sale! 🎉
          
          Order Details:
          - Item: ${data.bootName}
          - Price: €${data.price}
          - Buyer: ${data.buyerName}
          - Order ID: ${data.orderId}
          
          Please ship the item as soon as possible.
          The buyer's address is available in the app.
          
          Thanks for selling on BootBuys!
        `;
        break;
        
      case 'order_shipped':
        emailBody = `
          Hi ${data.buyerName},
          
          Great news! Your order has been shipped! 📦
          
          Order Details:
          - Item: ${data.bootName}
          ${data.trackingNumber ? `- Tracking Number: ${data.trackingNumber}` : ''}
          
          Once your item arrives, please confirm delivery in the app.
          
          Thanks for using BootBuys!
        `;
        break;
        
      case 'payment_released':
        emailBody = `
          Hi ${data.sellerName},
          
          Payment has been released! 💰
          
          Order Details:
          - Item: ${data.bootName}
          - Amount: €${data.amount}
          
          The money will arrive in your bank account within 2-3 business days.
          
          Thanks for selling on BootBuys!
        `;
        break;
        
      default:
        emailBody = `Email type: ${type}\nData: ${JSON.stringify(data)}`;
    }
    
    console.log(`📧 Email Body:\n${emailBody}`);
    
    // TODO: Implement actual email sending with SendGrid/Mailgun
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({ to, from: 'noreply@bootbuys.com', subject, text: emailBody });
    
    res.json({
      success: true,
      message: 'Email logged (email service not configured)',
      emailPreview: emailBody.substring(0, 200) + '...'
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Stripe backend server running on port ${PORT}`);
  console.log(`📱 Ready to handle PaymentIntents`);
});

module.exports = app;