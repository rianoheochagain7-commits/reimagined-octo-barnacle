# 💳 Seller Bank Details & Payment Receiving Feature

## ✅ What's Been Added

Sellers can now add their bank details to receive payments when their boots are sold. This uses **Stripe Connect** to securely handle seller payouts.

---

## 🎯 Key Features

### 1. **Bank Details Setup**
- Sellers can add bank details from their Profile or when listing a boot
- Secure onboarding via Stripe Connect
- Bank details are encrypted and stored by Stripe (not in your app)
- Visual status indicators show setup progress

### 2. **Automatic Payouts**
- When a buyer purchases a boot, payment is automatically split:
  - **Platform fee** (5% or 7%) goes to BootBuys
  - **Seller amount** (boot price - fee + delivery fee) goes to seller's bank account
- Payouts typically take 2-7 business days

### 3. **Listing Requirements**
- Sellers must add bank details before listing a boot
- Clear prompts guide sellers through setup
- One-time setup - bank details are saved for future listings

---

## 📱 User Flow

### For Sellers:

1. **First Time Listing:**
   - Go to Sell tab → Fill in boot details → Tap "List Your Boot"
   - If bank details not set up → Alert appears → Tap "Add Bank Details"
   - Complete Stripe Connect onboarding → Return to app
   - Bank details are now saved → Can list boots

2. **Adding Bank Details from Profile:**
   - Go to Profile tab → Tap "Bank Details" button
   - Tap "Add Bank Details" → Complete Stripe Connect onboarding
   - Status shows: Account Verified, Can Receive Payments, Payouts Enabled

3. **When Boot is Sold:**
   - Payment is processed automatically
   - Platform fee is deducted
   - Remaining amount (boot price - fee + delivery fee) is transferred to seller's bank
   - Payout appears in seller's bank account in 2-7 business days

### For Buyers:
- No changes - payment flow remains the same
- Buyers pay: Boot price + Delivery fee
- Payment is processed normally

---

## 🔧 Technical Implementation

### 1. **UserProfile Model** (`UserProfile.swift`)
- Added `stripeConnectAccountId: String?` field
- Stores Stripe Connect account ID for seller payouts
- Updated Firebase conversion methods

### 2. **BankDetailsView** (`BankDetailsView.swift`)
- New view for sellers to set up bank details
- Shows setup status (Account Verified, Can Receive Payments, Payouts Enabled)
- Opens Stripe Connect onboarding in Safari
- Handles account creation and status checking

### 3. **Stripe Connect API** (`StripeBackendAPI.swift`)
- `createConnectAccount()` - Creates Stripe Connect account for seller
- `createAccountLink()` - Generates onboarding URL
- `getAccountStatus()` - Checks account verification status
- Updated `createPaymentIntent()` to accept `sellerAccountId`

### 4. **SellView** (`SellView.swift`)
- Validates bank details before allowing listing
- Shows alert if bank details not set up
- Opens BankDetailsView when needed

### 5. **PaymentView** (`PaymentView.swift`)
- Fetches seller's Stripe Connect account ID
- Passes account ID to PaymentManager when creating payment intent

### 6. **PaymentManager** (`PaymentManager.swift`)
- Updated to accept and pass `sellerAccountId` to backend

### 7. **Backend** (`server.js`)
- Updated `/api/payment-intents` endpoint:
  - Accepts `sellerAccountId` parameter
  - Uses Stripe Connect for split payments if seller account exists
  - Sets `on_behalf_of`, `application_fee_amount`, and `transfer_data`
  - Platform fee is automatically deducted
  - Seller receives remaining amount automatically

---

## 💰 Payment Flow with Stripe Connect

### Without Stripe Connect (Old):
1. Buyer pays → Payment goes to BootBuys account
2. Manual transfer needed to seller (not implemented)

### With Stripe Connect (New):
1. Buyer pays → Payment goes to BootBuys account
2. **Stripe automatically splits payment:**
   - Platform fee (5% or 7%) stays with BootBuys
   - Seller amount (boot price - fee + delivery fee) transfers to seller's Stripe Connect account
