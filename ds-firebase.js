// ═══════════════════════════════════════════════════════
//  DEEPU SIVA PVT LTD — Shared Firebase Module v2
//  The single source of truth for ALL pages.
//  Import this. Never copy-paste the config elsewhere.
// ═══════════════════════════════════════════════════════

import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, browserLocalPersistence, setPersistence }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

// ── THE ONE CORRECT CONFIG ──────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyCm0UfXGcDiXk8dmGZ8coKOnnVmaJl6mB0",
  authDomain:        "deepu-siva-portal.firebaseapp.com",
  projectId:         "deepu-siva-portal",
  storageBucket:     "deepu-siva-portal.firebasestorage.app",
  messagingSenderId: "1014351018202",
  appId:             "1:1014351018202:web:16d2578f726159e5ef8de3"
};

// ── ADMIN EMAILS (checked server-side via Firestore role too) ──
const ADMIN_EMAILS = [
  "deepadharsan.rajavel@gmail.com",
  "deepusiva.pvt@gmail.com",
  "contact@deepusiva.com",
  "deepusiva2017@gmail.com",
  "deepusiva947@gmail.com"
];

const app     = initializeApp(firebaseConfig);
const auth    = getAuth(app);
const db      = getFirestore(app);
const storage = getStorage(app);

// Set persistence globally — this is why pages stop kicking users out
setPersistence(auth, browserLocalPersistence).catch(console.error);

export { app, auth, db, storage };

// ── HIDE OVERLAY HELPER ─────────────────────────────────
function hideOverlay() {
  const overlay = document.getElementById('auth-overlay');
  if (overlay) overlay.style.display = 'none';
}

// ── requireAuth ─────────────────────────────────────────
// Use on every PROJECT CLIENT protected page.
// onAllowed(user) fires once Firebase confirms the session.
// No timers. No race conditions. No more logout bug.
// ───────────────────────────────────────────────────────
export function requireAuth(onAllowed, onDenied) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      hideOverlay();
      onAllowed(user);
    } else {
      if (onDenied) {
        onDenied();
      } else {
        window.location.href = 'login.html';
      }
    }
  });
}

// ── requireAdmin ────────────────────────────────────────
// Use on every ADMIN page (director portal, admin-shop).
// Checks BOTH the hardcoded email list AND the Firestore
// role field — so you can grant admin via database too.
// Redirects non-admins to index.html immediately.
// ───────────────────────────────────────────────────────
export function requireAdmin(onAllowed) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    try {
      const userEmail = (user.email || '').toLowerCase();
      const isMasterEmail = ADMIN_EMAILS.map(e => e.toLowerCase()).includes(userEmail);

      // Also check Firestore role for future-proofing
      const snap    = await getDoc(doc(db, 'users', user.uid));
      const isAdmin = snap.exists() && snap.data().role === 'admin';

      if (isMasterEmail || isAdmin) {
        hideOverlay();
        onAllowed(user);
      } else {
        alert('Access Denied. Admin accounts only.');
        window.location.href = 'index.html';
      }
    } catch (e) {
      // If Firestore fails, still allow master emails through
      const userEmail = (user.email || '').toLowerCase();
      if (ADMIN_EMAILS.map(e => e.toLowerCase()).includes(userEmail)) {
        hideOverlay();
        onAllowed(user);
      } else {
        window.location.href = 'index.html';
      }
    }
  });
}
