# Apple App Store Review Response

## Issue 1: Guideline 2.3.6 - Performance - Accurate Metadata (Age Rating)

### Response

Thank you for your feedback. Our app **does include** In-App Controls (Parental Controls) and Age Assurance mechanisms. Here's how to locate them:

#### Parental Controls Location:
1. **Sign in** to the app (or create an account if needed)
2. Navigate to **Settings** (accessible from the Profile tab)
3. Scroll to the **"Privacy & Security"** section
4. Tap on **"Parental Controls"** (with icon: person.2.shield.checkered.fill)
5. You can enable/disable parental controls, set passwords, spending limits, and messaging restrictions

#### Age Assurance Mechanism:
- During account creation (Sign Up), users are required to provide their **Date of Birth**
- The app validates that users are at least **13 years old** before allowing account creation
- This age verification is enforced during the signup process (Step 2 of 4 in the signup flow)

#### Additional Information:
- **Parental Guide**: Also accessible from Settings > Support section > "Parental Guide" - provides comprehensive information for parents about the app's safety features
- **Age Verification**: The signup process collects and validates date of birth, ensuring users meet the minimum age requirement

If you're unable to locate these features, please let us know and we can provide additional guidance or screenshots.

---

## Issue 2: Guideline 2.1 - Performance - App Completeness (Login Bug on iPad)

### Response

We have identified and fixed the login error on iPad devices. The following improvements have been made:

#### Fixes Applied:
1. **Improved iPad Layout Support**:
   - Enhanced keyboard handling with proper focus management
   - Added keyboard dismissal toolbar button
   - Improved text field focus states

2. **Enhanced Error Handling**:
   - Better email validation and trimming
   - Improved error message display
   - More robust keyboard interaction handling

3. **iPad-Specific Improvements**:
   - Proper keyboard toolbar with "Done" button
   - Better text field focus management using `@FocusState`
   - Improved form submission handling
   - Enhanced tap-to-dismiss keyboard functionality

#### Testing Recommendations:
- Test on iPad Air (5th generation) with iPadOS 26.0.1
- Verify login works correctly with both email/password
- Test keyboard interactions (showing/hiding)
- Verify error messages display properly
- Test in both portrait and landscape orientations

The login functionality should now work correctly on all iPad devices.

---

## Next Steps

1. **Age Rating Metadata**: If you prefer, we can update the Age Rating in App Store Connect to remove "In-App Controls" if you'd like to change the rating. However, the features are present and functional in the app.

2. **Testing**: Please test the updated build on iPad Air (5th generation) with iPadOS 26.0.1 to verify the login fix.

Thank you for your review and feedback.



