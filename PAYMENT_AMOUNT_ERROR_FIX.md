# 🔧 Payment Amount Error Fix

## Error: "Invalid amount" (400)

### Problem
Backend is rejecting payment requests with "Invalid amount" error, even when amount is valid (e.g., €10.00).

### Root Cause
Backend validation wasn't properly handling amount parsing. The amount might be:
- A number: `10.0`
- A string: `"10.0"`
- Undefined or null

### Fix Applied

**Backend (`server.js`):**
- Improved amount parsing to handle both strings and numbers
- Added better error messages showing what was received
- Added logging to debug amount parsing issues

**iOS App (`StripeBackendAPI.swift`):**
- Added validation before sending request
- Ensures amount is > €0.50 before sending

---

## Next Steps

### 1. Redeploy Backend
The backend code has been updated but needs to be redeployed to Render:

1. **Commit and push** the updated `server.js` to GitHub
2. **Render will auto-deploy** (or manually trigger deploy)
3. **Wait 2-3 minutes** for deployment

### 2. Test Payment
After redeployment:
1. Try making a payment again
2. Should work with amounts >= €0.50

---

## Testing

Test with different amounts:
- ✅ €10.00 (should work)
- ✅ €5.00 (should work)
- ✅ €0.50 (should work - minimum)
- ❌ €0.49 (should fail - below minimum)

---

## If Error Persists

Check Render logs:
1. Go to Render dashboard → Your service → Logs
2. Look for "Invalid amount received" messages
3. Check what type and value is being received

The improved error messages will show:
- What value was received
- What type it was (string/number)
- What it was parsed as




























