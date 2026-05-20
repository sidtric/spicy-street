# Spicy Street — Table QR Ordering System

## Setup

### 1. Server
```bash
cd server
# Fill in .env with your MongoDB URI and Razorpay keys
npm run seed       # seed the menu into MongoDB
npm run dev        # start server on :5000
```

### 2. Client
```bash
cd client
# Fill in .env with your Razorpay Key ID
npm run dev        # start on :5173
```

### 3. Generate QR Codes
```bash
cd qr
# For production, set BASE_URL to your deployed URL
BASE_URL=https://yourdomain.com node generate.js 20   # generates 20 table QRs
```
QR images are saved in `qr/qr-codes/`. Print and laminate them for each table.

## Customer Flow
1. Customer scans QR at table → opens `/?table=3`
2. Browses menu by category
3. Adds items to cart
4. Taps "Pay via Razorpay" → UPI/card modal opens
5. On success → order saved in DB, success screen shown

## Razorpay Keys
- Get keys from [Razorpay Dashboard](https://dashboard.razorpay.com)
- Use **Test Mode** keys during development
- `RAZORPAY_KEY_ID` goes in both `server/.env` and `client/.env`
- `RAZORPAY_KEY_SECRET` goes in `server/.env` only (never in client)
