# 🔧 Backend Connection Fix

## ⚠️ Issue: "Could not connect to the server"

If you're testing on a **real iOS device**, `localhost` won't work. You need to use your Mac's IP address.

## ✅ Solution

### Option 1: Update PaymentConfig.swift (For Real Device)

**Your Mac's IP address:** `192.168.0.189`

**Update `PaymentConfig.swift` line 40:**

**Change from:**
```swift
static let baseURL = "http://localhost:3000"
```

**To:**
```swift
static let baseURL = "http://192.168.0.189:3000"
```

### Option 2: Use iOS Simulator (Easier)

If you're using **iOS Simulator**, `localhost` works fine. Just make sure:
- Backend is running: `node server.js`
- Simulator and Mac are on the same network

## 🎯 PaymentSheet Features

When PaymentSheet appears, it automatically shows:

### ✅ Card Entry Form
- Card number field (supports Visa, Mastercard, Amex, Discover, etc.)
- Expiry date field
- CVC field
- ZIP/Postal code field
- Real-time card validation
- Card type detection (shows card logo as you type)

### ✅ Apple Pay Button
- Appears automatically if:
  - Device supports Apple Pay
  - User has cards in Apple Wallet
  - Merchant ID is configured
- One-tap payment with Face ID/Touch ID

## 📱 Testing

1. **Make sure backend is running:**
   ```bash
   cd /Users/rianoheochagain/Desktop/BootBuys-Transfer
   node server.js
   ```

2. **Update baseURL** if testing on real device (see above)

3. **Test payment:**
   - Tap "Pay Now" button
   - PaymentSheet should appear with card entry form
   - Enter test card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`
   - ZIP: `12345`

## 🔍 Verify Connection

Check Xcode console for:
- ✅ `✅ PaymentManager: PaymentSheet created, presenting...`
- ✅ `✅ PaymentManager: Found root view controller, presenting PaymentSheet...`
- ❌ If you see connection errors, update `baseURL` to your Mac's IP

---

**Once connected, PaymentSheet will show card entry and Apple Pay automatically!** 🎉


