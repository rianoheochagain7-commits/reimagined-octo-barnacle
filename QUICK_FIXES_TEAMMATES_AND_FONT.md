# 🔧 Quick Fixes: Remove Teammates & Sharpen BB Font

## Fix 1: Remove Teammates Section from Profile

### Step 1: Open ProfileView.swift

1. **In Xcode**, open `BootBuys/BootBuys/Views/ProfileView.swift`
2. **Press `Cmd + F`** to search within the file
3. **Search for:** `Teammates` or `teammates`

### Step 2: Find and Remove the Teammates UI

**Look for code that looks like this:**

```swift
// Find something like this:
HStack {
    // Profile picture
    // ...
    
    // Teammates section - REMOVE THIS ENTIRE BLOCK
    VStack {
        HStack {
            Image(systemName: "person.2.fill")
            // or similar icon
            Text("0")
        }
        Text("Teammates")
    }
    // ... rest of profile header
}
```

**Or it might be a separate section:**

```swift
// Look for a section like this:
VStack(alignment: .leading) {
    Text("Teammates")
        .font(.headline)
    // ... teammate list or count
}
```

### Step 3: Remove the Code

1. **Select the entire teammates section** (from the VStack/HStack to its closing brace)
2. **Delete it** (`Delete` key)
3. **Make sure the layout still works** - you may need to adjust spacing

### Step 4: Check for Related Code

**Also search for:**
- `@State var teammates` or similar state variables
- Functions like `loadTeammates()` or `fetchTeammates()`
- Any Firebase queries for teammates
- Navigation links to teammate views

**Remove all of these as well.**

---

## Fix 2: Make BB Font Sharper (Less Rounded)

### Step 1: Find Where BB Text is Displayed

**The BB text is likely in one of these files:**
- `WelcomeView.swift`
- `OnboardingView.swift`
- `SplashView.swift` or launch screen
- Any view that shows the "BB" logo

### Step 2: Search for BB Text

**In Xcode:**
1. **Press `Cmd + Shift + F`** (Find in Project)
2. **Search for:** `Text("BB")` or `"BB"`
3. **Look for the file** that displays the large BB text

### Step 3: Change Font to Sharper Style

**Find code like this:**

```swift
Text("BB")
    .font(.system(size: 80, weight: .bold, design: .rounded))  // ← ROUNDED DESIGN
    // or
    .font(.custom("SomeRoundedFont", size: 80))  // ← ROUNDED FONT
```

**Change it to:**

```swift
Text("BB")
    .font(.system(size: 80, weight: .bold, design: .default))  // ← DEFAULT (SHARP)
    // or for even sharper:
    .font(.system(size: 80, weight: .black, design: .default))
```

### Step 4: Alternative - Use a Sharp Custom Font

**If you want maximum sharpness, use:**

```swift
Text("BB")
    .font(.system(size: 80, weight: .black, design: .default))
    // This gives you the sharpest, most angular look
```

**Or use a specific sharp font:**

```swift
Text("BB")
    .font(.custom("HelveticaNeue-Black", size: 80))
    // or
    .font(.custom("Arial-Black", size: 80))
```

### Step 5: Remove Any Corner Radius

**If the BB text has rounded corners applied:**

```swift
Text("BB")
    .font(...)
    .cornerRadius(10)  // ← REMOVE THIS
    // or
    .clipShape(RoundedRectangle(...))  // ← REMOVE THIS
```

**Remove any corner radius or rounded shape modifiers.**

---

## Quick Reference: Font Designs

**iOS System Font Designs:**
- `.default` - **Sharp, angular** (use this!)
- `.rounded` - Rounded, soft (current - remove this)
- `.serif` - Serif style
- `.monospaced` - Monospace

**Font Weights (from lightest to boldest):**
- `.ultraLight`
- `.thin`
- `.light`
- `.regular`
- `.medium`
- `.semibold`
- `.bold` ← Good for sharp look
- `.heavy`
- `.black` ← Sharpest, most angular

---

## Step-by-Step Checklist

### Remove Teammates:
- [ ] Open `ProfileView.swift`
- [ ] Search for "Teammates" or "teammate"
- [ ] Find the UI section showing "0 Teammates"
- [ ] Delete the entire teammates VStack/HStack
- [ ] Remove any @State variables for teammates
- [ ] Remove any functions that fetch teammates
- [ ] Build and test - teammates should be gone

### Sharpen BB Font:
- [ ] Find the file with `Text("BB")`
- [ ] Look for `.design: .rounded` or rounded font
- [ ] Change to `.design: .default`
- [ ] Optionally change weight to `.black` for sharper look
- [ ] Remove any `.cornerRadius()` modifiers
- [ ] Build and test - BB should look sharp and angular

---

## Common Locations

### ProfileView.swift - Teammates Section
**Look for code around:**
- Profile header area
- Below profile picture
- Next to user stats
- Usually in an HStack with profile picture

### BB Text Location
**Check these files:**
- `WelcomeView.swift` - Welcome screen
- `OnboardingView.swift` - Onboarding screens
- `SplashView.swift` - Launch/splash screen
- `BootBuysApp.swift` - App entry point

---

## After Making Changes

1. **Build the project:** `Cmd + B`
2. **Check for errors** - fix any broken references
3. **Run the app:** `Cmd + R`
4. **Verify:**
   - ✅ Teammates section is gone from profile
   - ✅ BB text looks sharp and angular (not rounded)
5. **Clean build if needed:** `Shift + Cmd + K`

---

## Need Help Finding the Code?

**If you can't find the teammates section:**
1. In Xcode, press `Cmd + Shift + F`
2. Search: `Teammates` (case-insensitive)
3. Look through all results
4. The profile view result will show you the exact location

**If you can't find the BB text:**
1. In Xcode, press `Cmd + Shift + F`
2. Search: `Text("BB")` or just `"BB"`
3. Look for large font sizes (60-100)
4. Check welcome/onboarding/splash screens

---

**Once both fixes are done, your app will be clean and ready for final build! 🚀**
