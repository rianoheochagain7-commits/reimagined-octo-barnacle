# How to Create a Working Account in BootBuys

## Step-by-Step Guide

### Step 1: Basic Information (Username, Email, Password)

**Required Fields:**
- **Username**: Any name (e.g., `testuser123`, `john_doe`)
- **Email**: Valid email format (e.g., `test@example.com`, `user123@gmail.com`)
- **Password**: Must meet these requirements:
  - ✅ At least 8 characters long
  - ✅ Contains at least one UPPERCASE letter (A-Z)
  - ✅ Contains at least one number (0-9)
- **Confirm Password**: Must match your password exactly

**Example that works:**
- Username: `testuser123`
- Email: `test123@example.com`
- Password: `Password123`
- Confirm Password: `Password123`

**Common Password Mistakes:**
- ❌ `password123` - Missing uppercase letter
- ❌ `PASSWORD123` - Works, but harder to type
- ❌ `Password` - Missing number
- ✅ `Password123` - Works!
- ✅ `Test1234` - Works!
- ✅ `MyPass123` - Works!

---

### Step 2: Personal Information

**Required Fields:**
- **Full Name**: Your full name (e.g., `John Doe`, `Jane Smith`)
- **Date of Birth**: Must be at least 13 years old

**Example:**
- Full Name: `Test User`
- Date of Birth: Any date that makes you 13+ years old (e.g., January 1, 2000)

---

### Step 3: Location Information

**Required Fields:**
- **Country**: Select any country from the list
- **County**: Only required if you selected "Ireland"
- **Phone Number**: Optional (can be left empty)

**Examples:**

**If selecting Ireland:**
- Country: `Ireland`
- County: Select any county (e.g., `Dublin`, `Galway`, `Cork`)
- Phone Number: Leave empty OR enter any phone number

**If selecting another country:**
- Country: `United States` (or any other country)
- County: Not required
- Phone Number: Leave empty OR enter any phone number

---

### Step 4: Review and Create Account

- Review all your information
- Tap "Create Account" button
- Wait for account creation
- You'll be automatically logged in and taken to the main app

---

## Complete Example Account

Here's a complete example that will work:

**Step 1:**
- Username: `testuser456`
- Email: `testuser456@gmail.com`
- Password: `Password123`
- Confirm Password: `Password123`

**Step 2:**
- Full Name: `Test User`
- Date of Birth: `January 1, 2000` (makes you 24 years old)

**Step 3:**
- Country: `Ireland`
- County: `Dublin`
- Phone Number: (leave empty)

**Step 4:**
- Review and tap "Create Account"

---

## Common Issues & Solutions

### "Password does not meet requirements"
- Make sure password has:
  - At least 8 characters
  - At least one uppercase letter
  - At least one number
- Example: `Password123` ✅

### "Please enter a valid email address"
- Must be in format: `something@domain.com`
- Examples:
  - ✅ `test@example.com`
  - ✅ `user123@gmail.com`
  - ❌ `test@example` (missing .com)
  - ❌ `testexample.com` (missing @)

### "You must be at least 13 years old"
- Select a date of birth that makes you 13+ years old
- Example: January 1, 2010 or earlier

### "Please select your county"
- Only appears if you selected "Ireland" as country
- Just select any county from the list

### "An account with this email already exists"
- This email is already registered
- Try a different email address
- Or sign in instead if you already have an account

---

## Quick Test Account

If you want to quickly test account creation:

**Email**: `test\(UUID().uuidString.prefix(8))@example.com` (use a unique email each time)
**Password**: `Password123`
**Username**: `testuser\(UUID().uuidString.prefix(6))`
**Full Name**: `Test User`
**Date of Birth**: `January 1, 2000`
**Country**: `Ireland`
**County**: `Dublin`
**Phone**: (leave empty)

---

## Tips

1. **Use a unique email**: Each account needs a unique email address
2. **Remember your password**: You'll need it to sign in later
3. **Password requirements are strict**: Make sure your password has uppercase + number
4. **Phone number is optional**: You can skip it if you want
5. **County only needed for Ireland**: If you select another country, county isn't required

---

## After Account Creation

Once your account is created successfully:
- ✅ You'll be automatically logged in
- ✅ You'll see the main app (Home tab)
- ✅ Your account is ready to use
- ✅ You can start browsing boots, selling, messaging, etc.

If you see any errors, check the console logs for detailed error information (for debugging purposes).


