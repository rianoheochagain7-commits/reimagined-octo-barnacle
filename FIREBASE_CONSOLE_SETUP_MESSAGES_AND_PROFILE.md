# 🔥 Firebase Console Setup - Messages & Profile Pictures

## ⚠️ CRITICAL: You MUST update Firebase Console for messages and profile pictures to work!

The code is ready, but Firebase won't allow saving until you update the security rules.

---

## Step 1: Update Firestore Rules (For Messages)

### 1. Go to Firebase Console
- Visit: https://console.firebase.google.com
- Select your **BootBuys** project

### 2. Open Firestore Rules
- Click **Firestore Database** in the left sidebar
- Click the **Rules** tab at the top

### 3. Copy and Paste These Rules

**IMPORTANT:** Copy the ENTIRE content from `firestore.rules` file, or use this:

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
                    && resource.data.sellerId == request.auth.uid;
      
      // Buyers can mark boots as sold when purchasing (FIXED)
      allow update: if isAuthenticated() 
                    && request.resource.data.buyerId == request.auth.uid
                    && request.resource.data.isActive == false
                    && request.resource.data.sellerId == resource.data.sellerId;
      
      // Users can delete their own boots
      allow delete: if isAuthenticated() 
                    && resource.data.sellerId == request.auth.uid;
    }
    
    // Allow queries on boots collection
    match /boots/{document=**} {
      allow list: if isAuthenticated();
      allow get: if isAuthenticated();
    }
    
    // Users collection - user profiles
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAuthenticated() 
                    && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['email', 'displayName', 'photoURL', 'uid']));
    }
    
    // Orders collection - purchase history
    match /orders/{orderId} {
      allow read: if isAuthenticated() 
                  && (resource.data.buyerId == request.auth.uid 
                      || resource.data.sellerId == request.auth.uid);
      allow create: if isAuthenticated() 
                    && request.resource.data.buyerId == request.auth.uid
                    && request.resource.data.sellerId != null
                    && request.resource.data.bootId != null;
      allow update: if isAuthenticated() 
                    && (resource.data.buyerId == request.auth.uid 
                        || resource.data.sellerId == request.auth.uid);
    }
    
    // Reports collection - user reports for moderation
    match /reports/{reportId} {
      allow create: if isAuthenticated() 
                    && request.resource.data.reporterId == request.auth.uid;
      allow read: if isAuthenticated() 
                  && resource.data.reporterId == request.auth.uid;
      allow read: if isAuthenticated();
      allow update: if isAuthenticated() 
                    && resource.data.reporterId == request.auth.uid;
    }
    
    // BlockedUsers collection - user blocking
    match /blockedUsers/{blockId} {
      allow create: if isAuthenticated() 
                    && request.resource.data.userId == request.auth.uid;
      allow read: if isAuthenticated() 
                  && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() 
                    && resource.data.userId == request.auth.uid;
    }
    
    // Follows collection - follow relationships
    match /follows/{followId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() 
                    && request.resource.data.followerId == request.auth.uid
                    && request.resource.data.followingId != request.auth.uid;
      allow delete: if isAuthenticated() 
                    && resource.data.followerId == request.auth.uid;
    }
    
    // ⭐ NEW: Conversations collection - chat conversations
    match /conversations/{conversationId} {
      // Users can read conversations they're part of
      allow read: if isAuthenticated() 
                  && (conversationId.contains(request.auth.uid));
      
      // Users can create conversations
      allow create: if isAuthenticated();
      
      // Users can update conversations they're part of
      allow update: if isAuthenticated() 
                    && (conversationId.contains(request.auth.uid));
      
      // Messages subcollection
      match /messages/{messageId} {
        // Users can read messages in conversations they're part of
        allow read: if isAuthenticated() 
                    && (conversationId.contains(request.auth.uid));
        
        // Users can create messages in conversations they're part of
        allow create: if isAuthenticated() 
                      && (conversationId.contains(request.auth.uid))
                      && request.resource.data.senderId == request.auth.uid;
        
        // Users can update their own messages (status updates)
        allow update: if isAuthenticated() 
                      && (conversationId.contains(request.auth.uid))
                      && resource.data.senderId == request.auth.uid;
        
        // Users can delete their own messages
        allow delete: if isAuthenticated() 
                      && (conversationId.contains(request.auth.uid))
                      && resource.data.senderId == request.auth.uid;
      }
    }
  }
}
```

### 4. Publish Rules
- Click **Publish** button
- Wait for "Rules published successfully" message

---

## Step 2: Update Storage Rules (For Profile Pictures)

### 1. Go to Storage Rules
- In Firebase Console, click **Storage** in the left sidebar
- Click the **Rules** tab at the top

### 2. Copy and Paste These Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper Functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }
    
    function isValidSize() {
      return request.resource.size < 10 * 1024 * 1024;
    }
    
    // Boot Images - Product Photos
    match /boot_images/{imageId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated()
                   && isImage()
                   && isValidSize();
    }
    
    // ⭐ Profile Images - User Avatars
    match /profile_images/{userId}/{imageId} {
      // Anyone authenticated can read profile images
      allow read: if isAuthenticated();
      
      // Users can only upload their own profile image
      allow write: if isAuthenticated()
                   && request.auth.uid == userId
                   && isImage()
                   && isValidSize();
    }
    
    // Default Deny - Secure by Default
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### 3. Publish Rules
- Click **Publish** button
- Wait for "Rules published successfully" message

---

## Step 3: Verify Everything is Enabled

### Check Firestore Database
- ✅ Go to **Firestore Database**
- ✅ Should see "Database created" status
- ✅ If not, click "Create Database" and choose location

### Check Storage
- ✅ Go to **Storage**
- ✅ Should see "Storage bucket created" status
- ✅ If not, click "Get Started" to enable Storage

### Check Authentication
- ✅ Go to **Authentication**
- ✅ Click **Sign-in method** tab
- ✅ Make sure **Email/Password** is enabled

---

## Step 4: Test

After updating the rules:

1. **Test Messages:**
   - Send a message to a user
   - Check Xcode console for: `✅ MessageManager: Message saved to Firestore`
   - Swipe out of app
   - Reopen app
   - Messages should still be there

2. **Test Profile Picture:**
   - Upload a profile picture
   - Check Xcode console for: `✅ ProfileView: Profile image saved successfully`
   - Swipe out of app
   - Reopen app
   - Profile picture should still be there

---

## ⚠️ Common Issues

### "Permission denied" errors
- **Cause:** Rules not published or incorrect
- **Fix:** Make sure you clicked **Publish** (not just Save)
- **Fix:** Copy rules exactly as shown above

### Messages not saving
- **Cause:** Conversations rules missing
- **Fix:** Make sure the `conversations` collection rules are in Firestore rules

### Profile pictures not saving
- **Cause:** Storage rules missing or Storage not enabled
- **Fix:** Make sure Storage is enabled and `profile_images` rules are added

---

## ✅ Checklist

- [ ] Firestore rules updated with `conversations` collection
- [ ] Firestore rules **Published** (not just saved)
- [ ] Storage rules updated with `profile_images` path
- [ ] Storage rules **Published** (not just saved)
- [ ] Firestore Database is enabled
- [ ] Storage is enabled
- [ ] Authentication Email/Password is enabled

---

**After completing these steps, messages and profile pictures will persist! 🎉**








