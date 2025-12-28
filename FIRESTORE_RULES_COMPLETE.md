# Complete Firestore Security Rules for BootBuys Marketplace

## Copy these rules into Firebase Console > Firestore Database > Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns a document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Boots collection - marketplace listings
    match /boots/{bootId} {
      // Anyone authenticated can read active boots (for feed)
      allow read: if isAuthenticated() && resource.data.isActive == true;
      
      // Users can read their own boots (even if sold)
      allow read: if isAuthenticated() && resource.data.sellerId == request.auth.uid;
      
      // Users can create boots (list for sale)
      allow create: if isAuthenticated() 
                    && request.resource.data.sellerId == request.auth.uid
                    && request.resource.data.isActive == true;
      
      // Users can update their own boots
      allow update: if isAuthenticated() 
                    && resource.data.sellerId == request.auth.uid
                    && request.resource.data.sellerId == request.auth.uid;
      
      // Users can mark their own boots as sold
      allow update: if isAuthenticated() 
                    && resource.data.sellerId == request.auth.uid
                    && request.resource.data.isActive == false;
      
      // Buyers can mark boots as sold when purchasing
      allow update: if isAuthenticated() 
                    && request.resource.data.buyerId == request.auth.uid
                    && request.resource.data.isActive == false;
      
      // Users can delete their own boots
      allow delete: if isAuthenticated() 
                    && resource.data.sellerId == request.auth.uid;
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
      
      // Users can update their own orders (status updates, etc.)
      allow update: if isAuthenticated() 
                    && (resource.data.buyerId == request.auth.uid 
                        || resource.data.sellerId == request.auth.uid);
    }
  }
}
```

## Important Notes

1. **Boots Collection**: 
   - Authenticated users can read all active boots (for the home feed)
   - Users can only create/update/delete their own boots
   - Buyers can mark boots as sold when purchasing

2. **Users Collection**:
   - Anyone authenticated can read profiles (to see seller info)
   - Users can only write their own profile

3. **Orders Collection**:
   - Users can read orders where they are the buyer or seller
   - Orders are created during purchase

## After Updating Rules

1. Click **Publish** in Firebase Console
2. Wait a few seconds for rules to propagate
3. Try uploading a boot again
4. Try purchasing a boot

The marketplace should now work smoothly!







