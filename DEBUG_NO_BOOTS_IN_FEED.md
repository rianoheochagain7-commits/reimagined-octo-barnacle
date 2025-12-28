# 🔍 Debug: No Boots Showing in Feed

## Problem
When logging in with a different account, no boots appear in the home feed.

## Possible Causes

### 1. No Boots in Database
- There might not be any boots in Firestore
- Boots might all be marked as `isActive: false` (sold)

### 2. Boots Have Invalid Seller IDs
The app filters out boots with invalid `sellerId` values. Valid sellerIds must:
- ✅ Be 20-30 characters long
- ✅ Be alphanumeric only (letters and numbers)
- ✅ NOT contain underscores (`_`) or hyphens (`-`)
- ✅ NOT contain words like "test", "sample", "dummy", "preview", "mock"
- ✅ NOT be exact matches like "preview_user", "dummy", "test", "test123"

### 3. Firestore Query Issue
- Boots might not have `isActive: true` field
- Query might be failing due to missing index

---

## ✅ How to Fix

### Step 1: Check Firestore Database

1. **Go to Firebase Console:** https://console.firebase.google.com
2. **Select your BootBuys project**
3. **Click Firestore Database**
4. **Click on `boots` collection**

**Check:**
- Are there any documents in the `boots` collection?
- Do the boots have `isActive: true`?
- What are the `sellerId` values?

### Step 2: Verify Boot Data

For each boot document, check:

**Required Fields:**
- ✅ `isActive: true` (must be `true` to show in feed)
- ✅ `sellerId` must be a valid Firebase Auth UID (20-30 chars, alphanumeric)
- ✅ `name`, `brand`, `price` should be present

**Example of VALID sellerId:**
```
abc123def456ghi789jkl012mno345pq
```
(28 characters, alphanumeric, no special characters)

**Example of INVALID sellerId (will be filtered out):**
```
preview_user  ❌ (contains underscore)
test123       ❌ (contains "test")
dummy         ❌ (contains "dummy")
user-test     ❌ (contains hyphen)
```

### Step 3: Create a Test Boot

**To test, create a boot with a REAL Firebase Auth user ID:**

1. **Get your Firebase Auth UID:**
   - Sign in to the app
   - Check Xcode console for your user ID
   - Or go to Firebase Console → Authentication → Users
   - Copy a user's UID

2. **Create a boot in Firestore:**
   - Go to Firestore Database → `boots` collection
   - Click "Add document"
   - Use these fields:

```json
{
  "id": "test-boot-123",
  "name": "Nike Air Max",
  "brand": "Nike",
  "size": 9.0,
  "price": 100.0,
  "isActive": true,
  "sellerId": "YOUR_REAL_FIREBASE_UID_HERE",
  "condition": "New",
  "description": "Test boot",
  "createdAt": "2024-01-01T00:00:00Z",
  "imageURLs": [],
  "imageName": "placeholder_image"
}
```

**Important:** Replace `YOUR_REAL_FIREBASE_UID_HERE` with an actual Firebase Auth UID from Authentication → Users

### Step 4: Check Xcode Console

When the app loads, check Xcode console for:

```
🔍 FirebaseService: Querying boots collection...
✅ FirebaseService: Query returned X documents
✅ FirebaseService: Filtered to Y valid boots (removed test data)
```

**If you see:**
- `Query returned 0 documents` → No boots in database or all have `isActive: false`
- `Filtered to 0 valid boots` → Boots exist but have invalid sellerIds

---

## 🐛 Common Issues

### Issue 1: Boots Created with Test Seller IDs

**Problem:** Boots were created with `sellerId: "preview_user"` or similar test IDs

**Solution:** 
- Delete those boots
- Create new boots using real Firebase Auth UIDs
- Or update existing boots' `sellerId` to real UIDs

### Issue 2: All Boots Marked as Sold

**Problem:** All boots have `isActive: false`

**Solution:**
- Update boots to have `isActive: true`
- Or create new active boots

### Issue 3: Missing `isActive` Field

**Problem:** Boots don't have `isActive` field

**Solution:**
- Add `isActive: true` field to all boots
- Or update the query (not recommended)

---

## ✅ Quick Fix Checklist

- [ ] Check Firestore → `boots` collection has documents
- [ ] Verify boots have `isActive: true`
- [ ] Verify `sellerId` is a valid Firebase Auth UID (20-30 chars, alphanumeric)
- [ ] Check Xcode console for query results
- [ ] Create a test boot with real Firebase Auth UID
- [ ] Refresh the app

---

## 📋 How to Get Real Firebase Auth UIDs

1. **From Firebase Console:**
   - Go to Authentication → Users
   - Copy any user's UID

2. **From App:**
   - Sign in to the app
   - Check Xcode console for: `Current user ID: ...`
   - Or add a print statement in code

3. **From Code:**
   ```swift
   if let user = Auth.auth().currentUser {
       print("User ID: \(user.uid)")
   }
   ```

---

**Once you have boots with valid sellerIds and `isActive: true`, they should appear in the feed!** 🚀


