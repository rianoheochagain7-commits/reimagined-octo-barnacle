# 💰 Payment Breakdown: €15 Boot

## Example: Seller lists boot for €15 with €5 delivery fee

---

## 💳 What the Buyer Pays:

| Item | Amount |
|------|--------|
| **Boot Price** | €15.00 |
| **Delivery Fee** | €5.00 |
| **Total** | **€20.00** ✅ |

---

## 💵 Payment Split:

### Platform Fee (BootBuys - 7%)
- **Fee Rate:** 7% of boot price
- **Fee Amount:** €15 × 7% = **€1.05** ✅
- **Note:** Platform fee is ONLY on boot price, NOT on delivery fee

### Seller Receives:
- **Boot Price:** €15.00
- **Minus Platform Fee:** -€1.05
- **Plus Delivery Fee:** +€5.00 (seller keeps 100% of delivery fee)
- **Total Seller Receives:** **€18.95** ✅

---

## 📊 Summary Table:

| Item | Amount |
|------|--------|
| **Buyer Pays** | €20.00 |
| **Platform Fee (BootBuys)** | €1.05 (7%) |
| **Seller Receives** | €18.95 |

---

## 🔍 Breakdown Details:

### Boot Price: €15.00
- Platform fee: €1.05 (7%)
- Seller gets: €13.95

### Delivery Fee: €5.00
- Platform fee: €0.00 (seller keeps 100%)
- Seller gets: €5.00

### Total:
- **Buyer pays:** €20.00
- **BootBuys receives:** €1.05
- **Seller receives:** €18.95

---

## ✅ How It Works:

1. **Buyer completes payment** → Stripe charges €20.00
2. **Stripe Connect splits the payment:**
   - €1.05 → Goes to **BootBuys account** (your Stripe account)
   - €18.95 → Goes to **Seller's bank account** (via Stripe Connect)
3. **Seller gets paid** → Money appears in seller's bank in 2-7 business days

---

## 📝 Notes:

- ✅ Platform fee is **only on boot price** (not delivery fee)
- ✅ Seller keeps **100% of delivery fee**
- ✅ Fee rate: **7% for all boots** (regardless of price)
- ✅ Payment is split automatically by Stripe Connect

---

## 💡 Other Examples:

### €50 Boot with €5 Delivery:
- Buyer pays: €55.00
- Platform fee: €3.50 (7% of €50)
- Seller receives: €51.50

### €100 Boot with €5 Delivery:
- Buyer pays: €105.00
- Platform fee: €7.00 (7% of €100)
- Seller receives: €98.00

### €200 Boot with €10 Delivery:
- Buyer pays: €210.00
- Platform fee: €14.00 (7% of €200)
- Seller receives: €196.00




























