# 🔧 Razorpay Integration Setup Guide

## ❌ Problem: "Invalid Token" Error

This error occurs when the Razorpay public key is not properly configured in the frontend.

---

## ✅ Solution: Complete Setup Steps

### Step 1: Get Your Razorpay Keys
1. Go to **https://dashboard.razorpay.com**
2. Log in to your account
3. Click **Settings** → **API Keys**
4. You'll see two keys:
   - **Key ID** (Public Key) - Use in Frontend
   - **Key Secret** (Private Key) - Use in Backend

### Step 2: Configure Frontend (.env.local)

Open `frontend/.env.local` and add:

```env
VITE_URL=http://localhost:8000
VITE_RAZORPAY_KEY_ID=your_key_id_from_razorpay
```

Example:
```env
VITE_URL=http://localhost:8000
VITE_RAZORPAY_KEY_ID=rzp_live_1234567890abcdef
```

### Step 3: Configure Backend (.env)

Open `backend/.env` and add:

```env
RAZORPAY_KEY_ID=your_key_id_from_razorpay
RAZORPAY_SECRET=your_secret_from_razorpay
```

Example:
```env
RAZORPAY_KEY_ID=rzp_live_1234567890abcdef
RAZORPAY_SECRET=asdfghjklzxcvbnm1234567890
```

### Step 4: Restart Your Servers

**Frontend:**
```bash
cd frontend
npm run dev
```

**Backend:**
```bash
cd backend
npm start
```

### Step 5: Test the Payment Flow

1. Add products to cart
2. Go to checkout
3. Select address → Click "Proceed to Checkout"
4. Complete the Razorpay payment

---

## 🐛 Debugging Tips

If payment still fails:

1. **Check Console Errors:**
   - Open browser DevTools (F12)
   - Look for error messages in the Console tab

2. **Verify Environment Variables:**
   - Frontend: Check if `VITE_RAZORPAY_KEY_ID` is loaded
   - Backend: Check if `RAZORPAY_KEY_ID` and `RAZORPAY_SECRET` are set

3. **Common Issues:**
   - ❌ Empty env values
   - ❌ Wrong key type (using Secret instead of Key ID)
   - ❌ Copy-paste errors (extra spaces)
   - ❌ Server not restarted after env changes

4. **Test Razorpay Keys:**
   - Razorpay provides **TEST KEYS** and **LIVE KEYS**
   - Start with TEST KEYS for development

---

## 💳 Test Payment Details (For Test Mode)

- **Card Number:** 4111111111111111
- **Expiry:** Any future date (e.g., 12/25)
- **CVV:** Any 3 digits (e.g., 123)
- **OTP:** 123456 (if prompted)

---

## ✨ After Setup

Once configured correctly:
- No "Invalid Token" error
- Payment popup opens successfully
- Payment verification works
- Order is created in database

For more info: **https://razorpay.com/docs/payments/server-integration/nodejs/build-integration/payment-gateway/**
