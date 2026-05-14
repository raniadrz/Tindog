import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";

// Verifies the Firebase ID token stored in the session cookie.
// Returns the decoded token (with uid) or null.
export async function getSession(): Promise<{ uid: string; email: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("__session")?.value;
    if (!token) return null;
    const decoded = await adminAuth.verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email ?? "" };
  } catch {
    return null;
  }
}
