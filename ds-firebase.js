// ═══════════════════════════════════════════════════════
//  DEEPU SIVA PVT LTD — Shared Firebase Module
//  Import this into every page. ONE correct config always.
// ═══════════════════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, browserLocalPersistence, setPersistence }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ✅ THE ONE CORRECT CONFIG — never copy-paste this anywhere else
const firebaseConfig = {
  apiKey:            "AIzaSyCm0UfXGcDiXk8dmGZ8coKOnnVmaJl6mB0",
  authDomain:        "deepu-siva-portal.firebaseapp.com",
  projectId:         "deepu-siva-portal",
  storageBucket:     "deepu-siva-portal.firebasestorage.app",
  messagingSenderId: "1014351018202",
  appId:             "1:1014351018202:web:16d2578f726159e5ef8de3"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// Set persistence once globally
setPersistence(auth, browserLocalPersistence).catch(console.error);

export { app, auth, db };

// ── AUTH GUARD ──────────────────────────────────────────
// Call this on every protected page.
// onAllowed  → runs when user IS logged in (receives user object)
// onDenied   → what to do when NOT logged in (default: go to login.html)
// ──────────────────────────────────────────────────────
export function requireAuth(onAllowed, onDenied) {
  const overlay = document.getElementById('auth-overlay');

  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (overlay) overlay.style.display = 'none';
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
