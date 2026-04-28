// ═══════════════════════════════════════════════════════════
// storage.js — Firebase Storage helpers (Compat SDK)
// Requires: firebase.js (sets window.fbStorage)
// ═══════════════════════════════════════════════════════════

/**
 * Upload a product image to Firebase Storage.
 * @param {File}     file       - image File from <input type="file">
 * @param {string}   productId  - used to name the storage path
 * @param {Function} onProgress - optional callback(percent)
 * @returns {Promise<{url, path}>}
 */
function uploadProductImage(file, productId, onProgress) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("Only image files are allowed."));
    }
    if (file.size > 5 * 1024 * 1024) {
      return reject(new Error("Image must be smaller than 5 MB."));
    }

    const userId  = window.fbAuth?.currentUser?.uid || "anon";
    const ext     = file.name.split(".").pop().toLowerCase() || "jpg";
    const path    = `products/${userId}/${productId}/image.${ext}`;
    const ref     = window.fbStorage.ref(path);
    const task    = ref.put(file);

    task.on(
      "state_changed",
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        if (typeof onProgress === "function") onProgress(pct);
      },
      (err) => reject(err),
      async () => {
        const url = await task.snapshot.ref.getDownloadURL();
        resolve({ url, path });
      }
    );
  });
}

/**
 * Delete a product image from Firebase Storage by its path.
 * @param {string} storagePath
 */
async function deleteProductImage(storagePath) {
  if (!storagePath) return;
  try {
    await window.fbStorage.ref(storagePath).delete();
  } catch (err) {
    if (err.code === "storage/object-not-found") return; // already deleted
    throw err;
  }
}
