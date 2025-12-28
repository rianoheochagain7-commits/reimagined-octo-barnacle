# Firebase Account Creation Troubleshooting Guide

## Issue: Account creation fails with "Unable to create account" error

### Step 1: Check Xcode Console Logs

When you tap "Create Account", look for these logs in the Xcode console:

1. **Firebase Configuration Check:**
   ```
   🔍 ========== SIGN UP ATTEMPT ==========
   🔍 Firebase configured: true/false
   ```

2. **If Firebase is NOT configured:**
   ```
   ❌ CRITICAL: Firebase is not configured!
   ❌ GoogleService-Info.plist may be missing or not added to the project
   ```

3. **If Firebase Auth fails:**
   ```
   ❌ Error occurred during sign up
   ❌ Error domain: FIRAuthErrorDomain
   ❌ Error code: [number]
   ❌ Error description: [description]
   ```

### Step 2: Verify Firebase Setup

#### A. Check if GoogleService-Info.plist exists

1. Open Xcode
2. In the Project Navigator, look for `GoogleService-Info.plist`
3. If it's missing, you need to download it from Firebase Console

#### B. Download GoogleService-Info.plist from Firebase Console

1. Go to https://console.firebase.google.com/
2. Select your BootBuys project
3. Click the gear icon (⚙️) next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. Find your iOS app and click the download button for `GoogleService-Info.plist`
7. Save it to your computer

#### C. Add GoogleService-Info.plist to Xcode

1. In Xcode, right-click on your project folder (BootBuys)
2. Select "Add Files to BootBuys..."
3. Navigate to and select the `GoogleService-Info.plist` file
4. **IMPORTANT:** Make sure "Copy items if needed" is checked
5. **IMPORTANT:** Make sure your app target (BootBuys) is checked in "Add to targets"
6. Click "Add"

#### D. Verify the file is in the bundle

1. Select `GoogleService-Info.plist` in Xcode
2. In the File Inspector (right panel), check "Target Membership"
3. Make sure "BootBuys" is checked ✅

### Step 3: Verify Firebase Console Configuration

#### A. Enable Authentication

1. Go to Firebase Console → Authentication
2. Click "Get Started" if you haven't already
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider:
   - Click "Email/Password"
   - Toggle "Enable" ON
   - Click "Save"

#### B. Create Firestore Database

1. Go to Firebase Console → Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (for now)
4. Select a location (choose closest to your users)
5. Click "Enable"

#### C. Set Firestore Security Rules (for authenticated users)

1. Go to Firestore Database → Rules tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

### Step 4: Test Account Creation

1. Clean build folder: Product → Clean Build Folder (⇧⌘K)
2. Build and run the app
3. Try creating an account
4. Check the console logs for detailed error messages

### Step 5: Common Errors and Solutions

#### Error: "Firebase is not configured"
- **Solution:** `GoogleService-Info.plist` is missing or not added to the target
- Follow Step 2 above

#### Error: "Permission denied" (Error code 7)
- **Solution:** Firestore security rules are blocking writes
- Update Firestore rules as shown in Step 3C

#### Error: "Email already exists" (Error code 17007)
- **Solution:** The email is already registered
- Try a different email or sign in instead

#### Error: "Network error" (Error code 17020)
- **Solution:** Check your internet connection
- Verify device can reach Firebase servers

#### Error: "Invalid email" (Error code 17008)
- **Solution:** Email format is invalid
- Check the email address format

### Step 6: Debug Checklist

- [ ] `GoogleService-Info.plist` exists in Xcode project
- [ ] `GoogleService-Info.plist` is added to app target
- [ ] Firebase Authentication is enabled in Firebase Console
- [ ] Email/Password provider is enabled
- [ ] Firestore Database is created
- [ ] Firestore security rules allow authenticated writes
- [ ] App has internet connection
- [ ] Console shows "✅ Firebase configured successfully" on app launch

### Need More Help?

If account creation still fails after following these steps:

1. Share the exact error message from the console
2. Share the error code (if shown)
3. Confirm Firebase is configured (check console for "✅ Firebase configured successfully")
4. Verify `GoogleService-Info.plist` is in the project and target

The console logs will tell us exactly what's failing!



