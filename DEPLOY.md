# Deploy TinDog to Vercel

## 1. Firebase Setup (5 min)
1. [Firebase Console](https://console.firebase.google.com) → New project → `tindog-app`
2. **Authentication** → Sign-in method → Enable **Email/Password**
3. **Firestore** → Create database (test mode)
4. **Project Settings** → Your Apps → Add Web App → copy `firebaseConfig`
5. **Project Settings** → Service Accounts → **Generate new private key** → download JSON

## 2. Neon Postgres Setup (2 min)
1. [neon.tech](https://neon.tech) → New project → `tindog`
2. Copy the **pooled connection string** (looks like `postgres://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`)
3. The `users` table is created automatically on first request.

## 3. Deploy to Vercel (3 min)
```bash
# From the tindog-web directory:
npx vercel

# Follow the prompts, then add env vars:
npx vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
npx vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
npx vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
npx vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
npx vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
npx vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
npx vercel env add FIREBASE_ADMIN_PROJECT_ID
npx vercel env add FIREBASE_ADMIN_CLIENT_EMAIL
npx vercel env add FIREBASE_ADMIN_PRIVATE_KEY   # wrap in quotes!
npx vercel env add DATABASE_URL
```

## 4. Add Vercel Blob (for dog photos)
1. Vercel Dashboard → your project → **Storage** → **Create Blob store** → `tindog-images`
2. Connect to your project → `BLOB_READ_WRITE_TOKEN` is set automatically.

## 5. Firestore indexes (once)
In [Firebase Console](https://console.firebase.google.com) → Firestore → Indexes:
- Collection: `matches` | Fields: `users` (Arrays) + `createdAt` (Desc)

## 6. Local dev
```bash
cd tindog-web
cp .env.example .env.local
# fill in .env.local
npm run dev
```

---

## Architecture

```
Browser
  ├── Firebase Auth (login / session cookie)
  ├── Next.js API routes → Neon Postgres (dog profiles)
  ├── Next.js API routes → Vercel Blob (image uploads)
  └── Firebase Firestore (swipes, matches, chat — real-time)
```
