# 🔧 Fix: Boots Appear in Listings But Not Feed

## Problem
Your boots show in "My Listings" (profile) but NOT in the home feed.

## Root Cause
- **Profile listings:** Shows ALL your boots (active or inactive)
- **Home feed:** Only shows boots with `isActive: true`

Your boots likely have `isActive: false` or the field is missing.

---

## ✅ Quick Fix: Update Boots in Firestore

### Option 1: Update via Firebase Console (Easiest)

1. **Go to Firebase Console:** https://console.firebase.google.com
2. **Select your BootBuys project**
3. **Click Firestore Database**
4. **Click on `boots` collection**
5. **For each boot that should appear in feed:**
   - Click on the boot document
   - Find the `isActive` field
   - Change it to `true` (or add it if missing)
   - Click "Update"

### Option 2: Update via App (If you have edit feature)

1. Go to Profile → My Listings
2. Edit each boot
3. Make sure "Active" or "Listed" toggle is ON
4. Save

---

## 📋 What to Check

For each boot in Firestore, verify:

- ✅ `isActive: true` (must be `true` to show in feed)
- ✅ `sellerId` matches your Firebase Auth UID
- ✅ Other required fields are present

---

## 🔍 How to Verify

**Before Fix:**
- Boots appear in Profile → My Listings ✅
- Boots DON'T appear in Home Feed ❌

**After Fix:**
- Boots appear in Profile → My Listings ✅
- Boots appear in Home Feed ✅

---

## ⚡ Quick Steps

1. **Open Firebase Console**
2. **Go to Firestore → `boots` collection**
3. **For each boot:**
   - Click document
   - Set `isActive: true`
   - Save
4. **Refresh app** (pull down on home screen)
5. **Boots should now appear in feed!**

---

## 🐛 Still Not Showing?

**Check Xcode console for:**
```
✅ FirebaseService: Query returned X documents
✅ FirebaseService: Boot 'YOUR_BOOT_NAME' PASSED filter
```

**If you see:**
- `Query returned 0 documents` → Boots don't have `isActive: true`
- `FILTERED OUT` → Boot has invalid `sellerId`

**Common Issues:**
- `isActive` field is `false` → Change to `true`
- `isActive` field is missing → Add `isActive: true`
- Boot was marked as sold → Set `isActive: true` and remove `buyerId`

---

**Once you set `isActive: true` for your boots, they'll appear in the home feed!** 🚀


