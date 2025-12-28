# 🧹 Final Build Cleanup Guide

## What to Remove Before Final Build

1. **Teammates Feature** - Remove all teammate-related functionality
2. **Old Black & Blue Logo** - Remove old logo assets and references

---

## Step 1: Remove Teammates Feature

### A. Search for Teammate References in Xcode

1. **Open Xcode**
2. **Press `Cmd + Shift + F`** (Find in Project)
3. **Search for:** `teammate` (case-insensitive)
4. **Review all results** and remove:

#### Files to Check/Remove:
- Any `TeammateView.swift` or similar files
- Any `TeammateManager.swift` or similar files
- Any teammate-related models in `Models/` folder
- Any teammate tab bar items
- Any teammate navigation items

#### Code to Remove:
- Tab bar items referencing teammates
- Navigation links to teammate views
- Any `@State` or `@Published` properties for teammates
- Any functions/methods related to teammates
- Any Firebase queries for teammates

### B. Remove from Tab Bar (if exists)

**In `BootBuysApp.swift` or main tab view:**
- Look for tab bar configuration
- Remove any "Teammates" or "Team" tab
- Ensure only: Home, Sell, Messages, Profile tabs remain

### C. Remove from Navigation

**Check these files:**
- `HomeView.swift`
- `ProfileView.swift`
- `SettingsView.swift`
- Any other views with teammate links

**Remove:**
- Navigation links to teammate views
- Buttons that open teammate features
- Menu items for teammates

---

## Step 2: Remove Old Black & Blue Logo

### A. Find Logo Assets

1. **In Xcode Project Navigator:**
   - Look for `Assets.xcassets` or `AppIcon.appiconset`
   - Check for any logo image files

2. **Search for logo references:**
   - Press `Cmd + Shift + F`
   - Search for: `logo` (case-insensitive)
   - Look for image names like:
     - `old_logo.png`
     - `black_blue_logo.png`
     - `logo_old.png`
     - Any files with "black" and "blue" in name

### B. Remove Logo Image Files

**In Xcode:**
1. **Find the logo files** in Project Navigator
2. **Right-click** on each old logo file
3. **Select "Delete"**
4. **Choose "Move to Trash"** (not just remove reference)

### C. Remove Logo References in Code

**Search for and remove:**
- `Image("old_logo")` or similar
- `UIImage(named: "black_blue_logo")` or similar
- Any `@State` variables holding old logo images
- Any logo display code in views

**Common files to check:**
- `WelcomeView.swift`
- `OnboardingView.swift`
- `ProfileView.swift`
- `HomeView.swift`
- Any splash screen or launch screen files

### D. Verify App Icon

**Make sure:**
- ✅ App icon uses the new BB logo (monochrome)
- ✅ No old logo is referenced
- ✅ Only current logo assets remain

---

## Step 3: Clean Up Navigation & UI

### Remove Teammate-Related UI Elements

**Check these views:**
1. **ProfileView.swift:**
   - Remove "My Teammates" section
   - Remove "Add Teammate" button
   - Remove teammate list display

2. **HomeView.swift:**
   - Remove teammate-related cards/sections
   - Remove teammate navigation links

3. **SettingsView.swift:**
   - Remove teammate settings options

### Remove Teammate Models/Data

**In `Models/` folder:**
- Delete `Teammate.swift` (if exists)
- Remove teammate properties from `UserProfile.swift`
- Remove any teammate-related Firebase models

**In `FirebaseService.swift`:**
- Remove teammate fetch functions
- Remove teammate save/update functions
- Remove teammate listeners

---

## Step 4: Verify No Broken References

### A. Build the Project

1. **Press `Cmd + B`** to build
2. **Check for errors:**
   - Any "Cannot find 'TeammateView'" errors
   - Any "Cannot find logo image" errors
   - Any undefined references

### B. Fix Any Errors

- Remove broken imports
- Remove broken navigation links
- Remove broken image references
- Comment out or remove broken code

### C. Clean Build Folder

1. **Product → Clean Build Folder** (`Shift + Cmd + K`)
2. **Delete Derived Data** (optional but recommended):
   - Xcode → Preferences → Locations
   - Click arrow next to Derived Data path
   - Delete `BootBuys-*` folder
3. **Rebuild:** `Cmd + B`

---

## Step 5: Final Verification

### Checklist:

- [ ] No teammate references in code
- [ ] No old logo image files in project
- [ ] No broken navigation links
- [ ] App builds without errors
- [ ] App runs without crashes
- [ ] Tab bar only shows: Home, Sell, Messages, Profile
- [ ] No teammate-related UI elements visible
- [ ] App icon shows new BB logo (not old one)

---

## Step 6: Increment Build Number

**Before archiving:**
1. **Select project** in Project Navigator
2. **Select "BootBuys" target**
3. **Go to "General" tab**
4. **Increment Build number:**
   - If current is `2`, change to `3`
   - Keep Version as `1.0` (unless major changes)

---

## Step 7: Archive for Submission

1. **Select "Any iOS Device"** as target
2. **Product → Archive**
3. **Wait for archive to complete**
4. **Distribute App → App Store Connect**
5. **Upload new build**

---

## Common Locations to Check

### Swift Files:
```
BootBuys/
├── Views/
│   ├── TeammateView.swift (DELETE)
│   ├── TeammateListView.swift (DELETE)
│   └── [Check other views for teammate references]
├── Models/
│   ├── Teammate.swift (DELETE)
│   └── UserProfile.swift (REMOVE teammate properties)
└── Services/
    └── FirebaseService.swift (REMOVE teammate functions)
```

### Assets:
```
BootBuys/
└── Assets.xcassets/
    ├── AppIcon.appiconset/ (VERIFY uses new BB logo)
    └── [Look for old logo images] (DELETE)
```

### Tab Bar Configuration:
- `BootBuysApp.swift` - Check tab bar setup
- `ContentView.swift` - Check if exists
- Main app entry point

---

## Quick Find Commands in Xcode

**Find all teammate references:**
- `Cmd + Shift + F` → Search: `teammate` (case-insensitive)

**Find all logo references:**
- `Cmd + Shift + F` → Search: `logo` (case-insensitive)
- `Cmd + Shift + F` → Search: `black.*blue` (regex)

**Find image references:**
- `Cmd + Shift + F` → Search: `Image(` or `UIImage(named:`

---

## Need Help?

If you find references you're not sure about:
1. Check if it's used in the current UI
2. Try commenting it out and see if app still works
3. Build and check for errors
4. If no errors, it's safe to remove

---

**After cleanup, your app will be ready for final build! 🚀**
