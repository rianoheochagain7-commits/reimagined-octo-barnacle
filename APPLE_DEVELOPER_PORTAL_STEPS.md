# 🍎 Apple Developer Portal - Apple Pay Setup Steps

## 📍 Where to Go

### Step 1: Sign In to Apple Developer Portal

**Go to:** https://developer.apple.com/account

**Or directly to Identifiers:**
https://developer.apple.com/account/resources/identifiers/list

---

## 🎯 Step-by-Step: Create Merchant ID

### 1. Navigate to Identifiers

**Path:**
1. Sign in to https://developer.apple.com/account
2. Click **"Certificates, Identifiers & Profiles"** (or **"Identifiers"** in sidebar)
3. Click **"Identifiers"** in the left sidebar
4. You'll see a list of all your identifiers

### 2. Create New Merchant ID

**Steps:**
1. Click the **"+"** button (top left, blue plus icon)
2. Select **"Merchant IDs"** 
3. Click **"Continue"** button

### 3. Fill in Merchant ID Details

**Enter:**
- **Description:** `BootBuys Merchant` (or any name you want)
- **Identifier:** `merchant.com.bootbuys.app` 
  - ⚠️ **IMPORTANT:** Must match exactly what's in your code!
  - Format: `merchant.com.yourcompany.appname`

4. Click **"Continue"**
5. Review the details
6. Click **"Register"**

### 4. Done!

You should now see `merchant.com.bootbuys.app` in your identifiers list.

---

## 📱 Next: Configure in Xcode

After creating the Merchant ID, you need to add it to your Xcode project:

### Steps:

1. **Open your project in Xcode**
2. **Select your app target** (BootBuys)
3. **Go to:** "Signing & Capabilities" tab
4. **Click:** "+ Capability" button (top left)
5. **Search for:** "Apple Pay"
6. **Select:** "Apple Pay"
7. **In the Apple Pay section**, click the dropdown for "Merchant IDs"
8. **Select:** `merchant.com.bootbuys.app` (the one you just created)
9. **Done!** The capability is now added

---

## 🔗 Direct Links

### Main Portal:
- **Apple Developer Account:** https://developer.apple.com/account

### Identifiers (Direct):
- **All Identifiers:** https://developer.apple.com/account/resources/identifiers/list
- **Create New:** https://developer.apple.com/account/resources/identifiers/add

### Apple Pay Documentation:
- **Setup Guide:** https://developer.apple.com/documentation/passkit/apple_pay/setting_up_apple_pay

---

## ✅ Checklist

After completing these steps:

- [ ] Merchant ID created: `merchant.com.bootbuys.app`
- [ ] Merchant ID visible in Apple Developer Portal
- [ ] Apple Pay capability added in Xcode
- [ ] Merchant ID selected in Xcode capabilities
- [ ] Code already has: `merchant.com.bootbuys.app` in PaymentConfig.swift ✅

---

## 🎯 What Happens Next

Once configured:
1. **Build your app** in Xcode
2. **Run on a real device** (Apple Pay doesn't work in simulator)
3. **Make sure device has cards in Apple Wallet**
4. **Tap "Pay Now"** in your app
5. **Apple Pay button should appear** in PaymentSheet!

---

## ⚠️ Important Notes

1. **Merchant ID Format:**
   - Must start with `merchant.`
   - Example: `merchant.com.bootbuys.app`
   - Must match exactly in code and Xcode

2. **Testing:**
   - Apple Pay only works on **real devices**
   - User must have cards in Apple Wallet
   - Test cards work with Apple Pay

3. **Stripe Integration:**
   - After creating Merchant ID, configure it in Stripe Dashboard
   - Stripe → Settings → Apple Pay → Add merchant ID

---

**That's it! Once you complete these steps, Apple Pay will work in your app.** 🎉


