# ✅ Create Test Boot with Valid Seller ID

## Your Firebase Auth UID
```
zskbjErlyIThAdaYDfLTaD43i6F3
```

**Status:** ✅ VALID
- Length: 28 characters ✅
- Alphanumeric only ✅
- No underscores ✅
- No hyphens ✅
- No test words ✅

This UID will **NOT be filtered out** by the app!

---

## How to Create a Test Boot in Firestore

### Step 1: Go to Firebase Console

1. **Go to:** https://console.firebase.google.com
2. **Select your BootBuys project**
3. **Click Firestore Database**
4. **Click on `boots` collection**
5. **Click "Add document"**

### Step 2: Create Document

**Document ID:** (Click "Auto-ID" or use: `test-boot-1`)

**Fields:** Add these fields (click "Add field" for each):

| Field Name | Type | Value |
|------------|------|-------|
| `id` | string | `test-boot-1` |
| `name` | string | `Nike Air Max 90` |
| `brand` | string | `Nike` |
| `size` | number | `9.0` |
| `price` | number | `120.0` |
| `isActive` | boolean | `true` ⚠️ **MUST BE TRUE** |
| `sellerId` | string | `zskbjErlyIThAdaYDfLTaD43i6F3` ⚠️ **YOUR UID** |
| `condition` | string | `New` |
| `description` | string | `Test boot for feed` |
| `createdAt` | timestamp | Click "Set" → Use current time |
| `imageURLs` | array | Leave empty `[]` or add image URLs |
| `imageName` | string | `placeholder_image` |
| `sportType` | string | `Football` |
| `surfaceType` | string | `Firm Ground` |
| `color` | string | `Black` |
| `year` | number | `2024` |
| `sizeFormat` | string | `UK 9` |

### Step 3: Save

Click **"Save"**

---

## Quick Copy-Paste JSON (Alternative Method)

If you prefer, you can use this JSON structure:

```json
{
  "id": "test-boot-1",
  "name": "Nike Air Max 90",
  "brand": "Nike",
  "size": 9.0,
  "price": 120.0,
  "isActive": true,
  "sellerId": "zskbjErlyIThAdaYDfLTaD43i6F3",
  "condition": "New",
  "description": "Test boot for feed",
  "createdAt": "2024-01-15T12:00:00Z",
  "imageURLs": [],
  "imageName": "placeholder_image",
  "sportType": "Football",
  "surfaceType": "Firm Ground",
  "color": "Black",
  "year": 2024,
  "sizeFormat": "UK 9"
}
```

---

## ✅ After Creating

1. **Refresh your app** (pull down on home screen)
2. **Check Xcode console** - you should see:
   ```
   ✅ FirebaseService: Query returned 1 documents
   ✅ FirebaseService: Boot 'Nike Air Max 90' PASSED filter
   ✅ FirebaseService: Filtered to 1 valid boots
   ```
3. **Boot should appear** in home feed!

---

## 🐛 Still Not Showing?

**Check:**
- ✅ `isActive` is `true` (not `false`)
- ✅ `sellerId` matches exactly: `zskbjErlyIThAdaYDfLTaD43i6F3`
- ✅ Boot was saved successfully in Firestore
- ✅ You're signed in to the app
- ✅ Check Xcode console for any errors

---

## 📋 Multiple Test Boots

Create more boots with the same `sellerId`:
- `test-boot-2`, `test-boot-3`, etc.
- All with `isActive: true`
- All with `sellerId: zskbjErlyIThAdaYDfLTaD43i6F3`

They should all appear in the feed!

---

**Once you create a boot with this valid sellerId and `isActive: true`, it should appear in your feed!** 🚀


