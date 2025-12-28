# 🔍 Apple Pay Diagnostic - Step by Step

## First: What Error Do You See?

**Tell me:**
1. Does Apple Pay button appear in PaymentSheet? (Yes/No)
2. If yes, what happens when you tap it?
3. If no, what error message do you see?
4. Are you testing on a real device or simulator?

---

## ✅ Quick Checks (Do These First)

### 1. Check Xcode Console Logs

**When you try to pay, look at Xcode console:**

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

**Share what you see in the console!**

---

### 2. Check Xcode Capabilities

**CRITICAL - Most Common Issue:**

1. **Open Xcode** → Select BootBuys project
2. **Select BootBuys target** (not project)
3. **Go to:** "Signing & Capabilities" tab
4. **Find:** "Apple Pay" capability section
5. **Check:**
   - Is "Apple Pay" capability added? (should see it in list)
   - Is `merchant.com.bootbuys.app` **selected** in the dropdown?
   - If dropdown is empty or shows "None" → **This is the problem!**

**If merchant ID is NOT selected:**
1. Click the dropdown
2. Select `merchant.com.bootbuys.app`
3. If it's not in the list → Go to Step 3

---

### 3. Check Apple Developer Portal

**Verify Merchant ID exists:**

1. **Go to:** https://developer.apple.com/account/resources/identifiers/list
2. **Filter by:** "Merchant IDs"
3. **Find:** `merchant.com.bootbuys.app`
4. **Check:**
   - Does it exist? (If NO → Create it - see Step 4)
   - Status should be "Active"
   - No errors or warnings

**If it doesn't exist, create it:**
1. Click "+" button
2. Select "Merchant IDs"
3. Description: `BootBuys Merchant`
4. Identifier: `merchant.com.bootbuys.app`
5. Click "Continue" → "Register"

---

### 4. Check App ID Configuration

**Verify App ID has Apple Pay enabled:**

1. **Go to:** https://developer.apple.com/account/resources/identifiers/list
2. **Filter by:** "App IDs"
3. **Find:** `com.roh.bootbuys.app` (your bundle ID)
4. **Click** to edit it
5. **Check:** Is "Apple Pay" capability **checked/enabled**?
   - ✅ If YES → Go to Step 5
   - ❌ If NO → Enable it:
     - Check the "Apple Pay" checkbox
     - Click "Save"
     - Wait 2-3 minutes

---

### 5. Refresh Provisioning Profile

**After enabling Apple Pay in App ID:**

1. **In Xcode:**
   - Go to "Signing & Capabilities"
   - **Uncheck** "Automatically manage signing"
   - Wait 2 seconds
   - **Check** "Automatically manage signing" again
   - This regenerates the provisioning profile

2. **Or manually refresh:**
   - Xcode → Preferences → Accounts
   - Select your Apple ID
   - Click "Download Manual Profiles"
   - Go back to Signing & Capabilities
   - Select the refreshed profile

---

### 6. Check Device & Wallet

**On your test device:**

- ✅ **Device:** Must support Apple Pay (iPhone 6+, iPad Air 2+)
- ✅ **Wallet:** Must have at least one payment card added
- ✅ **Settings:** Apple Pay enabled in Settings → Wallet & Apple Pay
- ❌ **Simulator:** Apple Pay has limited support (use real device if possible)

**Check:**
1. Settings → Wallet & Apple Pay
2. Do you have cards added?
3. Is Apple Pay enabled?

---

### 7. Check Stripe Configuration

**Verify Stripe has Apple Pay enabled:**

1. **Go to:** https://dashboard.stripe.com/settings/payment_methods/apple_pay
2. **Check:** Is Apple Pay enabled?
3. **For iOS apps:** Stripe should automatically handle merchant certificates
4. **Verify:** You're using **LIVE keys** (pk_live_...) - Test keys have limited Apple Pay support

**Your current key:** `pk_live_51SI8kT1XbYhKT4YYZQCgtQa4TyihsXULfjNISfVfLeOodvWLdBqXidldpUtaiaJcKaqDMO3WlNmUbPWl8YC3bJKw00ZKe9WtG3`
✅ This is a LIVE key - Good!

---

### 8. Clean Rebuild

**After any changes:**

1. **Product → Clean Build Folder** (Shift+Cmd+K)
2. **Delete app from device** (long press → delete)
3. **Rebuild** (Cmd+B)
4. **Run** (Cmd+R)
5. **Test Apple Pay again**

---

## 🚨 Most Common Issues

### Issue 1: Merchant ID Not Selected in Xcode
**Symptom:** Apple Pay button doesn't appear
**Fix:** Step 2 above - Select merchant ID in Xcode capabilities

### Issue 2: Provisioning Profile Missing Apple Pay
**Symptom:** Apple Pay button doesn't appear
**Fix:** Step 5 above - Refresh provisioning profile

### Issue 3: App ID Doesn't Have Apple Pay Enabled
**Symptom:** Merchant ID can't be selected in Xcode
**Fix:** Step 4 above - Enable Apple Pay in App ID

### Issue 4: Testing in Simulator
**Symptom:** Apple Pay button doesn't appear
**Fix:** Test on real device (iPhone/iPad)

### Issue 5: No Cards in Wallet
**Symptom:** Apple Pay button doesn't appear
**Fix:** Add a card to Apple Wallet

---

## 📋 What to Tell Me

**After checking the above, tell me:**

1. ✅/❌ Merchant ID selected in Xcode capabilities?
2. ✅/❌ App ID has Apple Pay enabled?
3. ✅/❌ Merchant ID exists in Apple Developer Portal?
4. ✅/❌ What do Xcode console logs say?
5. ✅/❌ Testing on real device or simulator?
6. ✅/❌ Do you have cards in Apple Wallet?
7. ✅/❌ What error message do you see (if any)?

---

## 🔧 Quick Fixes to Try

**Try these in order:**

1. **Select merchant ID in Xcode** (if not selected)
2. **Refresh provisioning profile** (uncheck/check "Automatically manage signing")
3. **Enable Apple Pay in App ID** (if not enabled)
4. **Clean rebuild** (Clean Build Folder → Delete app → Rebuild)
5. **Test on real device** (if using simulator)

---

**Start with Step 1 (check Xcode console logs) and Step 2 (check Xcode capabilities) - these are the most common issues!**

























