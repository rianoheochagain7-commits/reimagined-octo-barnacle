# 📱 Step-by-Step: Get Payment Working

## ✅ Current Status
- ✅ Backend server is running
- ✅ Stripe keys are configured
- ✅ Payment code is ready

## 🎯 Step 1: Check What You're Testing On

**Are you using:**
- **iOS Simulator** (on your Mac) → Skip to Step 3
- **Real iPhone/iPad** → Do Step 2 first

---

## 📱 Step 2: Update baseURL (ONLY if testing on Real Device)

**If you're testing on a REAL iPhone/iPad:**

1. **Open Xcode**
2. **Open file:** `BootBuys/BootBuys/Models/PaymentConfig.swift`
3. **Find line 40** (looks like this):
   ```swift
   static let baseURL = "http://localhost:3000"
   ```
4. **Change it to** (use your Mac's IP):
   ```swift
   static let baseURL = "http://192.168.0.189:3000"
   ```
5. **Save the file** (Cmd+S)

**If you're using iOS Simulator, keep it as `localhost:3000`**

---

## 🚀 Step 3: Make Sure Backend is Running

**Open Terminal and run:**
```bash
cd /Users/rianoheochagain/Desktop/BootBuys-Transfer
node server.js
```

**You should see:**
```
🚀 Stripe backend server running on port 3000
📱 Ready to handle PaymentIntents
```

**Keep this terminal window open!**

---

## 🧪 Step 4: Test Payment in Your App

1. **Open your app in Xcode**
2. **Build and run** (Cmd+R)
3. **Sign in** to your account
4. **Find a boot** to purchase
5. **Tap "Pay Now"** or "Pay €X.XX" button
6. **PaymentSheet should appear** with:
   - Card entry form (card number, expiry, CVC, ZIP)
   - Apple Pay button (if available)

---

## 💳 Step 5: Test with Stripe Test Card

**When PaymentSheet appears, enter:**

- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** `12/25` (any future date)
- **CVC:** `123` (any 3 digits)
- **ZIP:** `12345` (any 5 digits)

**Then tap "Pay"**

---

## ✅ What Should Happen

1. ✅ PaymentSheet appears with card entry form
2. ✅ You enter test card details
3. ✅ Payment processes (no real charge in test mode)
4. ✅ Success screen appears
5. ✅ Order is saved to Firebase

---

## ❌ If PaymentSheet Doesn't Appear

**Check Xcode Console for:**
- ✅ `✅ PaymentManager: PaymentSheet created, presenting...`
- ✅ `✅ PaymentManager: Found root view controller, presenting PaymentSheet...`

**If you see errors:**
- ❌ Connection error → Update `baseURL` (Step 2)
- ❌ Stripe key error → Check `PaymentConfig.swift` line 10 has your key
- ❌ Backend error → Make sure backend is running (Step 3)

---

## 🎉 Success!

Once PaymentSheet appears, you'll see:
- **Card entry form** - Always available
- **Apple Pay button** - If device supports it

Both options work! Just choose one and complete the payment.


