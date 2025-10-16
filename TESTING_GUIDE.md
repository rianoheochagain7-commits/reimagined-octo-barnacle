# 🚀 BootBuys Testing Guide

## Quick Start - Test Stripe Payments

### 1. Start the Backend Server
```bash
# In your terminal, run:
./start-stripe-backend.sh
```
The server will start on `http://localhost:3000`

### 2. Add Sample Boots to Test With

**Option A: Use Admin Dashboard (Recommended)**
1. Build and run your iOS app
2. Sign in with admin credentials:
   - Email: `Rianoheochagain7@gmail.com`
   - Password: `CENTREBACK6`
3. Go to **Profile** → **Admin Dashboard**
4. Tap **"Sample Data"** tab
5. Tap **"Create Sample Boots"**
6. You'll see 6 sample boots added to the database

**Option B: Programmatic (Alternative)**
The sample boots will be created automatically when you access the admin dashboard.

### 3. Test the Complete Flow

1. **Home Feed**: You should now see 6 sample boots
2. **Tap any boot** to view details
3. **Tap "Buy Now"** to go to payment
4. **Tap "Pay €X.XX"** button
5. **Stripe PaymentSheet** will appear
6. **Enter test card details**:
   - Card: `4242424242424242`
   - Expiry: `12/25`
   - CVC: `123`
7. **Complete payment** and see success screen

### 4. Sample Boots Available

- **Nike Phantom Luna II** - €180 (Excellent)
- **Adidas Predator Edge** - €220 (Good)  
- **Puma Future Z 4.4** - €150 (Like New)
- **Nike Mercurial Vapor 15** - €200 (Excellent)
- **Adidas Copa Mundial** - €120 (Good)
- **Under Armour Magnetico Pro** - €160 (Excellent)

### 5. Test Cards

- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **3D Secure**: `4000002500003155`
- **Expiry**: Any future date
- **CVC**: Any 3 digits

### 6. What You'll See

✅ **Real Firebase data** - Boots persist between app sessions  
✅ **Real Stripe payments** - Actual payment processing  
✅ **Real-time updates** - Changes appear instantly  
✅ **Success/failure handling** - Proper error messages  

### 7. Troubleshooting

**No boots in feed?**
- Check admin dashboard → Sample Data tab → Create Sample Boots

**Payment fails?**
- Make sure backend server is running (`./start-stripe-backend.sh`)
- Check console logs for errors

**Backend not starting?**
- Install Node.js: https://nodejs.org/
- Run `npm install` in `stripe-backend/` folder

### 8. Admin Credentials

- **Email**: `Rianoheochagain7@gmail.com`
- **Password**: `CENTREBACK6`

---

🎉 **You now have a fully functional BootBuys app with real Firebase data and Stripe payments!**


