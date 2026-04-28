// ═══════════════════════════════════════════════════════════
// products.js — Firestore CRUD + Real-Time Listener (Compat SDK)
// Requires: firebase.js + storage.js loaded before this
// ═══════════════════════════════════════════════════════════

let _unsubscribeProducts = null; // holds the active onSnapshot listener

// ══════════════════════════════════════════
// REAL-TIME LISTENER
// ══════════════════════════════════════════
function listenToProducts(onUpdate) {
  const userId = window.fbAuth?.currentUser?.uid;
  if (!userId) return;

  // Stop old listener
  if (_unsubscribeProducts) _unsubscribeProducts();

  _unsubscribeProducts = window.fbDb
    .collection("products")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .onSnapshot(
      (snapshot) => {
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (typeof onUpdate === "function") onUpdate(products);
      },
      (err) => console.error("Firestore listener error:", err)
    );
}

function stopListening() {
  if (_unsubscribeProducts) {
    _unsubscribeProducts();
    _unsubscribeProducts = null;
  }
}

// ══════════════════════════════════════════
// ADD PRODUCT
// ══════════════════════════════════════════
async function addProductToFirestore(formData, imageFile, onProgress) {
  const userId = window.fbAuth?.currentUser?.uid;
  if (!userId) throw new Error("User not authenticated.");

  // 1. Create the Firestore document
  const ref = await window.fbDb.collection("products").add({
    productName:    formData.productName   || "",
    category:       formData.category      || "",
    price:          parseFloat(formData.price)      || 0,
    costPrice:      parseFloat(formData.costPrice)   || 0,
    stockQuantity:  parseInt(formData.stockQuantity) || 0,
    minThreshold:   parseInt(formData.minThreshold)  || 10,
    unit:           formData.unit          || "pcs",
    smartDemand:    formData.smartDemand   || false,
    supplierName:   formData.supplierName  || "",
    tags:           formData.tags          || [],
    expiryDate:     formData.expiryDate    || "",
    imageURL:       "",
    imagePath:      "",
    restockHistory: [],
    userId:         userId,
    createdAt:      firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt:      firebase.firestore.FieldValue.serverTimestamp()
  });

  // 2. Upload image if provided
  if (imageFile) {
    const { url, path } = await uploadProductImage(imageFile, ref.id, onProgress);
    await ref.update({ imageURL: url, imagePath: path });
  }

  return ref.id;
}

// ══════════════════════════════════════════
// EDIT PRODUCT
// ══════════════════════════════════════════
async function editProductInFirestore(productId, formData, imageFile, oldImagePath, onProgress) {
  const updates = {
    productName:   formData.productName   || "",
    category:      formData.category      || "",
    price:         parseFloat(formData.price)      || 0,
    costPrice:     parseFloat(formData.costPrice)   || 0,
    stockQuantity: parseInt(formData.stockQuantity) || 0,
    minThreshold:  parseInt(formData.minThreshold)  || 10,
    unit:          formData.unit          || "pcs",
    smartDemand:   formData.smartDemand   || false,
    supplierName:  formData.supplierName  || "",
    tags:          formData.tags          || [],
    expiryDate:    formData.expiryDate    || "",
    updatedAt:     firebase.firestore.FieldValue.serverTimestamp()
  };

  if (imageFile) {
    if (oldImagePath) await deleteProductImage(oldImagePath);
    const { url, path } = await uploadProductImage(imageFile, productId, onProgress);
    updates.imageURL  = url;
    updates.imagePath = path;
  }

  await window.fbDb.collection("products").doc(productId).update(updates);
}

// ══════════════════════════════════════════
// DELETE PRODUCT
// ══════════════════════════════════════════
async function deleteProductFromFirestore(productId, imagePath) {
  if (imagePath) await deleteProductImage(imagePath);
  await window.fbDb.collection("products").doc(productId).delete();
}

// ══════════════════════════════════════════
// RESTOCK
// ══════════════════════════════════════════
async function restockProductInFirestore(productId, orderQuantity, deliveryPriority) {
  const ref  = window.fbDb.collection("products").doc(productId);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Product not found.");

  const currentStock = snap.data().stockQuantity || 0;
  const newStock     = currentStock + parseInt(orderQuantity);

  await ref.update({
    stockQuantity:   newStock,
    updatedAt:       firebase.firestore.FieldValue.serverTimestamp(),
    restockHistory:  firebase.firestore.FieldValue.arrayUnion({
      orderQuantity:    parseInt(orderQuantity),
      deliveryPriority: deliveryPriority,
      restockedAt:      new Date().toISOString(),
      newTotal:         newStock
    })
  });

  return newStock;
}

// ══════════════════════════════════════════
// GET SINGLE PRODUCT (one-time read)
// ══════════════════════════════════════════
async function getProductFromFirestore(productId) {
  const snap = await window.fbDb.collection("products").doc(productId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}
