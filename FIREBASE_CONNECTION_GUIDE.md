# How to Connect Firebase to BootBuys App

## Step-by-Step Guide

### Step 1: Create or Select Firebase Project

1. Go to https://console.firebase.google.com/
2. Sign in with your Google account
3. **If you don't have a project yet:**
   - Click "Add project" or "Create a project"
   - Enter project name: `BootBuys`
   - Click "Continue"
   - **Disable** Google Analytics (or enable if you want it)
   - Click "Create project"
   - Wait for project creation (takes ~30 seconds)

4. **If you already have a project:**
   - Click on your project name from the list

### Step 2: Add iOS App to Firebase Project

1. In your Firebase project dashboard, click the **iOS icon** (🍎) or "Add app"
2. If you see "Add app" button, click it and select iOS
3. Fill in the iOS app details:
   - **iOS bundle ID:** This is your app's bundle identifier
     - To find it: Open Xcode → Select your project → General tab → Look for "Bundle Identifier"
     - It should be something like: `com.bootbuys.app` or `com.yourname.bootbuys`
   - **App nickname (optional):** BootBuys iOS
   - **App Store ID (optional):** Leave blank for now
4. Click "Register app"

### Step 3: Download GoogleService-Info.plist

1. On the next screen, you'll see instructions to download `GoogleService-Info.plist`
2. Click the **"Download GoogleService-Info.plist"** button
3. Save the file somewhere you can find it (like Desktop)

### Step 4: Add GoogleService-Info.plist to Xcode

1. Open your BootBuys project in Xcode
2. In the Project Navigator (left sidebar), find your `BootBuys` folder (the blue folder icon)
3. Right-click on the `BootBuys` folder (NOT the project root)
4. Select **"Add Files to BootBuys..."**
5. Navigate to where you saved `GoogleService-Info.plist`
6. Select the file
7. **IMPORTANT:** Check these options:
   - ✅ "Copy items if needed" (should be checked)
   - ✅ "BootBuys" under "Add to targets" (should be checked)
8. Click **"Add"**

### Step 5: Verify File is Added Correctly

1. In Xcode, you should now see `GoogleService-Info.plist` in your project
2. Click on `GoogleService-Info.plist` to select it
3. In the File Inspector (right panel), check "Target Membership"
4. Make sure **"BootBuys"** is checked ✅

### Step 6: Enable Firebase Authentication

1. Go back to Firebase Console
2. In the left sidebar, click **"Authentication"**
3. Click **"Get Started"** (if you see it)
4. Click the **"Sign-in method"** tab
5. Click on **"Email/Password"**
6. Toggle **"Enable"** ON
7. Click **"Save"**

### Step 7: Create Firestore Database

1. In Firebase Console, click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll secure it later)
4. Choose a location:
   - For Ireland: Select **"europe-west1"** (Belgium) or **"europe-west3"** (Frankfurt)
   - Or choose the closest to your users
5. Click **"Enable"**
6. Wait for database creation (takes ~1 minute)

### Step 8: Update Firestore Security Rules

1. In Firestore Database, click the **"Rules"** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read all user profiles (for public profiles)
    match /users/{userId} {
      allow read: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### Step 9: Verify Connection in Xcode

1. In Xcode, clean the build folder:
   - Press **⇧⌘K** (Shift + Command + K)
   - Or: Product → Clean Build Folder

2. Build and run the app:
   - Press **⌘R** (Command + R)
   - Or: Product → Run

3. Check the Xcode console (bottom panel) for:
   ```
   ✅ Firebase configured successfully
   ✅ Firebase app name: [DEFAULT]
   ```

4. If you see this, Firebase is connected! ✅

### Step 10: Test Account Creation

1. Run the app
2. Go through the sign-up flow
3. Tap "Create Account"
4. Check the console for:
   ```
   🔍 ========== SIGN UP ATTEMPT ==========
   🔍 Firebase configured: true
   ```

## Troubleshooting

### "Firebase is not configured" error
- Make sure `GoogleService-Info.plist` is in your Xcode project
- Make sure it's added to the "BootBuys" target
- Clean build folder and rebuild

### "Permission denied" error
- Make sure Firestore security rules are published
- Make sure Authentication is enabled

### Can't find Bundle Identifier
1. Open Xcode
2. Click on your project (blue icon) in the Project Navigator
3. Select the "BootBuys" target
4. Go to "General" tab
5. Look for "Bundle Identifier" - it should be something like `com.bootbuys.app`
6. Copy this exact value to Firebase when adding the iOS app

## You're Done!

Once you see `✅ Firebase configured successfully` in the console, Firebase is connected and account creation should work!



