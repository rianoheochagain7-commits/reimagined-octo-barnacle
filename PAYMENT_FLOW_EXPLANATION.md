# 💰 Payment Flow Explanation

## Example: Seller lists boot for €70 with €5 delivery fee

### What the Buyer Pays:
- **Boot Price:** €70.00
- **Delivery Fee:** €5.00
- **Total:** **€75.00** ✅ (Buyer pays this full amount)

---

### What Happens with the Money:

#### 1. Platform Fee (goes to BootBuys account)
- **Fee Rate:** 7% for all boots
- **Fee Amount:** €70 × 7% = **€4.90** ✅
- **Note:** Platform fee is ONLY on boot price, NOT on delivery fee

#### 2. Seller Receives:
- **Boot Price:** €70.00
- **Minus Platform Fee:** -€3.50
- **Plus Delivery Fee:** +€5.00 (seller keeps FULL delivery fee)
- **Total Seller Receives:** **€71.50** ✅

---

## Summary:

| Item | Amount |
|------|--------|
| **Buyer Pays** | €75.00 |
| **Platform Fee (BootBuys)** | €4.90 |
| **Seller Receives** | €70.10 |

---

## How It Works:

1. **Buyer completes payment** → Stripe charges €75.00
2. **Stripe Connect splits the payment:**
   - €4.90 → Goes to **BootBuys account** (your Stripe account)
   - €70.10 → Goes to **Seller's bank account** (via Stripe Connect)
3. **Seller gets paid** → Money appears in seller's bank in 2-7 business days

---

## Important Notes:

✅ **Platform fee is ONLY on boot price** (not delivery fee)
- Boot price: €70 → Fee: €3.50 (5%)
- Delivery fee: €5 → Seller keeps full €5

✅ **Seller keeps 100% of delivery fee**
- Delivery fees are not subject to platform fees

✅ **Fee rate:**
- All boots: **7%** platform fee

---

## Example 2: €120 boot with €5 delivery

**Buyer pays:** €125.00 (€120 + €5)
**Platform fee:** €120 × 7% = €8.40 (goes to BootBuys)
**Seller receives:** €120 - €8.40 + €5 = **€116.60**

---

## Example 3: €50 boot with €5 delivery

**Buyer pays:** €55.00 (€50 + €5)
**Platform fee:** €50 × 7% = €3.50 (goes to BootBuys)
**Seller receives:** €50 - €3.50 + €5 = **€51.50**

---

## Current Implementation:

✅ **Backend (`server.js`):**
- Calculates platform fee correctly
- Uses Stripe Connect for automatic split payments
- Platform fee goes to BootBuys account
- Seller amount goes to seller's bank

✅ **iOS App (`PaymentView.swift`):**
- Shows buyer the total amount (boot price + delivery fee)
- Displays seller receives amount (with fee deduction info)

---

## Verification:

To verify this is working correctly:
1. Check Stripe Dashboard → Payments (Live mode)
2. Look at the payment details
3. You should see:
   - Total charge: €75.00
   - Application fee: €4.90 (in your BootBuys account)
   - Transfer to seller: €70.10 (in seller's connected account)

