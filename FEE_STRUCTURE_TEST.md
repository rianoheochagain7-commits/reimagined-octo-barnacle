# 💰 Updated Fee Structure Test

## 🎯 **New Fee Structure**
- **Boots under €100**: 5% platform fee
- **Boots €100 and over**: 7% platform fee

## 🧪 **Test Examples**

### **Example 1: €80 Boot (5% fee)**
- **Customer pays**: €80
- **Platform fee**: €4.00 (5%)
- **Seller gets**: €76.00 (95%)
- **Stripe fees**: ~€1.37
- **Your net**: €4.00

### **Example 2: €100 Boot (7% fee)**
- **Customer pays**: €100
- **Platform fee**: €7.00 (7%)
- **Seller gets**: €93.00 (93%)
- **Stripe fees**: ~€1.65
- **Your net**: €7.00

### **Example 3: €150 Boot (7% fee)**
- **Customer pays**: €150
- **Platform fee**: €10.50 (7%)
- **Seller gets**: €139.50 (93%)
- **Stripe fees**: ~€2.35
- **Your net**: €10.50

### **Example 4: €200 Boot (7% fee)**
- **Customer pays**: €200
- **Platform fee**: €14.00 (7%)
- **Seller gets**: €186.00 (93%)
- **Stripe fees**: ~€3.05
- **Your net**: €14.00

## 🚀 **Test Your New Fee Structure**

### **Start Backend:**
```bash
cd stripe-backend
npm start
```

### **Test Different Amounts:**
```bash
# Test €80 boot (5% fee)
curl -X POST http://localhost:3000/api/payment-intents \
  -H "Content-Type: application/json" \
  -d '{"amount": 80}'

# Test €100 boot (7% fee)
curl -X POST http://localhost:3000/api/payment-intents \
  -H "Content-Type: application/json" \
  -d '{"amount": 100}'

# Test €150 boot (7% fee)
curl -X POST http://localhost:3000/api/payment-intents \
  -H "Content-Type: application/json" \
  -d '{"amount": 150}'
```

## 📊 **Revenue Impact**

### **Higher Revenue on Premium Boots:**
- **€100+ boots** now generate **40% more fees** (7% vs 5%)
- **€200 boot** = €14 fee vs €10 fee (€4 more per transaction)
- **€300 boot** = €21 fee vs €15 fee (€6 more per transaction)

### **Your Earnings Potential:**
- **10 premium boots/day** = €70/day = €2,100/month
- **20 premium boots/day** = €140/day = €4,200/month
- **50 premium boots/day** = €350/day = €10,500/month

## ✅ **What's Updated:**
- ✅ **Backend fee calculation** (dynamic 5%/7%)
- ✅ **PaymentConfig.swift** (fee constants and helpers)
- ✅ **Documentation** (updated fee structure)
- ✅ **Metadata tracking** (fee percentage in transactions)

**Your BootBuys marketplace now has a premium fee structure for higher-value boots!** 💰🎉