3. **Stripe automatically pays seller:**
   - Funds transfer to seller's bank account
   - Takes 2-7 business days

---

## 📋 Platform Fee Calculation

### Fee Structure:
- **Boots under €100:** 5% platform fee
- **Boots €100+:** 7% platform fee
- **Fee applies to:** Boot price only (not delivery fee)

### Example:
- Boot price: €50
- Delivery fee: €5
- **Total buyer pays:** €55
- **Platform fee (5%):** €2.50 (on €50 boot price)
- **Seller receives:** €47.50 (boot price - fee) + €5 (delivery fee) = **€52.50**

---

## 🔒 Security & Privacy

- ✅ Bank details are **NOT stored in your app or Firebase**
- ✅ All bank details are stored securely by Stripe
- ✅ Stripe Connect handles all compliance (KYC, AML, etc.)
- ✅ Sellers only see their own account status
- ✅ Platform never sees seller's bank account numbers

---

## 🚀 Setup Requirements

### For Production:
1. **Stripe Connect must be enabled** in your Stripe Dashboard
2. **Webhook endpoint** (optional but recommended):
   - Add webhook URL: `https://your-backend.com/api/webhooks/stripe`
   - Events to listen for: `payment_intent.succeeded`
   - Set `STRIPE_WEBHOOK_SECRET` in `.env`

3. **Return URL Configuration:**
   - Stripe Connect return URL: `bootbuys://stripe-connect-return`
   - Make sure your app handles this URL scheme

---

## 📝 Database Structure

### UserProfile Document (Firestore):
```json
{
  "id": "user-123",
  "username": "seller123",
  "email": "seller@example.com",
  "stripeConnectAccountId": "acct_1234567890",  // NEW FIELD
  ...
}
```

### Order Document (Firestore):
```json
{
  "id": "order-123",
  "bootId": "boot-456",
  "buyerId": "buyer-789",
  "sellerId": "user-123",
  "totalPrice": 55.0,
  "platformFee": 2.50,
  "sellerAmount": 52.50,
  ...
}
```

---

## ✅ Testing Checklist

- [ ] Seller can add bank details from Profile
- [ ] Seller can add bank details when listing boot
- [ ] Bank details setup opens Stripe Connect onboarding
- [ ] Account status shows correctly (Verified, Payments Enabled, Payouts Enabled)
- [ ] Seller cannot list boot without bank details
- [ ] Payment processes correctly with seller account ID
- [ ] Platform fee is calculated correctly
- [ ] Seller receives correct amount (boot price - fee + delivery fee)
- [ ] Payment metadata includes seller account ID

---

## 🐛 Troubleshooting

### Seller Can't Add Bank Details:
- Check Stripe Connect is enabled in Stripe Dashboard
- Verify Stripe API keys are correct
- Check backend server is running
- Verify return URL scheme is configured

### Payment Not Splitting:
- Verify seller has `stripeConnectAccountId` set in profile
- Check backend logs for Stripe Connect errors
- Verify Stripe Connect account is verified and payouts enabled

### Seller Not Receiving Payouts:
- Check Stripe Dashboard → Connect → Accounts → Seller account
- Verify account status: "Charges enabled" and "Payouts enabled"
- Check payout schedule in Stripe Dashboard
- Payouts take 2-7 business days (normal)

---

## 📚 Resources

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Stripe Connect Express Accounts](https://stripe.com/docs/connect/express-accounts)
- [Stripe Connect Payouts](https://stripe.com/docs/connect/payouts)

---

## 🎉 Summary

Sellers can now:
1. ✅ Add bank details securely via Stripe Connect
2. ✅ Receive automatic payouts when boots are sold
3. ✅ See their account status and setup progress
4. ✅ List boots only after bank details are set up

Buyers:
- ✅ No changes - payment flow remains the same

Platform:
- ✅ Automatic fee collection
- ✅ Automatic seller payouts
- ✅ No manual transfers needed

**Everything is automated!** 🚀
































