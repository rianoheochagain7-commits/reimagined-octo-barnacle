# Apple Pay Setup Guide for BootBuys

This guide will help you enable Apple Pay in your BootBuys app using Stripe PaymentSheet.

## ✅ Code Changes Completed

The following code changes have been made to enable Apple Pay:

 1. **PaymentManager.swift** - Added Apple Pay configuration to PaymentSheet
2. **PaymentConfig.swift** - Added Apple Pay merchant ID and country code settings
3. **BootBuys.entitlements** - Added Apple Pay merchant identifier capability
4. **server.js** - PaymentIntent creation already supports Apple Pay

## 📋 Setup Steps (Required)

### Step 1: Create Apple Pay Merchant Identifier

1. Go to [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list)
2. Click the **+** button to create a new identifier
3. Select **Merchant IDs** and click Continue
4. Enter a description (e.g., "BootBuys Merchant")
5. Enter an identifier: `merchant.com.bootbuys.app` (or your preferred format: `merchant.com.yourcompany.bootbuys`)
6. Click Continue and Register
7. Note: You'll need to configure this merchant ID with a payment processor certificate (we'll use Stripe's)

### Step 2: Configure Merchant ID with Stripe

1. In your Stripe Dashboard, go to **Settings** → **Apple Pay**
2. Click **Add domain** or **Manage domains**
3. For iOS apps, Stripe automatically handles merchant certificates, but you should:
   - Ensure your Stripe account is set up for Apple Pay
   - Your account should support the currency you're using (EUR in your case)

### Step 3: Configure Xcode Project

1. Open your project in Xcode
2. Select your app target
3. Go to **Signing & Capabilities** tab
4. Click **+ Capability**
5. Add **Apple Pay** capability
6. Select your merchant identifier from the dropdown (or add it if it's not listed)
   - This should match what you created in Step 1

### Step 4: Update PaymentConfig.swift

Update the merchant identifier in `PaymentConfig.swift` to match what you created:

```swift
static let applePayMerchantId: String? = "merchant.com.bootbuys.app" // Replace with your actual merchant ID
static let applePayMerchantCountryCode = "IE" // Update to your country code
```

Also update `BootBuys.entitlements` to match:

```xml
<key>com.apple.developer.in-app-payments</key>
<array>
    <string>merchant.com.bootbuys.app</string>
</array>
```

### Step 5: Test Apple Pay

1. **On a real device** (Apple Pay doesn't work in the simulator for most features):
   - Ensure you have a card added to your Wallet
   - Make a test purchase in your app
   - Apple Pay button should appear in the PaymentSheet if:
     - Device supports Apple Pay
     - User has cards in Wallet
     - Merchant ID is properly configured

2. **Test with Stripe test cards**:
   - You can use Stripe test cards with Apple Pay
   - Reference: https://stripe.com/docs/testing#apple-pay

## 🎯 How It Works

With Stripe PaymentSheet, Apple Pay is automatically integrated:

1. When `PaymentSheet` is presented, it checks if:
   - Device supports Apple Pay
   - User has payment cards in Wallet
   - Merchant ID is configured
   
2. If all conditions are met, Apple Pay appears as the first payment option

3. The PaymentSheet handles all Apple Pay authentication and processing automatically

## 🔧 Troubleshooting

### Apple Pay button not showing?

1. **Check device**: Apple Pay only works on:
   - iPhone 6 or later
   - iPad Pro, iPad Air 2, or iPad mini 3 or later
   - Apple Watch (paired with iPhone)
   - Mac with Touch ID or connected to Apple Watch

2. **Check Wallet**: User must have at least one payment card in Apple Wallet

3. **Check merchant ID**:
   - Verify it matches in Xcode capabilities
   - Verify it matches in entitlements file
   - Verify it's correct in PaymentConfig.swift

4. **Check Stripe**:
   - Ensure your Stripe account is set up correctly
   - Verify currency support (EUR is supported)

5. **Check on real device**: Apple Pay has limited functionality in simulator

### Testing Tips

- Use a real iOS device with Apple Pay configured
- Test with real or test cards in Wallet
- Check Stripe Dashboard → Payments to see payment attempts
- Use Stripe test mode keys for development

## 📚 Additional Resources

- [Stripe Apple Pay Integration](https://stripe.com/docs/apple-pay)
- [Stripe PaymentSheet iOS Guide](https://stripe.dev/stripe-ios/payment-sheet/)
- [Apple Pay Setup Guide](https://developer.apple.com/documentation/passkit/apple_pay/setting_up_apple_pay)
- [Apple Pay Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/apple-pay)

## ⚠️ Important Notes

1. **Merchant ID Format**: Must start with `merchant.` (e.g., `merchant.com.bootbuys.app`)
2. **Production**: Before submitting to App Store:
   - Use production Stripe keys
   - Ensure merchant ID is configured in production
   - Test thoroughly on real devices
3. **Currency**: Ensure your Stripe account supports EUR (or your chosen currency)
4. **Testing**: Apple Pay testing requires real devices in most cases

## ✅ Checklist Before Production

- [ ] Merchant ID created in Apple Developer Portal
- [ ] Merchant ID configured in Xcode capabilities
- [ ] Merchant ID matches in PaymentConfig.swift
- [ ] Merchant ID matches in BootBuys.entitlements
- [ ] Stripe account configured for Apple Pay
- [ ] Tested on real device with payment cards
- [ ] Production Stripe keys configured
- [ ] Country code is correct for your business

---

**Note**: Once you complete these steps, Apple Pay should automatically appear in your PaymentSheet when users have eligible devices and cards configured!



