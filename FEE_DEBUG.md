# 🔍 Fee Debug: €5 Boot → €4 Received

## The Math

**Boot Price:** €5.00  
**You Received:** €4.00  
**Difference:** €1.00 deducted (20%)

---

## ✅ Expected Calculation (7% Platform Fee)

### Platform Fee:
- €5 × 7% = **€0.35**

### Stripe Processing Fees:
- European cards: 1.4% + €0.25 = €0.32
- Other cards: 2.9% + €0.25 = €0.40

### Expected You Should Receive:
- €5.00 - €0.35 (platform) - €0.32 (Stripe) = **€4.33** (European card)
- OR
- €5.00 - €0.35 (platform) - €0.40 (Stripe) = **€4.25** (Other card)

---

## ❓ Why €4.00 Instead?

**€1.00 deducted = 20% fee**

This suggests one of these issues:

### 1. **Platform Fee Calculated Wrong**
If platform fee was calculated as 20% instead of 7%:
- €5 × 20% = €1.00 ✅ (matches what you received)

**But code shows 7%, so this shouldn't happen...**

### 2. **Stripe Connect Application Fee Issue**
The `application_fee_amount` might be set incorrectly, or there's a minimum fee.

### 3. **Delivery Fee Included**
If the €5 included a delivery fee:
- Boot price: €4
- Delivery fee: €1
- Platform fee: €4 × 7% = €0.28
- You should receive: €4 - €0.28 + €1 = €4.72

**Still doesn't match €4...**

### 4. **Stripe Processing Fees Higher**
If Stripe charged more:
- Platform fee: €0.35
- Stripe fee: €0.65 (unusually high)
- Total: €1.00 ✅

---

## 🔍 What to Check in Stripe Dashboard

1. **Go to:** https://dashboard.stripe.com/payments
2. **Find the €5 payment**
3. **Click on it** to see details
4. **Check these amounts:**
   - **Gross amount:** €5.00
   - **Application fee:** Should be €0.35 (7%)
   - **Stripe fee:** Should be ~€0.32-€0.40
   - **Net amount:** What you actually received

---

## 🚨 Most Likely Issue

**The platform fee is being calculated as 20% instead of 7%**

This could happen if:
1. The code wasn't deployed correctly
2. There's a cached version running
3. The fee percentage is wrong in production

---

## ✅ Quick Check

**In your Stripe Dashboard, check:**
- What does it say for "Application fee"?
- If it says €1.00, then the platform fee is 20% (wrong)
- If it says €0.35, then something else is wrong

---

## 🔧 Fix Needed

If the application fee is €1.00 (20%), we need to:
1. Check the deployed code on Render
2. Verify the platform fee percentage is 0.07 (7%)
3. Redeploy if needed

**Please check your Stripe Dashboard and share:**
- Application fee amount
- Stripe fee amount  
- Net amount received

This will help identify the exact issue!




























