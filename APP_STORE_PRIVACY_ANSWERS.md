# 📋 App Store Connect Privacy Questions - Answers

## Your Answers:

### 1. **Will you be requesting access to your users' geolocations?**
**Answer: YES**

**Why:** 
- Your app has location permission (`NSLocationWhenInUseUsageDescription`) in Info.plist
- Uses `CoreLocation` framework in `CommunityMapManager.swift`
- Has location-based features (community map, showing nearby sellers)

**Note:** Even if you're using sample data currently, since you request the permission, you must answer YES.

---

### 2. **Will you be requesting access to features on your users' mobile devices?**
**Answer: NO**

**Why:**
- ❌ No contacts access
- ❌ No calendar access (only uses Calendar API for date calculations, not user's calendar)
- ❌ No bluetooth access
- ❌ No other device features

**Note:** Camera/Photo Library access for uploading boot photos is handled separately in App Privacy section, not this question.

---

### 3. **Will you be collecting any information regarding your users' mobile devices?**
**Answer: YES**

**Why:**
- ✅ Uses Firebase Analytics (`FirebaseAnalytics`)
- ✅ Has `AnalyticsManager` that tracks events
- ✅ Analytics typically collects: device model, OS version, app version, IP address (anonymized)
- ✅ Settings has "Analytics" toggle, indicating analytics collection

**Note:** Even if analytics is optional for users, if the code collects device info, answer YES.

---

### 4. **Will you be sending push notifications to your users?**
**Answer: YES**

**Why:**
- ✅ Has `NotificationsSettingsView` that requests push notification authorization
- ✅ Uses `UNUserNotificationCenter` to request permission
- ✅ Has push notification settings in app
- ✅ Code requests authorization: `UNUserNotificationCenter.current().requestAuthorization(...)`

**Note:** Even if push notifications aren't fully implemented yet, since you request the permission, answer YES.

---

### 5. **Does your mobile app have an "offer wall"?**
**Answer: NO**

**Why:**
- ❌ No offer wall feature
- ❌ No ad rewards system
- ❌ No third-party offer providers
- ❌ This is a marketplace app, not a rewards/ads app

---

## 📝 Summary

| Question | Answer | Reason |
|----------|--------|--------|
| Geolocations | **YES** | Location permission requested, CoreLocation used |
| Device Features | **NO** | No contacts, calendar, bluetooth access |
| Device Information | **YES** | Firebase Analytics collects device info |
| Push Notifications | **YES** | Push notification permission requested |
| Offer Wall | **NO** | No offer wall feature |

---

## ⚠️ Important Notes

### After Answering YES to Geolocations:
You'll need to provide:
- **Purpose:** "To show nearby boot sellers and help with local transactions"
- **Usage:** "Location is used to display nearby sellers on the community map"

### After Answering YES to Device Information:
You'll need to specify:
- **What:** Device model, OS version, app version, IP address (anonymized)
- **Why:** "To improve app performance and understand usage patterns"
- **Sharing:** "Shared with Firebase Analytics for app analytics"

### After Answering YES to Push Notifications:
You'll need to specify:
- **Types:** Transactional (messages, orders), Marketing (promotions)
- **Purpose:** "To notify users about messages, orders, and app updates"

---

## ✅ Next Steps

1. **Answer the questions** in App Store Connect with the answers above
2. **Fill in the details** for each YES answer (purpose, usage, etc.)
3. **Update Privacy Policy** to mention:
   - Location data collection and usage
   - Device information collection (analytics)
   - Push notifications

---

## 🔍 Verification

**To verify these answers yourself:**

1. **Geolocation:** Check `Info.plist` for `NSLocationWhenInUseUsageDescription`
2. **Device Features:** Search codebase for `CNContact`, `EventKit`, `CoreBluetooth` - none found ✅
3. **Device Information:** Check for `FirebaseAnalytics` import - found ✅
4. **Push Notifications:** Check for `UNUserNotificationCenter` - found ✅
5. **Offer Wall:** No ad frameworks or offer providers found ✅

---

**These answers are based on your actual code. Answer exactly as shown above!**

























