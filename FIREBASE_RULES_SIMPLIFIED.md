# 🔥 Simplified Firebase Rules - For Testing

## ⚠️ IMPORTANT: Use These Simplified Rules First

These rules are more permissive to ensure messages and profile pictures work. Once everything is working, we can tighten security.

---

## Step 1: Update Firestore Rules

Go to **Firebase Console → Firestore Database → Rules** and paste this:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Boots collection
    match /boots/{bootId} {
      allow read: if isAuthenticated() && resource.data.isActive == true;
      allow read: if isAuthenticated() && resource.data.sellerId == request.auth.uid;
      allow create: if isAuthenticated() 
                    && request.resource.data.sellerId == request.auth.uid
                    && request.resource.data.isActive == true;
      allow update: if isAuthenticated() 
                    && resource.data.sellerId == request.auth.uid
                    && resource.data.sellerId == request.auth.uid;
      allow update: if isAuthenticated() 
                    && request.resource.data.buyerId == request.auth.uid
                    && request.resource.data.isActive == false
                    && request.resource.data.sellerId == resource.data.sellerId;
      allow delete: if isAuthenticated() 
                    && resource.data.sellerId == request.auth.uid;
    }
    
    match /boots/{document=**} {
      allow list: if isAuthenticated();
      allow get: if isAuthenticated();
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAuthenticated() 
                    && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['email', 'displayName', 'photoURL', 'uid']));
    }
    
    // Orders collection
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
    
    // Reports collection
    match /reports/{reportId} {
      allow create: if isAuthenticated() 
                    && request.resource.data.reporterId == request.auth.uid;
      allow read: if isAuthenticated();
    }
    
    // BlockedUsers collection
    match /blockedUsers/{blockId} {
      allow create: if isAuthenticated() 
                    && request.resource.data.userId == request.auth.uid;
      allow read: if isAuthenticated() 
                  && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() 
                    && resource.data.userId == request.auth.uid;
    }
    
    // Follows collection
    match /follows/{followId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() 
                    && request.resource.data.followerId == request.auth.uid
                    && request.resource.data.followingId != request.auth.uid;
      allow delete: if isAuthenticated() 
                    && resource.data.followerId == request.auth.uid;
    }
    
    // ⭐ CONVERSATIONS - SIMPLIFIED (More permissive)
    match /conversations/{conversationId} {
      // Allow any authenticated user to read/write conversations
      allow read, write: if isAuthenticated();
      
      // Messages subcollection
      match /messages/{messageId} {
        // Allow any authenticated user to read/write messages
        allow read, write: if isAuthenticated();
      }
    }
  }
}
```

**Click Publish!**

---

## Step 2: Update Storage Rules

Go to **Firebase Console → Storage → Rules** and paste this:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }
    
    function isValidSize() {
      return request.resource.size < 10 * 1024 * 1024;
    }
    
    // Boot Images
    match /boot_images/{imageId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isImage() && isValidSize();
    }
    
    // Profile Images - SIMPLIFIED (More permissive)
    match /profile_images/{allPaths=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isImage() && isValidSize();
    }
    
    // Default Deny
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

**Click Publish!**

---

## Why These Rules Are Simplified

1. **Conversations**: Any authenticated user can read/write (we'll tighten later)
2. **Messages**: Any authenticated user can read/write (we'll tighten later)
3. **Profile Images**: Any authenticated user can upload (we'll tighten later)

This ensures everything works first, then we can add proper security checks.

---

## Test After Updating Rules

1. **Send a message** - Should save to Firestore
2. **Upload profile picture** - Should save to Storage
3. **Swipe out of app** - Close completely
4. **Reopen app** - Messages and profile picture should still be there

---

## Check Console Logs

Look for these messages in Xcode console:

**For Messages:**
- `📤 MessageManager: Sending message`
- `✅ MessageManager: Message saved to Firestore`
- `✅ MessageManager: Created conversation in Firestore`

**For Profile Pictures:**
- `💾 ProfileView: Saving profile with image URL`
- `✅ ProfileView: Profile image saved successfully`

If you see `❌` errors, share them and I'll help fix!








