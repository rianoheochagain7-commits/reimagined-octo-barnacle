# 🔧 Fix Firestore Rules for Purchases

## ⚠️ Problem

You're getting "Permission denied" when trying to purchase because the Firestore security rules need to be updated in Firebase Console.

## ✅ Solution: Update Firestore Rules

### Step 1: Go to Firebase Console

1. Go to: https://console.firebase.google.com
2. Select your **BootBuys** project
3. Click **Firestore Database** in left sidebar
4. Click the **Rules** tab

### Step 2: Copy These Rules

Replace your existing rules with these **updated rules** that fix the purchase issue:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Boots collection - marketplace listings
    match /boots/{bootId} {
      // Anyone authenticated can read active boots (for feed)
      allow read: if isAuthenticated() && resource.data.isActive == true;
      
      // Users can read their own boots (even if sold/inactive)
      allow read: if isAuthenticated() && resource.data.sellerId == request.auth.uid;
      
      // Users can create boots (list for sale)
      allow create: if isAuthenticated() 
                    && request.resource.data.sellerId == request.auth.uid
                    && request.resource.data.isActive == true;
      
      // Users can update their own boots
      allow update: if isAuthenticated() 
                    && resource.data.sellerId == request.auth.uid
                    && request.resource.data.sellerId == request.auth.uid;
      
      // Buyers can mark boots as sold when purchasing (FIXED)
      allow update: if isAuthenticated() 
                    && request.resource.data.buyerId == request.auth.uid
                    && request.resource.data.isActive == false
                    && request.resource.data.sellerId == resource.data.sellerId; // Prevent changing seller
      
      // Users can delete their own boots
      allow delete: if isAuthenticated() 
                    && resource.data.sellerId == request.auth.uid;
    }
    
    // Allow queries on boots collection
    match /boots/{document=**} {
      // Allow list queries for active boots (home feed)
      allow list: if isAuthenticated();
      
      // Allow queries filtered by sellerId (profile view)
      allow get: if isAuthenticated();
    }
    
    // Users collection - user profiles
    match /users/{userId} {
      // Anyone authenticated can read user profiles (for seller info)
      allow read: if isAuthenticated();
      
      // Users can create/update their own profile
      allow write: if isAuthenticated() && request.auth.uid == userId;
      
      // Allow incrementing soldItemsCount and purchasedItemsCount (FIXED)
      allow update: if isAuthenticated() 
                    && request.auth.uid == userId
                    && request.resource.data.diff(resource.data).affectedKeys()
                        .hasOnly(['soldItemsCount', 'purchasedItemsCount', 'updatedAt']);
    }
    
    // Orders collection - purchase history (FIXED)
    match /orders/{orderId} {
      // Users can read their own orders (as buyer or seller)
      allow read: if isAuthenticated() 
                  && (resource.data.buyerId == request.auth.uid 
                      || resource.data.sellerId == request.auth.uid);
      
      // Buyers can create orders when purchasing (FIXED)
      allow create: if isAuthenticated() 
                    && request.resource.data.buyerId == request.auth.uid
                    && request.resource.data.sellerId != null
                    && request.resource.data.bootId != null;
      
      // Users can update their own orders (status updates, etc.)
      allow update: if isAuthenticated() 
                    && (resource.data.buyerId == request.auth.uid 
                        || resource.data.sellerId == request.auth.uid);
    }
  }
}
```

### Step 3: Publish Rules

1. Click **Publish** button
2. Wait a few seconds for rules to propagate
3. Try purchasing again

---

## 🔍 What Was Fixed

### 1. Orders Collection
- ✅ Fixed: Buyers can now create orders (`buyerId == request.auth.uid`)
- ✅ Added: Validation that `sellerId` and `bootId` are present
- ✅ Fixed: Removed confusing `sellerId == request.auth.uid` check for create

### 2. Boots Collection  
- ✅ Fixed: Buyers can mark boots as sold (`buyerId == request.auth.uid`)
- ✅ Added: Validation that seller doesn't change when marking as sold

### 3. Users Collection
- ✅ Fixed: Allow incrementing `soldItemsCount` and `purchasedItemsCount` during purchase

---

## ✅ After Updating Rules

1. **Publish** the rules in Firebase Console
2. **Wait 5-10 seconds** for rules to propagate
3. **Try purchasing again** - should work now!

---

## 🐛 Still Getting Errors?

If you still get permission denied:

1. **Check you're signed in** - Make sure you're authenticated in the app
2. **Check Firebase Console** - Verify rules were published successfully
3. **Check Xcode console** - Look for specific error messages
4. **Verify user ID** - Make sure `request.auth.uid` matches your Firebase user ID

---

## 📋 Quick Checklist

- [ ] Opened Firebase Console
- [ ] Went to Firestore Database → Rules
- [ ] Copied new rules above
- [ ] Clicked Publish
- [ ] Waited 5-10 seconds
- [ ] Tried purchase again

---

**These rules should fix your purchase permission issue!** 🚀



