# Firebase Storage Security Rules for BootBuys

## Required Rules - Copy into Firebase Console > Storage > Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // ============================================
    // Helper Functions
    // ============================================
    
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if file is an image
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }
    
    // Check if file size is reasonable (max 10MB)
    function isValidSize() {
      return request.resource.size < 10 * 1024 * 1024;
    }
    
    // ============================================
    // Boot Images - Product Photos
    // ============================================
    
    match /boot_images/{imageId} {
      // Anyone authenticated can read/view boot images
      allow read: if isAuthenticated();
      
      // Authenticated users can upload boot images
      // Must be: signed in, image file, under 10MB
      allow write: if isAuthenticated()
                   && isImage()
                   && isValidSize();
    }
    
    // ============================================
    // Profile Images - User Avatars (Optional)
    // ============================================
    
    match /profile_images/{userId}/{imageId} {
      // Anyone authenticated can read profile images
      allow read: if isAuthenticated();
      
      // Users can only upload their own profile image
      allow write: if isAuthenticated()
                   && request.auth.uid == userId
                   && isImage()
                   && isValidSize();
    }
    
    // ============================================
    // Default Deny - Secure by Default
    // ============================================
    
    // Deny all other paths for security
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## How to Update Storage Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your **bootbuys** project
3. Click **Storage** in the left sidebar
4. Click the **Rules** tab
5. Replace the existing rules with the rules above
6. Click **Publish**

## Important Notes

- These rules allow authenticated users to:
  - **Read** all boot images (for displaying in the app)
  - **Upload** images to the `boot_images` folder (max 10MB per image, images only)
  
- Users must be signed in to upload images
- Images are limited to 10MB each to prevent abuse
- Only image files are allowed (image/* content types)

## Troubleshooting

If you're getting "Permission denied" errors:
1. Make sure you're signed in to the app
2. Check that Storage rules are published (not just saved)
3. Verify the rules match exactly what's shown above
4. Make sure Firebase Storage is enabled in your Firebase project

