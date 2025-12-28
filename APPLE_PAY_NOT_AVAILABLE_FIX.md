# 🔧 Apple Pay "Not Available" Fix

## Problem
Apple Pay shows "not available in BootBuys" error when trying to use it.

## Root Cause
The merchant ID `merchant.com.bootbuys.app` needs to be:
1. ✅ Created in Apple Developer Portal (might be missing)
2. ✅ Configured in Xcode project capabilities
3. ✅ Registered with Stripe Dashboard

---

## ✅ Step-by-Step Fix

### Step 1: Create Merchant ID in Apple Developer Portal

1. **Go to:** https://developer.apple.com/account/resources/identifiers/list
2. **Click:** "+" button (top left)
3. **Select:** "Merchant IDs" → Continue
4. **Enter:**
   - Description: `BootBuys Merchant`
   - Identifier: `merchant.com.bootbuys.app`
5. **Click:** Continue → Register

---

### Step 2: Configure in Xcode

1. **Open** your project in Xcode
2. **Select** BootBuys target
3. **Go to:** "Signing & Capabilities" tab
4. **Click:** "+ Capability" button
5. **Add:** "Apple Pay" capability
6. **Select** merchant ID: `merchant.com.bootbuys.app`
   - If it doesn't appear, make sure you created it in Step 1
   - You might need to refresh your developer account in Xcode

---

### Step 3: Register with Stripe

1. **Go to:** https://dashboard.stripe.com/settings/payment_methods/apple_pay
2. **Click:** "Add domain" or "Manage domains"
3. **For iOS apps:** Stripe automatically handles merchant certificates
4. **Verify** your Stripe account supports Apple Pay:
   - Go to: https://dashboard.stripe.com/settings/payment_methods
   - Make sure Apple Pay is enabled

---

### Step 4: Verify Entitlements File

**File:** `BootBuys/BootBuys/BootBuys.entitlements`

Should contain:
```xml
<key>com.apple.developer.in-app-payments</key>
<array>
    <string>merchant.com.bootbuys.app</string>
</array>
```

✅ This is already configured correctly!

---

### Step 5: Clean and Rebuild

1. **In Xcode:**
   - Product → Clean Build Folder (Shift+Cmd+K)
   - Delete app from device/simulator
   - Product → Build (Cmd+B)
   - Product → Run (Cmd+R)

2. **Test Apple Pay:**
   - Make sure you have a card in Apple Wallet
   - Try making a payment
   - Apple Pay button should appear

---

## 🔍 Troubleshooting

### Apple Pay button still not showing?

1. **Check device:**
   - Apple Pay only works on:
     - iPhone 6 or later
     - iPad Pro, iPad Air 2, or iPad mini 3 or later
   - Simulator has limited Apple Pay support

2. **Check Wallet:**
   - User must have at least one payment card in Apple Wallet
   - Go to: Settings → Wallet & Apple Pay
   - Add a card if needed

3. **Check merchant ID:**
   - Verify it matches in:
     - Apple Developer Portal
     - Xcode capabilities
     - Entitlements file
     - PaymentConfig.swift

4. **Check Stripe:**
   - Make sure you're using LIVE keys (pk_live_...)
   - Test keys might have limited Apple Pay support
   - Verify Apple Pay is enabled in Stripe Dashboard

5. **Check logs:**
   - Look for: `✅ PaymentManager: Apple Pay configured with merchant ID`
   - If you see: `⚠️ PaymentManager: Apple Pay not configured` → merchant ID is missing

---

## ✅ Verification Checklist

- [ ] Merchant ID created in Apple Developer Portal
- [ ] Apple Pay capability added in Xcode
- [ ] Merchant ID selected in Xcode capabilities
- [ ] Entitlements file has merchant ID
- [ ] PaymentConfig.swift has merchant ID
- [ ] Stripe account has Apple Pay enabled
- [ ] Using LIVE Stripe keys (not test keys)
- [ ] Device supports Apple Pay
- [ ] User has cards in Apple Wallet
- [ ] App rebuilt after changes

---

## 📱 Testing

1. **On a real device** (not simulator):
   - Make sure you have a card in Apple Wallet
   - Open the app
   - Try to buy a boot
   - Apple Pay button should appear in PaymentSheet

2. **If button appears but payment fails:**
   - Check Stripe Dashboard → Payments
   - Look for error messages
   - Verify merchant ID is registered with Stripe

---

## 🚨 Common Issues

### "Merchant ID not found"
- **Fix:** Create merchant ID in Apple Developer Portal (Step 1)

### "Apple Pay capability not configured"
- **Fix:** Add Apple Pay capability in Xcode (Step 2)

### "Merchant ID doesn't match"
- **Fix:** Make sure merchant ID is the same in:
  - Apple Developer Portal
  - Xcode capabilities
  - Entitlements file
  - PaymentConfig.swift

### "Apple Pay button not showing"
- **Fix:** 
  - Check device supports Apple Pay
  - Check user has cards in Wallet
  - Check you're using LIVE Stripe keys
  - Rebuild app after configuration changes

---

## 📞 Need Help?

If Apple Pay still doesn't work after following these steps:

1. **Check Xcode console** for error messages
2. **Check Stripe Dashboard** → Logs for payment errors
3. **Verify** merchant ID is registered with Stripe
4. **Test** on a real device (not simulator)

The most common issue is the merchant ID not being created in Apple Developer Portal or not being properly configured in Xcode capabilities.




























