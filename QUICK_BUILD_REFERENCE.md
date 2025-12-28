# ⚡ Quick Build Reference

## 🚨 CRITICAL: Before Building

1. ✅ **Firestore Rules** - Already updated in `firestore.rules` ✅
2. ⚠️ **Backend Server** - Make sure it's running or deployed
3. ⚠️ **Stripe Keys** - Check `PaymentConfig.swift` has correct keys

---

## 🔄 WHAT'S CHANGED - Quick Summary

### Payment Flow (Vinted-Style Escrow)
- **Before:** Payment → Seller immediately
- **Now:** Payment → Held → Buyer confirms → Seller gets paid

**Order Status Flow:**
```
paid → shipped → delivered → completed
```

### New Features Added:
1. ✅ **Order Tracking** - Full status tracking system
2. ✅ **Reviews System** - Buyers can review sellers
3. ✅ **Tracking Dialog** - Sellers add tracking numbers
4. ✅ **Reviews Display** - Shows on seller profiles

---

## 🧪 Quick Test Flow

### 1. Test Purchase
- Buy a boot → Should create order with status "paid"
- Check "My Orders" → Should see the order

### 2. Test Shipping (as Seller)
- Open order → Tap "Mark as Shipped"
- Enter tracking number → Submit
- Status should change to "shipped"

### 3. Test Delivery (as Buyer)
- Open order → Tap "Confirm Delivery"
- Status should change to "delivered"
- Payment should release to seller

### 4. Test Review
- After order completed → Tap "Write Review"
- Submit review → Check seller profile
- Review should appear

---

## ⚠️ Common Issues

### "No paymentIntentId available"
- **Fix:** Payment might not have completed properly
- **Check:** Xcode console for payment errors

### "Permission denied" (Firestore)
- **Fix:** Rules might not be published
- **Check:** Firebase Console → Firestore → Rules → Publish

### Payment not releasing
- **Fix:** Backend might not be running
- **Check:** Backend logs for `/api/payments/release` calls

### Reviews not showing
- **Fix:** User profile might not be loading
- **Check:** Firebase connection and user profile fetch

---

## 📋 Files Changed Summary

### New Files:
- `Order.swift`
- `Review.swift`
- `OrderDetailView.swift`
- `OrdersListView.swift`
- `ReviewSubmissionView.swift`
- `ReviewsDisplayView.swift`
- `TrackingNumberDialog.swift`

### Modified Files:
- `PaymentManager.swift` - Stores paymentIntentId
- `PaymentView.swift` - Passes paymentIntentId & shippingAddress
- `FirebaseService.swift` - Order & review methods
- `server.js` - Escrow endpoints
- `firestore.rules` - Order & review rules
- `LegalConfig.swift` - Company name "SMGSOT Ltd"

---

## ✅ Build Checklist

- [ ] Backend running/deployed
- [ ] Stripe keys configured
- [ ] Firebase configured
- [ ] Firestore rules published
- [ ] Test purchase works
- [ ] Order tracking works
- [ ] Reviews work
- [ ] No console errors

---

**You're ready to build! 🚀**





