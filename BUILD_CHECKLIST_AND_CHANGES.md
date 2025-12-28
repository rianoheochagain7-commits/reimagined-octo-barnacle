# 🚀 Build Checklist & What's Changed

## ⚠️ BEFORE YOU BUILD - Check These First

### 1. **Backend Server Status**
- [ ] Backend is running (or deployed to Render)
- [ ] Check backend URL in `PaymentConfig.swift` matches your setup
- [ ] Verify Stripe keys are configured (test or live)

### 2. **Firebase Configuration**
- [ ] `GoogleService-Info.plist` is in the project
- [ ] Firebase Authentication is enabled
- [ ] Firestore Database is created
- [ ] Firestore Rules are updated (we added orders & reviews rules)

### 3. **Firestore Rules Update** ⚠️ CRITICAL
**You MUST update Firestore rules before building!**

Go to Firebase Console → Firestore Database → Rules and add:

```javascript
// Orders collection - purchase history with escrow status
match /orders/{orderId} {
  // Users can read their own orders (as buyer or seller)
  allow read: if isAuthenticated() 
              && (resource.data.buyerId == request.auth.uid 
                  || resource.data.sellerId == request.auth.uid);
  
  // Buyers can create orders when purchasing
  allow create: if isAuthenticated() 
                && request.resource.data.buyerId == request.auth.uid
                && request.resource.data.sellerId != null
                && request.resource.data.bootId != null
                && request.resource.data.status == "paid"; // Initial status must be "paid" (escrow)
  
  // Buyers and sellers can update their own orders (status updates)
  allow update: if isAuthenticated() 
                && (resource.data.buyerId == request.auth.uid 
                    || resource.data.sellerId == request.auth.uid)
                && // Only allow valid status transitions
                (request.resource.data.status == "shipped" 
                 || request.resource.data.status == "delivered"
                 || request.resource.data.status == "completed"
                 || request.resource.data.status == "refunded");
  
  // Only seller can mark as shipped
  allow update: if isAuthenticated()
                && resource.data.sellerId == request.auth.uid
                && resource.data.status == "paid"
                && request.resource.data.status == "shipped";
  
  // Only buyer can mark as delivered
  allow update: if isAuthenticated()
                && resource.data.buyerId == request.auth.uid
                && resource.data.status == "shipped"
                && request.resource.data.status == "delivered";
  
  // Only buyer can request refund
  allow update: if isAuthenticated()
                && resource.data.buyerId == request.auth.uid
                && request.resource.data.status == "refunded";
}

// Reviews collection - buyer/seller reviews
match /reviews/{reviewId} {
  // Anyone authenticated can read reviews
  allow read: if isAuthenticated();
  
  // Users can create reviews for their own orders
  allow create: if isAuthenticated() 
                && request.resource.data.reviewerId == request.auth.uid
                && request.resource.data.orderId != null
                && request.resource.data.rating >= 1
                && request.resource.data.rating <= 5;
  
  // Users can update their own reviews (only helpful count)
  allow update: if isAuthenticated() 
                && resource.data.reviewerId == request.auth.uid
                && request.resource.data.diff(resource.data).affectedKeys()
                    .hasOnly(['helpfulCount']);
}
```

---

## 📋 WHAT'S CHANGED - Summary

### 1. **Payment System - Vinted-Style Escrow** 🔄 MAJOR CHANGE

**Before:**
- Payment went directly to seller immediately
- Order status was "completed" right away

**Now:**
- Payment is **held in escrow** until buyer confirms delivery
- Order status flow: `paid` → `shipped` → `delivered` → `completed`
- Payment only released after buyer confirms receipt

**What to Test:**
- [ ] Make a test purchase
- [ ] Verify order status is "paid" (not "completed")
- [ ] Seller can mark as "shipped" with tracking number
- [ ] Buyer can confirm delivery
- [ ] Payment releases after confirmation

**Backend Changes:**
- PaymentIntent now uses `capture_method: 'manual'`
- New endpoint: `/api/payments/release` - Releases payment to seller
- New endpoint: `/api/payments/refund` - Processes refunds

---

### 2. **Order Tracking System** ✨ NEW

**New Features:**
- Order status tracking (paid, shipped, delivered, completed, refunded)
- Tracking number support
- Order detail view with status updates
- Orders list view (buying/selling)

**New Files:**
- `Order.swift` - Order model with status tracking
- `OrderDetailView.swift` - View order details and update status
- `OrdersListView.swift` - List all orders

**What to Test:**
- [ ] View orders list (should show buying and selling tabs)
- [ ] Open order detail view
- [ ] Seller can mark order as shipped
- [ ] Buyer can confirm delivery
- [ ] Order status updates correctly

---

### 3. **Reviews & Ratings System** ✨ NEW

**New Features:**
- Buyers can review sellers after order completion
- 1-5 star ratings with comments
- Reviews displayed on seller profiles
- Rating summary (average, distribution chart)
- Prevents duplicate reviews

**New Files:**
- `Review.swift` - Review model
- `ReviewSubmissionView.swift` - Submit reviews
- `ReviewsDisplayView.swift` - Display reviews on profiles

**What to Test:**
- [ ] Complete an order
- [ ] Submit a review (should appear after completion)
- [ ] View reviews on seller profile
- [ ] Check rating summary displays correctly
- [ ] Try to submit duplicate review (should be prevented)

