# 🔐 Authentication Guide

This app uses **Clerk** for authentication with support for GitHub, Discord, Google, and Email.

---

## 🚀 Quick Start

### 1. Run the App
```bash
npm run dev
```

### 2. Visit
Open `http://localhost:3000` - you'll be redirected to sign-in

### 3. Sign In
Choose any provider:
- 🐙 GitHub
- 💬 Discord
- 🔍 Google
- 📧 Email

---

## 🔧 Configuration

### Environment Variables
Required in `.env.local`:

```bash
# Clerk API Keys (from https://dashboard.clerk.com/)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Optional: Customize URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Clerk Dashboard Setup
1. Go to https://dashboard.clerk.com/
2. Enable OAuth providers:
   - GitHub: https://github.com/settings/developers
   - Discord: https://discord.com/developers/applications
   - Google: https://console.cloud.google.com/
3. Configure callback URLs (provided by Clerk)
4. Copy Client ID and Secret to Clerk

---

## 🏗️ How It Works

### Protected Routes
- **All routes require authentication** except `/sign-in` and `/sign-up`
- Middleware (`middleware.ts`) enforces protection
- Unauthenticated users redirected to sign-in

### User Access
```typescript
// In any component
import { useUser } from "@clerk/nextjs";

export default function MyComponent() {
  const { user } = useUser();

  return <div>Hello {user?.firstName}!</div>;
}
```

```typescript
// In API routes
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // User is authenticated
}
```

---

## 🎨 UI Components

### Sign-In Button
Shows when user is signed out:
```typescript
<SignedOut>
  <SignInButton mode="modal">
    <button>Sign In</button>
  </SignInButton>
</SignedOut>
```

### User Button
Shows when user is signed in:
```typescript
<SignedIn>
  <UserButton />
</SignedIn>
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `middleware.ts` | Route protection |
| `app/layout.tsx` | ClerkProvider wrapper, header with auth UI |
| `app/sign-in/[[...sign-in]]/page.tsx` | Sign-in page |
| `app/sign-up/[[...sign-up]]/page.tsx` | Sign-up page |

---

## 🔗 Resources

- **Clerk Dashboard:** https://dashboard.clerk.com/
- **Documentation:** https://clerk.com/docs/nextjs
- **Components:** https://clerk.com/docs/components/overview

---

## ⚙️ Common Tasks

### Add a User Field
```typescript
const { user } = useUser();
const email = user?.emailAddresses[0]?.emailAddress;
const name = user?.fullName;
```

### Check if User is Admin
```typescript
const { userId, sessionClaims } = await auth();
const role = sessionClaims?.metadata?.role;

if (role === 'admin') {
  // Admin-only logic
}
```

### Sign Out Programmatically
```typescript
import { useClerk } from "@clerk/nextjs";

const { signOut } = useClerk();
await signOut();
```

---

## 🐛 Troubleshooting

**"Unauthenticated" error:**
- Check `.env.local` has correct Clerk keys
- Restart dev server after adding keys

**OAuth provider not showing:**
- Enable provider in Clerk Dashboard
- Configure OAuth app (GitHub/Discord/Google)
- Add callback URL from Clerk

**Build fails:**
- Run `npm run build` to see errors
- Verify all imports are from `@clerk/nextjs` or `@clerk/nextjs/server`

---

**For detailed implementation info, see:** `plans/CLERK-AUTH-IMPLEMENTATION.md`
