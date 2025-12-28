# 💰 Fee Explanation: Why €4 Received on €5 Boot

## The Issue
You received **€4** in your Stripe account when a boot was sold for **€5**.

---

## 🔍 Fee Breakdown

### Boot Price: €5.00

### Platform Fee (BootBuys - 7%):
- **Fee:** €5 × 7% = **€0.35**

### Stripe Processing Fees:
Stripe charges their own processing fees on every payment:
- **European cards:** 1.4% + €0.25 per transaction
- **Other cards:** 2.9% + €0.25 per transaction

**Example (European card):**
- Stripe fee: €5 × 1.4% + €0.25 = €0.07 + €0.25 = **€0.32**

### Total Deductions:
- Platform fee: €0.35
- Stripe processing fee: €0.32
- **Total deducted:** €0.67

### Expected Seller Receives:
- €5.00 - €0.67 = **€4.33**

---

## ❓ Why You Received €4 Instead of €4.33?

There are a few possibilities:

### 1. **Stripe Connect Application Fee Issue**
If the platform fee is being deducted incorrectly, you might be receiving:
- €5.00 - €1.00 (20% fee) = €4.00

This suggests the platform fee might be calculated incorrectly, or there's an issue with how Stripe Connect is splitting the payment.

### 2. **Stripe Processing Fees**
Stripe's processing fees are deducted from the total payment before it reaches your account. If Stripe charged:
- €5.00 - €1.00 (Stripe fees) = €4.00

This would mean Stripe charged 20% in fees, which is unusually high.

### 3. **Code Issue**
Let me check if there's a bug in the fee calculation...

---

## 🔧 What to Check

### In Stripe Dashboard:
1. Go to **Payments** → Find the €5 payment
2. Check the **"Application fee"** amount
3. Check the **"Stripe fee"** amount
4. Check the **"Net"** amount (what you received)

This will show exactly what was deducted and why.

---

## ✅ Expected Behavior

For a **€5 boot**:
- **Buyer pays:** €5.00
- **Platform fee (7%):** €0.35 → Goes to BootBuys
- **Stripe processing fee:** ~€0.32 → Goes to Stripe
- **Seller receives:** €4.33 → Goes to seller

---

## 🚨 If You Received €4.00

This suggests:
- **€1.00 was deducted** (20% fee)
- This is **higher than expected** (should be ~€0.67 total)

**Possible causes:**
1. Platform fee calculation error (should be 7% = €0.35, not 20% = €1.00)
2. Stripe Connect configuration issue
3. Additional fees being applied incorrectly

---

## 📋 Next Steps

1. **Check Stripe Dashboard:**
   - Go to the payment details
   - See the exact breakdown of fees
   - Share the breakdown so we can identify the issue

2. **Verify Code:**
   - Platform fee should be 7% = €0.35
   - Check if there's a minimum fee or other calculation

3. **Check Stripe Connect Settings:**
   - Verify application fee is set correctly
   - Check if there are any additional fees configured

---

## 💡 Quick Fix

If the platform fee is being calculated as 20% instead of 7%, we need to check the code. The current code should calculate:
- Platform fee = boot price × 7%
- For €5 boot: €5 × 7% = €0.35

But if you're seeing €1.00 deducted, something is wrong.

---

**Please check your Stripe Dashboard and share:**
1. The payment amount (€5)
2. Application fee amount
3. Stripe fee amount
4. Net amount received (€4)

This will help identify exactly what's happening!




