---

### 4. **Tracking Number Dialog** ✨ NEW

**New Feature:**
- Seller can enter tracking number when marking order as shipped
- Clean dialog interface with validation

**New File:**
- `TrackingNumberDialog.swift` - Tracking number input dialog

**What to Test:**
- [ ] Seller taps "Mark as Shipped"
- [ ] Dialog appears
- [ ] Can enter tracking number
- [ ] Can't submit empty tracking number
- [ ] Order updates with tracking number

---

### 5. **Payment Flow Changes** 🔄 UPDATED

**Changed Files:**
- `PaymentManager.swift` - Now stores `paymentIntentId`
- `PaymentView.swift` - Passes `paymentIntentId` and `shippingAddress` to order creation
- `FirebaseService.swift` - Updated `purchaseBoot()` to create orders with escrow status

**What Changed:**
- PaymentIntent ID is now stored with orders
- Orders created with status "paid" (not "completed")
- Shipping address is saved with orders

---

### 6. **Legal Updates** ✅ COMPLETE

**Updated:**
- Company name changed to "SMGSOT Ltd" in `LegalConfig.swift`
- Privacy Policy, Terms, Refund Policy should all show "SMGSOT Ltd"

---

## 🧪 TESTING CHECKLIST

### Payment Flow
- [ ] **Test Purchase:**
  1. Browse boots
  2. Tap "Buy" on a boot
  3. Enter shipping address
  4. Complete payment
  5. Verify order is created with status "paid"
  6. Check order appears in "My Orders"

### Seller Flow
- [ ] **Mark as Shipped:**
  1. Go to "My Orders" → "Selling" tab
  2. Find order with status "paid"
  3. Tap order → Tap "Mark as Shipped"
  4. Enter tracking number
  5. Verify status changes to "shipped"
  6. Verify tracking number appears

### Buyer Flow
- [ ] **Confirm Delivery:**
  1. Go to "My Orders" → "Buying" tab
  2. Find order with status "shipped"
  3. Tap order → Tap "Confirm Delivery"
  4. Verify status changes to "delivered"
  5. Verify payment is released (check backend logs)

### Reviews Flow
- [ ] **Submit Review:**
  1. Complete an order (status: "completed")
  2. Open order detail view
  3. Tap "Write Review"
  4. Select rating (1-5 stars)
  5. Write comment
  6. Submit review
  7. Verify review appears on seller profile

### Profile Reviews
- [ ] **View Reviews:**
  1. Open any seller profile
  2. Scroll to "Reviews" section
  3. Verify rating summary shows
  4. Verify individual reviews display
  5. Check rating distribution chart

---

## ⚠️ POTENTIAL ISSUES TO WATCH FOR

### 1. **Firestore Rules**
- **Issue:** Orders/reviews might fail if rules aren't updated
- **Fix:** Update Firestore rules before testing (see above)

### 2. **Payment Intent ID**
- **Issue:** Order creation might fail if `paymentIntentId` is missing
- **Fix:** Check Xcode console for "No paymentIntentId available" errors

### 3. **Backend Endpoints**
- **Issue:** Payment release/refund might fail if backend isn't running
- **Fix:** Ensure backend is running and accessible

### 4. **Order Status Updates**
- **Issue:** Status might not update if Firestore rules block it
- **Fix:** Verify rules allow status transitions (see above)

### 5. **Reviews Display**
- **Issue:** Reviews might not show if user profile fetch fails
- **Fix:** Check Firebase connection and user profile loading

---

## 🔍 WHAT TO CHECK IN XCODE CONSOLE

### During Payment:
```
✅ PaymentIntent created successfully, ID: pi_xxx
✅ Order created: [order-id] with status: paid
```

### During Shipping:
```
✅ Order [order-id] status updated to: shipped
```

### During Delivery:
```
✅ Order [order-id] status updated to: delivered
✅ Payment released: €XX transferred to seller
```

### During Review:
```
✅ Review submitted: [review-id]
```

### Errors to Watch For:
```
❌ No paymentIntentId available
❌ Permission denied (Firestore rules)
❌ Network error (backend not running)
❌ Firebase not configured
```

---

## 📱 UI CHANGES TO LOOK FOR

### New Views:
1. **OrdersListView** - Should appear in navigation (if you added it)
2. **OrderDetailView** - Opens when tapping an order
3. **ReviewSubmissionView** - Opens after order completion
4. **ReviewsDisplayView** - Shows on seller profiles
5. **TrackingNumberDialog** - Opens when seller marks as shipped

### Updated Views:
1. **PaymentView** - Now passes shipping address and paymentIntentId
2. **UserProfileView** - Now shows reviews section

---

## 🚨 CRITICAL: Before Building

1. **Update Firestore Rules** - Copy the rules from above
2. **Check Backend** - Make sure it's running/deployed
3. **Test Payment** - Do a test purchase first
4. **Check Console** - Watch for any errors

---

## ✅ POST-BUILD VERIFICATION

After building, verify:
- [ ] App compiles without errors
- [ ] Payment flow works (test purchase)
- [ ] Order tracking works (status updates)
- [ ] Reviews work (can submit and view)
- [ ] Tracking dialog works (seller can add tracking)
- [ ] No console errors

---

**Good luck with the build! 🚀**





