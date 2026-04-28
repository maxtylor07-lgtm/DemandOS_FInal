// ═══════════════════════════════════════════════════════════
// auth.js — Firebase Authentication (Compat SDK, no modules)
// Requires: firebase.js loaded before this script
// ═══════════════════════════════════════════════════════════

// ─── Helper: show inline error box ───
function showAuthError(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 6000);
}
function clearAuthError(elementId) {
  const el = document.getElementById(elementId);
  if (el) { el.textContent = ""; el.style.display = "none"; }
}

// ─── Helper: button loading spinner ───
function setButtonLoading(btnId, spinId, textId, loading, label) {
  const btn  = document.getElementById(btnId);
  const spin = document.getElementById(spinId);
  const text = document.getElementById(textId);
  if (btn)  btn.disabled = loading;
  if (spin) spin.style.display = loading ? "block" : "none";
  if (text && label) text.textContent = loading ? "Please wait…" : label;
}

// ─── Translate Firebase error codes ───
function firebaseErrMsg(code) {
  const map = {
    "auth/email-already-in-use":   "⚠️ This email is already registered. Try logging in.",
    "auth/invalid-email":          "⚠️ Invalid email address.",
    "auth/weak-password":          "⚠️ Password too weak — use at least 6 characters.",
    "auth/operation-not-allowed":  "⚠️ Email/Password sign-in is NOT enabled. Go to Firebase Console → Authentication → Sign-in method → Enable Email/Password.",
    "auth/network-request-failed": "⚠️ Network error. Check your internet connection.",
    "auth/too-many-requests":      "⚠️ Too many attempts. Please wait a moment.",
    "auth/user-not-found":         "⚠️ No account found with this email.",
    "auth/wrong-password":         "⚠️ Incorrect password.",
    "auth/invalid-credential":     "⚠️ Wrong email or password.",
    "auth/user-disabled":          "⚠️ This account has been disabled."
  };
  return map[code] || `⚠️ Error (${code || "unknown"}). Check console for details.`;
}

// ══════════════════════════════════════════
// SIGNUP
// Called when user clicks "Complete Setup" on Step 3
// ══════════════════════════════════════════
async function signupUser() {
  const name     = (document.getElementById("su-name")?.value   || "").trim();
  const email    = (document.getElementById("su-email")?.value  || "").trim();
  const password =  document.getElementById("su-pass")?.value   || "";

  clearAuthError("signup-error");

  // — Validate —
  if (!name || !email || !password) {
    window.goStep && window.goStep(1);
    setTimeout(() => showAuthError("signup-error", "⚠️ Please fill in your full name, email and password."), 60);
    return;
  }
  if (password.length < 6) {
    window.goStep && window.goStep(1);
    setTimeout(() => showAuthError("signup-error", "⚠️ Password must be at least 6 characters."), 60);
    return;
  }

  // — Show loading step —
  document.querySelectorAll(".signup-step").forEach(s => s.classList.remove("active"));
  const loadStep = document.getElementById("step-load");
  if (loadStep) loadStep.classList.add("active");

  const msgs    = ["Creating your account…", "Saving your profile…", "Setting up your dashboard…"];
  const msgEl   = document.getElementById("load-msg");
  let   mIdx    = 0;
  const mTimer  = setInterval(() => {
    if (msgEl && mIdx < msgs.length) msgEl.textContent = msgs[mIdx++];
  }, 900);

  try {
    // 1. Create Firebase Auth user
    const cred = await window.fbAuth.createUserWithEmailAndPassword(email, password);
    const uid  = cred.user.uid;

    // 2. Set displayName on the Auth user itself (instant, no Firestore needed)
    await cred.user.updateProfile({ displayName: name });

    // 3. Save full profile to Firestore users/{uid}
    await window.fbDb.collection("users").doc(uid).set({
      name:      name,
      email:     email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // 4. Cache locally so dashboard shows name with zero delay
    localStorage.setItem('dos_user', JSON.stringify({ name: name, email: email }));

    clearInterval(mTimer);

    // 3. Show success step then redirect
    document.querySelectorAll(".signup-step").forEach(s => s.classList.remove("active"));
    const done = document.getElementById("step-done");
    if (done) done.classList.add("active");

    setTimeout(() => { window.location.href = "dashboard.html"; }, 2500);

  } catch (err) {
    clearInterval(mTimer);
    console.error("🔥 Signup error:", err.code, err.message);
    const msg = firebaseErrMsg(err.code);
    window.goStep && window.goStep(1);
    setTimeout(() => showAuthError("signup-error", msg), 80);
  }
}

// ══════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════
async function loginUser() {
  const email    = (document.getElementById("login-email")?.value    || "").trim();
  const password =  document.getElementById("login-password")?.value || "";

  clearAuthError("login-error");

  if (!email || !password) {
    showAuthError("login-error", "⚠️ Please enter your email and password.");
    return;
  }

  setButtonLoading("login-submit", "login-spin", "login-btn-text", true, "Sign In →");

  try {
    await window.fbAuth.signInWithEmailAndPassword(email, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error("🔥 Login error:", err.code, err.message);
    showAuthError("login-error", firebaseErrMsg(err.code));
  } finally {
    setButtonLoading("login-submit", "login-spin", "login-btn-text", false, "Sign In →");
  }
}

// ══════════════════════════════════════════
// LOGOUT
// ══════════════════════════════════════════
async function logoutUser() {
  try {
    localStorage.removeItem('dos_user'); // clear cached profile
    await window.fbAuth.signOut();
    window.location.href = "index.html";
  } catch (err) {
    console.error("Logout error:", err);
  }
}

// ══════════════════════════════════════════
// SESSION GUARD — call on dashboard.html
// ══════════════════════════════════════════
function requireAuth(onUserReady) {
  window.fbAuth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    try {
      const snap = await window.fbDb.collection("users").doc(user.uid).get();
      // Fallback chain: Firestore doc → Firebase Auth displayName → email
      const fsName = snap.exists ? snap.data()?.name : null;
      const name   = fsName || user.displayName || user.email || "User";
      const profile = snap.exists
        ? { ...snap.data(), name }
        : { name, email: user.email };
      // Refresh localStorage with latest name
      localStorage.setItem('dos_user', JSON.stringify({ name, email: user.email }));
      if (typeof onUserReady === "function") onUserReady(user, profile);
    } catch (err) {
      console.error("Profile fetch error:", err);
      // Even if Firestore fails, use Firebase Auth displayName
      const fallback = user.displayName || user.email || "User";
      localStorage.setItem('dos_user', JSON.stringify({ name: fallback, email: user.email }));
      if (typeof onUserReady === "function") onUserReady(user, { name: fallback, email: user.email });
    }
  });
}

// ══════════════════════════════════════════
// REDIRECT GUARD — call on index.html
// If already logged in → go straight to dashboard
// ══════════════════════════════════════════
function redirectIfLoggedIn() {
  window.fbAuth.onAuthStateChanged((user) => {
    if (user) window.location.href = "dashboard.html";
  });
}

// ── Wire to window so onclick="" handlers can call them ──
window._firebaseLogin  = loginUser;
window._firebaseSignup = signupUser;
window._firebaseLogout = logoutUser;
