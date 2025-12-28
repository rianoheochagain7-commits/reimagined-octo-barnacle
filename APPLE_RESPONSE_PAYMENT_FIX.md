# Response Message for Apple App Store Review

**Copy and paste this into App Store Connect → Your App → Resolution Center → Reply**

---

Thank you for your feedback regarding the Apple Pay loading issue.

We have identified and resolved the problem. The app was attempting to connect to a backend server that was only accessible on our local development network, which caused the payment flow to appear to load indefinitely when tested on devices outside our network.

**What we fixed:**
- Deployed our Stripe payment backend to a publicly accessible HTTPS endpoint
- Updated the app configuration to use the production backend URL
- Tested the payment flow (including Apple Pay) on devices using mobile data (outside our local network) and confirmed it works correctly

**Testing performed:**
- Successfully completed test payments using Apple Pay
- Successfully completed test payments using credit/debit cards
- Verified payment sheet loads and processes payments without hanging
- Confirmed all payment endpoints are accessible from external networks

The new build (version 1.0.1) includes these fixes. Please re-review the payment flow, and you should find that Apple Pay and card payments now complete successfully without any loading issues.

If you encounter any issues during testing, please let us know and we will address them immediately.

Thank you for your patience.





























