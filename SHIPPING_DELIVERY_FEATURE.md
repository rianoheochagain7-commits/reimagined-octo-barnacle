# 📦 Shipping & Delivery Feature - Complete Implementation

## ✅ What's Been Added

### 1. Shipping Address Model
- **File:** `BootBuys/BootBuys/Models/ShippingAddress.swift`
- **Features:**
  - Full address fields (name, address lines, city, county, postal code, country, phone)
  - Validation for required fields
  - Firebase conversion methods
  - Display formatting

### 2. Delivery Fee in Boot Model
- **File:** `BootBuys/BootBuys/Models/Boot.swift`
- **Changes:**
  - Added `deliveryFee: Double` field (default: €5.00)
  - Updated `toDictionary()` and `fromDictionary()` methods
  - Backward compatible (defaults to €5 if not set)

### 3. Delivery Details View (Before Payment)
- **File:** `BootBuys/BootBuys/Views/DeliveryDetailsView.swift`
- **Features:**
  - Shows boot summary
  - Displays delivery fee set by seller
  - Address entry form
  - Support for saved addresses (ready for Firebase integration)
  - Irish county picker
  - Validates address before allowing payment
  - Navigates to PaymentView with shipping address

### 4. Updated Payment Flow
- **BootDetailView:** Now navigates to `DeliveryDetailsView` instead of `PurchaseView`
- **PaymentView:** 
  - Accepts `shippingAddress` parameter
  - Shows shipping address card
  - Includes delivery fee in total amount
  - Payment amount = boot price + delivery fee

### 5. Seller Can Set Delivery Fee
- **File:** `BootBuys/BootBuys/Views/SellView.swift`
- **Features:**
  - Delivery fee input field (default: €5.00)
  - Located in pricing section
  - Saves with boot listing

### 6. Backend Integration
- **PaymentManager:** Updated to accept `totalAmount` (includes delivery fee)
- **StripeBackendAPI:** Updated to send total amount (price + delivery fee) to backend
- **Backend:** Already handles total amount correctly (no changes needed)

---

## 🔄 Payment Flow

### Old Flow:
1. User taps "Buy" → `PurchaseView` → Payment

### New Flow:
1. User taps "Buy" → `DeliveryDetailsView` → Enter shipping address → `PaymentView` → Payment

---

## 💰 Pricing Breakdown

### For Buyers:
- **Boot Price:** €X.XX (set by seller)
- **Delivery Fee:** €Y.YY (set by seller, default €5.00)
- **Total:** €(X.XX + Y.YY)

### For Sellers:
- **Platform Fee:** 5% (boots under €100) or 7% (boots €100+)
- **Fee Applied To:** Boot price only (delivery fee goes to seller)
- **Seller Receives:** Boot price - platform fee + delivery fee

---

## 📋 How It Works

### For Sellers (Listing a Boot):
1. Go to Sell tab
2. Fill in boot details
3. Set price (e.g., €50)
4. Set delivery fee (e.g., €5) - defaults to €5.00
5. Submit listing

### For Buyers (Purchasing):
1. Browse boots
2. Tap on a boot
3. Tap "Buy" button
4. **Delivery Details Page:**
   - See boot summary
   - See delivery fee (set by seller)
   - Enter shipping address
   - Tap "Continue to Payment"
5. **Payment Page:**
   - See total (price + delivery fee)
   - See shipping address
   - Complete payment

---

## 🗄️ Database Structure

### Boot Document (Firestore):
```json
{
  "id": "boot-123",
  "name": "Nike Air Max",
  "price": 50.0,
  "deliveryFee": 5.0,  // NEW FIELD
  "sellerId": "user-123",
  ...
}
```

### Order Document (Firestore):
```json
{
  "id": "order-123",
  "bootId": "boot-123",
  "buyerId": "buyer-456",
  "sellerId": "user-123",
  "totalPrice": 55.0,  // price + deliveryFee
  "shippingAddress": {  // NEW FIELD
    "fullName": "John Doe",
    "addressLine1": "123 Main St",
    "city": "Dublin",
    "county": "Dublin",
    "postalCode": "D01 ABC1",
    "country": "Ireland",
    "phoneNumber": "+353123456789"
  },
  ...
}
```

---

## 🔧 Technical Details

### Files Modified:
1. ✅ `BootBuys/BootBuys/Models/Boot.swift` - Added deliveryFee field
2. ✅ `BootBuys/BootBuys/Models/ShippingAddress.swift` - New model
3. ✅ `BootBuys/BootBuys/Views/DeliveryDetailsView.swift` - New view
4. ✅ `BootBuys/BootBuys/Views/BootDetailView.swift` - Updated navigation
5. ✅ `BootBuys/BootBuys/Views/PaymentView.swift` - Added shipping address support
6. ✅ `BootBuys/BootBuys/Views/SellView.swift` - Added delivery fee input
7. ✅ `BootBuys/BootBuys/Models/PaymentManager.swift` - Updated to accept totalAmount
8. ✅ `BootBuys/BootBuys/Models/StripeBackendAPI.swift` - Updated to send totalAmount

### Backend:
- ✅ No changes needed - backend already handles total amount correctly
- Backend receives `amount` (price + delivery fee) and processes payment

---

## 🚀 Next Steps (Optional Enhancements)

### 1. Save Addresses to Firebase
- Currently addresses are only stored in memory
- Could save to Firestore `users/{userId}/addresses/{addressId}`
- Allow users to select from saved addresses

### 2. Address Validation
- Validate postal codes (EIRCODE for Ireland)
- Suggest addresses based on postal code
- Integration with address lookup APIs

### 3. Delivery Options
- Multiple delivery speeds (standard, express)
- Different fees for different options
- Estimated delivery times

### 4. Order Tracking
- Track order status (processing, shipped, delivered)
- Shipping carrier integration
- Tracking number support

### 5. Seller Shipping Settings
- Default delivery fee per seller
- Free shipping threshold
- International shipping options

---

## ✅ Testing Checklist

- [ ] Seller can set delivery fee when listing boot
- [ ] Delivery fee defaults to €5.00
- [ ] Buyer sees delivery fee on delivery details page
- [ ] Buyer can enter shipping address
- [ ] Address validation works (required fields)
- [ ] Payment page shows correct total (price + delivery fee)
- [ ] Payment processes with correct amount
- [ ] Order saved with shipping address
- [ ] Irish county picker works
- [ ] Backward compatibility (old boots without deliveryFee default to €5)

---

## 📝 Notes

- **Default Delivery Fee:** €5.00 (can be changed by seller)
- **Address Required:** Yes, buyer must enter valid address before payment
- **Backward Compatible:** Existing boots without `deliveryFee` will default to €5.00
- **Platform Fee:** Only applies to boot price, not delivery fee (seller keeps full delivery fee)

---

**Feature Complete! ✅**

All shipping and delivery functionality has been implemented. The payment flow now includes:
- ✅ Delivery fee set by seller
- ✅ Shipping address entry before payment
- ✅ Total amount includes delivery fee
- ✅ Address saved with order

































