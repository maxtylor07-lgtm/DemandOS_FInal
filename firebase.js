// ═══════════════════════════════════════════════════════════
// firebase.js — Firebase Init using Compat SDK
// Loaded AFTER the CDN compat scripts in HTML
// Sets global: window.fbAuth, window.fbDb, window.fbStorage
// ═══════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey:            "AIzaSyCIDxbCazw81IOJGpVYWx8eBVZGqyLcees",
  authDomain:        "stockpulse-e447d.firebaseapp.com",
  databaseURL:       "https://stockpulse-e447d-default-rtdb.firebaseio.com",
  projectId:         "stockpulse-e447d",
  storageBucket:     "stockpulse-e447d.firebasestorage.app",
  messagingSenderId: "1095441503999",
  appId:             "1:1095441503999:web:d893b96ada623110605eca",
  measurementId:     "G-Y32881FHHK"
};

// Initialize Firebase app (only once)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Expose services globally so auth.js / products.js / storage.js can use them
window.fbApp     = firebase.app();
window.fbAuth    = firebase.auth();
window.fbDb      = firebase.firestore();
window.fbStorage = firebase.storage();

console.log("✅ Firebase initialized:", window.fbApp.name);
