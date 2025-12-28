# 🔧 Apple Pay "Not Available in BootBuys" - Final Fix

## Problem
Apple Pay shows "not available in BootBuys" error.

## Root Cause
The provisioning profile doesn't include the Apple Pay capability, even though the merchant ID exists.

---

## ✅ COMPLETE FIX (Do All Steps)

### Step 1: Verify Merchant ID in Apple Developer Portal

1. **Go to:** https://developer.apple.com/account/resources/identifiers/list
2. **Filter by:** "Merchant IDs"
3. **Check:** Does `merchant.com.bootbuys.app` exist?
   - ✅ If YES → Go to Step 2
   - ❌ If NO → Create it:
     - Click "+" → Select "Merchant IDs"
     - Description: `BootBuys Merchant`
     - Identifier: `merchant.com.bootbuys.app`
     - Click Continue → Register

### Step 2: Configure Xcode Capabilities

1. **Open Xcode** → BootBuys project
2. **Select BootBuys target** (not project)
3. **Go to:** "Signing & Capabilities" tab
4. **Check if "Apple Pay" capability exists:**
   - ✅ If YES → Go to Step 3
   - ❌ If NO → Add it:
     - Click "+ Capability"
     - Search "Apple Pay"
     - Add it

5. **In Apple Pay capability section:**
   - **Click the dropdown** next to "Merchant IDs"
   - **Select:** `merchant.com.bootbuys.app`
   - If it's not in the list:
     - Xcode → Preferences → Accounts
     - Select your Apple ID
     - Click "Download Manual Profiles"
     - Go back to Signing & Capabilities
     - Try selecting again

### Step 3: Regenerate Provisioning Profile

**This is the KEY step that fixes the error:**

1. **In Xcode → Signing & Capabilities:**
2. **Uncheck** "Automatically manage signing"
3. **Wait 2 seconds**
4. **Check** "Automatically manage signing" again
5. **Xcode will regenerate** the provisioning profile with Apple Pay

### Step 4: Verify Entitlements File

**File:** `BootBuys/BootBuys/BootBuys.entitlements`

Should contain:
```xml
<key>com.apple.developer.in-app-payments</key>
<array>
    <string>merchant.com.bootbuys.app</string>
</array>
```

✅ This should already be correct.

### Step 5: Clean Everything

1. **Product → Clean Build Folder** (Shift+Cmd+K)
2. **Delete app** from device (long press → Delete)
3. **Close Xcode** completely
4. **Reopen Xcode**
5. **Product → Build** (Cmd+B)
6. **Product → Run** (Cmd+R)

---

## 🔍 Verification

### Check Xcode Console

When you open PaymentSheet, check Xcode console for:

**✅ Should see:**
```
✅ PaymentManager: Apple Pay configured with merchant ID: merchant.com.bootbuys.app
✅ PaymentManager: Apple Pay country code: IE
```

**❌ If you see:**
```
⚠️ PaymentManager: Apple Pay not configured (merchant ID missing)
```
→ Merchant ID not being read (go back to Step 2)

### Check Device Settings

1. **Settings → Wallet & Apple Pay**
2. **Make sure** you have at least one card added
3. **Check** Apple Pay is enabled

### Test on Real Device

- **Simulator:** Apple Pay has limited support
- **Real Device:** Required for full Apple Pay testing
- **Device:** Must support Apple Pay (iPhone 6+, iPad Air 2+)

---

## 🚨 If Still Not Working

### Option 1: Manual Provisioning Profile

1. **Xcode → Preferences → Accounts**
2. **Select your Apple ID**
3. **Click "Download Manual Profiles"**
4. **Go to:** https://developer.apple.com/account/resources/profiles/list
5. **Find** your BootBuys provisioning profile
6. **Check** if it includes "Apple Pay" capability
7. **If not:** Delete it and let Xcode regenerate

### Option 2: Check Bundle Identifier

1. **Xcode → Signing & Capabilities**
2. **Check Bundle Identifier:** Should match your App ID
3. **Make sure** App ID includes Apple Pay capability:
   - Go to: https://developer.apple.com/account/resources/identifiers/list
   - Find your App ID (e.g., `com.bootbuys.app`)
   - Check if "Apple Pay" capability is enabled
   - If not, enable it

### Option 3: Verify Stripe Configuration

1. **Go to:** https://dashboard.stripe.com/settings/payment_methods/apple_pay
2. **Check** if Apple Pay is enabled
3. **For iOS apps:** Stripe handles merchant certificates automatically
4. **Make sure** you're using LIVE keys (pk_live_...)

---

## ✅ Final Checklist

- [ ] Merchant ID exists in Apple Developer Portal
- [ ] Apple Pay capability added in Xcode
- [ ] Merchant ID **selected** in Xcode capabilities dropdown
- [ ] Provisioning profile regenerated (Step 3)
- [ ] Entitlements file has merchant ID
- [ ] App ID has Apple Pay capability enabled
- [ ] Using LIVE Stripe keys
- [ ] Device supports Apple Pay
- [ ] User has cards in Wallet
- [ ] App rebuilt after all changes

---

## 💡 Most Important Step

**Step 3 (Regenerate Provisioning Profile)** is the most critical. This is what fixes the "not available" error 90% of the time.

The error happens because:
- Merchant ID exists ✅
- Capability is added ✅
- But provisioning profile doesn't include it ❌

Regenerating the profile fixes this.

---

## 📱 After Fix

1. **Clean rebuild** (Step 5)
2. **Test on real device**
3. **Check Xcode console** for Apple Pay logs
4. **Try Apple Pay** - should work!

If it still doesn't work after Step 3, check Option 1-3 above.




























