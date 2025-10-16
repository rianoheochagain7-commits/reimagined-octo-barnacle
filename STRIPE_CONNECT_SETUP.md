# 💰 Stripe Connect Setup Guide - Make Money from Transactions

## 🎯 **What This Enables**
- ✅ **You receive 5% platform fee** from every transaction
- ✅ **Sellers get 95%** of their boot sales
- ✅ **Automatic payouts** to your bank account
- ✅ **Professional marketplace** functionality

## 🔧 **Step 1: Enable Stripe Connect**

### **In Your Stripe Dashboard:**
1. **Go to [Stripe Dashboard](https://dashboard.stripe.com)**
2. **Click "Connect"** in the left sidebar
3. **Click "Get Started"**
4. **Choose "Express accounts"** (recommended)
5. **Complete the setup** (takes 5 minutes)

## 🔧 **Step 2: Configure Your Platform**

### **Platform Settings:**
- **Platform Name**: BootBuys
- **Business Type**: Marketplace
- **Country**: Ireland
- **Currency**: EUR

## 🔧 **Step 3: Update Your App**

### **Backend is Ready!** ✅
Your backend now supports:
- ✅ **Connect account creation**
- ✅ **Seller onboarding**
- ✅ **Platform fee collection (5%)**
- ✅ **Automatic transfers**

### **Frontend Integration Needed:**
You'll need to add seller onboarding to your app:

```swift
// Add to your app
struct SellerOnboardingView: View {
    @State private var stripeAccountId: String?
    @State private var onboardingURL: String?
    
    var body: some View {
        VStack {
            Text("Set Up Payments")
                .font(.title)
            
            Text("Complete your seller profile to receive payments")
                .font(.body)
            
            Button("Start Onboarding") {
                createStripeAccount()
            }
            .buttonStyle(PrimaryButtonStyle())
        }
    }
    
    private func createStripeAccount() {
        // Call your backend to create Connect account
        // POST /api/connect/accounts
    }
}
```

## 💰 **How Money Flow Works**

### **Transaction Flow:**
1. **Customer pays €100** for boots
2. **Stripe processes payment** → €100 in your account
3. **Platform fee (7% for €100+)** → €7 goes to you
4. **Seller payout (93%)** → €93 goes to seller
5. **Automatic transfers** → Money moves to seller's bank

### **Fee Structure:**
- **Boots under €100**: 5% platform fee
- **Boots €100 and over**: 7% platform fee
- **Example**: €150 boot = €10.50 platform fee (7%)

### **Your Earnings:**
- **€5 per €100 transaction** (5%)
- **€7 per €100 transaction** (7% for premium boots)
- **€10.50 per €150 transaction** (7%)
- **€14 per €200 transaction** (7%)

## 🚀 **Quick Start**

### **Step 1: Start Backend**
```bash
cd stripe-backend
npm start
```

### **Step 2: Test Connect**
```bash
# Create a test Connect account
curl -X POST http://localhost:3000/api/connect/accounts \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "country": "IE"}'
```

### **Step 3: Test Payment with Fees**
```bash
# Create payment with platform fee
curl -X POST http://localhost:3000/api/payment-intents \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "sellerId": "acct_test123"}'
```

## 📊 **Dashboard Monitoring**

### **In Stripe Dashboard:**
1. **"Connect" → "Accounts"** → See all sellers
2. **"Payments"** → See all transactions
3. **"Transfers"** → See payouts to sellers
4. **"Balance"** → See your platform fees

## 🎯 **Next Steps**

### **Immediate Actions:**
1. **Enable Connect** in Stripe Dashboard
2. **Test the backend** endpoints
3. **Add seller onboarding** to your app
4. **Test a real transaction**

### **Production Setup:**
1. **Add your bank account** for payouts
2. **Set up webhooks** for payment events
3. **Add seller verification** process
4. **Implement dispute handling**

## 💡 **Pro Tips**

### **Maximize Earnings:**
- **Higher transaction volume** = more platform fees
- **Premium seller features** = additional revenue
- **Listing fees** = extra income stream

### **Seller Experience:**
- **Quick onboarding** = more sellers
- **Fast payouts** = happy sellers
- **Clear fee structure** = transparency

## 🚨 **Important Notes**

### **Compliance:**
- **KYC verification** required for sellers
- **Tax reporting** for platform fees
- **PCI compliance** for payment data

### **Fees Structure:**
- **Stripe fees**: 1.4% + €0.25 per transaction
- **Platform fee**: 5% (under €100) or 7% (€100+)
- **Seller gets**: ~93.6% (under €100) or ~91.6% (€100+) after all fees

## 🎉 **You're Ready to Make Money!**

Your BootBuys marketplace is now configured to:
- ✅ **Collect platform fees**
- ✅ **Process seller payouts**
- ✅ **Handle Connect accounts**
- ✅ **Scale your revenue**

**Start the backend and test your first transaction with fees!** 💰🚀
