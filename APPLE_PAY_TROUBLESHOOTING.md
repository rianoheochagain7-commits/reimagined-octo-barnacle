# 🔍 Apple Pay Troubleshooting (Merchant ID Already Set Up)

## ✅ You Don't Need Render for Apple Pay

**Render is ONLY for:**
- Backend server (Stripe payment processing)
- Making API calls to Stripe

**Apple Pay is configured:**
- In your app code
- In Apple Developer Portal
- In Xcode capabilities
- **NOT** in Render

---

## 🔍 If Merchant ID is Already Set Up

If you've already created the merchant ID but Apple Pay still shows "not available", check these:

### 1. Check Xcode Capabilities

**Most Common Issue:** Merchant ID not selected in Xcode

1. Open Xcode → BootBuys target
2. Go to "Signing & Capabilities" tab
3. Find "Apple Pay" capability
4. **Check:** Is `merchant.com.bootbuys.app` selected in the dropdown?
   - If not, select it
   - If it's not in the list, refresh your developer account

### 2. Check Device & Wallet

- **Device:** Must support Apple Pay (iPhone 6+, iPad Air 2+, etc.)
- **Wallet:** Must have at least one payment card added
- **Simulator:** Apple Pay has limited support in simulator

### 3. Check Stripe Configuration

Even if merchant ID is set up, Stripe needs to know about it:

1. Go to: https://dashboard.stripe.com/settings/payment_methods/apple_pay
2. Check if Apple Pay is enabled
3. For iOS apps, Stripe should automatically handle merchant certificates
4. Make sure you're using **LIVE keys** (not test keys) for full Apple Pay support

### 4. Check Xcode Console Logs

When you try to pay, check Xcode console for:

**✅ Should see:**
```
✅ PaymentManager: Apple Pay configured with merchant ID: merchant.com.bootbuys.app
✅ PaymentManager: Apple Pay country code: IE
```

**❌ If you see:**
```
⚠️ PaymentManager: Apple Pay not configured (merchant ID missing)
```
→ Merchant ID is not being read correctly

### 5. Clean Rebuild

After any changes:
1. Product → Clean Build Folder (Shift+Cmd+K)
2. Delete app from device
3. Rebuild (Cmd+B)
4. Run (Cmd+R)

---

## 🚨 Common Issues Even After Setup

### Issue 1: Merchant ID Not Selected in Xcode
- **Symptom:** Apple Pay shows "not available"
- **Fix:** Go to Xcode → Capabilities → Apple Pay → Select merchant ID

### Issue 2: Using Test Keys
- **Symptom:** Apple Pay might not work with test keys
- **Fix:** Use LIVE Stripe keys (pk_live_...)

### Issue 3: Device Doesn't Support
- **Symptom:** Apple Pay button doesn't appear
- **Fix:** Test on iPhone 6+ or iPad Air 2+

### Issue 4: No Cards in Wallet
- **Symptom:** Apple Pay button doesn't appear
- **Fix:** Add a card to Apple Wallet

### Issue 5: Merchant ID Not Registered with Stripe
- **Symptom:** Apple Pay button appears but payment fails
- **Fix:** Verify merchant ID in Stripe Dashboard

---

## ✅ Quick Checklist

- [ ] Merchant ID exists in Apple Developer Portal
- [ ] Merchant ID is **selected** in Xcode capabilities (not just added)
- [ ] Entitlements file has merchant ID
- [ ] PaymentConfig.swift has merchant ID
- [ ] Using LIVE Stripe keys (pk_live_...)
- [ ] Device supports Apple Pay
- [ ] User has cards in Wallet
- [ ] App rebuilt after changes
- [ ] Check Xcode console for Apple Pay logs

---

## 📱 Test Steps

1. **Check Xcode console** when opening PaymentSheet
2. **Look for:** `✅ PaymentManager: Apple Pay configured`
3. **If you see that:** Apple Pay should work (check device/Wallet)
4. **If you don't see that:** Merchant ID not being read

---

## 💡 Most Likely Issue

If merchant ID is already created, the most common issue is:
**Merchant ID not selected in Xcode capabilities**

Even if the capability is added, you need to **select** the merchant ID from the dropdown in Xcode.




























