# Complete Firestore Security Rules for BootBuys Marketplace

## Required Rules - Copy into Firebase Console > Firestore Database > Rules

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
      
      // Buyers can mark boots as sold when purchasing
      allow update: if isAuthenticated() 
                    && request.resource.data.buyerId == request.auth.uid
                    && request.resource.data.isActive == false;
      
      // Users can delete their own boots
      allow delete: if isAuthenticated() 
                    && resource.data.sellerId == request.auth.uid;
    }
    
    // Allow queries on boots collection
    // CRITICAL: This allows users to query their own boots by sellerId
    match /boots/{document=**} {
      // Allow list queries for active boots (home feed)
      allow list: if isAuthenticated();
      
      // Allow queries filtered by sellerId (profile view)
      // Users can query boots where sellerId matches their UID
      allow get: if isAuthenticated();
    }
    
    // Users collection - user profiles
    match /users/{userId} {
      // Anyone authenticated can read user profiles (for seller info)
      allow read: if isAuthenticated();
      
      // Users can create/update their own profile
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // Orders collection - purchase history
    match /orders/{orderId} {
      // Users can read their own orders (as buyer or seller)
      allow read: if isAuthenticated() 
                  && (resource.data.buyerId == request.auth.uid 
                      || resource.data.sellerId == request.auth.uid);
      
      // System can create orders (when purchase happens)
      allow create: if isAuthenticated() 
                    && (request.resource.data.buyerId == request.auth.uid 
                        || request.resource.data.sellerId == request.auth.uid);
      
      // Users can update their own orders
      allow update: if isAuthenticated() 
                    && (resource.data.buyerId == request.auth.uid 
                        || resource.data.sellerId == request.auth.uid);
    }
  }
}
```

## How to Update Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your **bootbuys** project
3. Click **Firestore Database** in the left sidebar
4. Click the **Rules** tab
5. Replace the existing rules with the rules above
6. Click **Publish**

## Important Notes

- These rules allow authenticated users to:
  - **Read** all boots (for the home feed)
  - **Create** boots (when listing)
  - **Update/Delete** only their own boots (matching `sellerId` with `request.auth.uid`)

- The `users` collection allows users to read any profile but only write their own

After updating the rules, try uploading a boot again. The error should be resolved.

