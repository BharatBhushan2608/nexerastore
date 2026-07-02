# ⚡ Quick Fix Checklist - Razorpay Invalid Token Error

## ✅ Checklist to Fix Payment Error

### 🔑 Step 1: Get Razorpay Keys (5 minutes)
- [ ] Go to **https://dashboard.razorpay.com**
- [ ] Login to your account
- [ ] Click **Settings** → **API Keys**
- [ ] Copy **Key ID** (e.g., rzp_live_1234567890abcdef)
- [ ] Copy **Secret** (e.g., asdfghjklzxcvbnm)
- [ ] Note: For testing, use TEST KEYS first

### 🖊️ Step 2: Configure Frontend Environment
- [ ] Open `frontend/.env.local`
- [ ] Add your Key ID:
  ```env
  VITE_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_HERE
  ```
- [ ] Save file

### 🖊️ Step 3: Configure Backend Environment
- [ ] Open `backend/.env`
- [ ] Add your credentials:
  ```env
  RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_HERE
  RAZORPAY_SECRET=YOUR_SECRET_HERE
  ```
- [ ] Save file

### 🚀 Step 4: Restart Servers

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm start
```

- [ ] Frontend shows: `➜  Local: http://localhost:5173`
- [ ] Backend shows: `Server running on port 8000`

### 💳 Step 5: Test Payment Flow
- [ ] Open **http://localhost:5173**
- [ ] Add product to cart
- [ ] Go to **Cart**
- [ ] Click **PLACE ORDER**
- [ ] Fill address details
- [ ] Click **Proceed To Checkout**
- [ ] Razorpay popup should open ✅

### 🧪 Step 6: Complete Test Payment
- [ ] Enter test card: `4111111111111111`
- [ ] Expiry: Any future date (e.g., `12/25`)
- [ ] CVV: Any 3 digits (e.g., `123`)
- [ ] Click **Pay Now**
- [ ] Enter OTP: `123456` (if prompted)
- [ ] Success page should appear ✅

---

## 🐛 Troubleshooting

### ❌ Still Getting "Invalid Token" Error?

1. **Check Frontend Console (F12):**
   - Should show: `✅ Using Razorpay Key: rzp_live_...`
   - If missing, Razorpay key is not loaded

2. **Verify .env.local has the key:**
   ```bash
   cat frontend/.env.local
   ```
   - Should show your Key ID (not empty!)

3. **Backend not restarted?**
   - Stop backend (Ctrl+C)
   - Start again: `npm start`

4. **Using wrong key type?**
   - ❌ Don't use Secret in frontend
   - ✅ Use Key ID in frontend
   - ✅ Use both Key ID and Secret in backend

5. **Spaces in the key?**
   - Check for extra spaces before/after the key
   - Copy exactly from Razorpay dashboard

---

## 📞 Still Not Working?

1. Read **RAZORPAY_SETUP.md** for detailed guide
2. Read **RAZORPAY_FIX_REPORT.md** for technical details
3. Check browser console for specific error messages
4. Check backend terminal logs

---

## ✨ Success Indicators

When fixed, you should see:

**Frontend Console:**
```
✅ Using Razorpay Key: rzp_live_...
Razorpay data: {success: true, order: {...}}
```

**Backend Terminal:**
```
📦 Creating Razorpay order...
✅ Razorpay order created: order_xxxxx
```

**Payment Flow:**
- ✅ No "Invalid Token" error
- ✅ Razorpay popup opens
- ✅ Payment can be completed
- ✅ Order saved in database
