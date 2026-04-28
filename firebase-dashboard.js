// ═══════════════════════════════════════════════════════════
// firebase-dashboard.js — Dashboard Firebase Bridge (Compat)
// Loaded as regular <script> in dashboard.html AFTER all others
// ═══════════════════════════════════════════════════════════

let _firestoreProducts = [];
let _restockTargetId   = null;

// ══════════════════════════════════════════
// CATEGORY SVG ICONS
// Minimal line icons matching the dashboard's aesthetic
// (24px viewBox, stroke-width 1.5, no fill — same as nav icons)
// ══════════════════════════════════════════
function getCategoryIcon(category) {
  const style = 'width:44px;height:44px;color:var(--accent);opacity:0.85;';
  const attr  = `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="${style}"`;
  const icons = {
    'Electronics': `<svg ${attr}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
    'Fitness':     `<svg ${attr}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    'Footwear':    `<svg ${attr}><path d="M3 18h18"/><path d="M3 18V9l5-5 5 5.5V18"/><path d="M8 4L3 9"/><path d="M13 18c0-2 1.5-3.5 4-3.5s4 1 4 2v1.5"/></svg>`,
    'Accessories': `<svg ${attr}><circle cx="12" cy="12" r="3"/><path d="M6.3 6.3a8 8 0 1 0 11.4 0"/><path d="M12 2v4"/></svg>`,
    'Bags':        `<svg ${attr}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    'Home Office': `<svg ${attr}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    'Lifestyle':   `<svg ${attr}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    'Food':        `<svg ${attr}><path d="M12 2a7 7 0 1 0 0 14A7 7 0 0 0 12 2z"/><path d="M12 6v6l4 2"/></svg>`,
    'Fashion':     `<svg ${attr}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
    'Grocery & Food': `<svg ${attr}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M12 11v4M10 13h4"/></svg>`
  };
  const defaultIcon = `<svg ${attr}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`;
  return icons[category] || defaultIcon;
}

// ══════════════════════════════════════════
// 1. AUTH GUARD + PROFILE
// ══════════════════════════════════════════

// — Instant profile load from localStorage (no delay) —
(function applyStoredProfile() {
  const stored = localStorage.getItem('dos_user');
  if (!stored) return;
  try {
    const p = JSON.parse(stored);
    if (p.name) {
      const nameEl   = document.getElementById('profile-name');
      const avatarEl = document.getElementById('profile-avatar');
      const titleEl  = document.getElementById('page-title');
      if (nameEl)   nameEl.textContent = p.name;
      if (avatarEl) {
        const initials = p.name.split(' ').map(w => (w[0]||'').toUpperCase()).slice(0,2).join('');
        avatarEl.textContent = initials || p.name.charAt(0).toUpperCase();
      }
      if (titleEl) {
        const h = new Date().getHours();
        const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
        titleEl.textContent = `${g}, ${p.name.split(' ')[0]}`;
      }
    }
  } catch(e) {}
})();
requireAuth((user, profile) => {
  const displayName = profile.name || user.email || 'User';
  const firstName   = displayName.split(' ')[0];

  // Save to localStorage for instant load next time
  localStorage.setItem('dos_user', JSON.stringify({ name: displayName, email: user.email }));

  // Greeting
  const greetEl = document.getElementById('page-title');
  if (greetEl) {
    const h = new Date().getHours();
    const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    greetEl.textContent = `${g}, ${firstName}`;
  }

  // Sidebar profile name
  const nameEl = document.getElementById('profile-name');
  if (nameEl) nameEl.textContent = displayName;

  // Sidebar avatar initials
  const avatarEl = document.getElementById("profile-avatar");
  if (avatarEl && avatarEl.tagName !== "IMG") {
    const initials = displayName.split(" ").map(w => (w[0] || "").toUpperCase()).slice(0,2).join("");
    avatarEl.textContent = initials || firstName.charAt(0).toUpperCase();
  }

  // Start real-time product sync
  startProductListener();
});

// Expose logout to onclick
window._firebaseLogout = logoutUser;

// ══════════════════════════════════════════
// 2. REAL-TIME LISTENER → Updates inventory grid
// ══════════════════════════════════════════
function startProductListener() {
  listenToProducts((products) => {
    _firestoreProducts = products;

    // Map to the shape inventory.js expects
    const mapped = products.map(p => firestoreToLocal(p));

    // Replace the in-memory array
    if (typeof inventoryProducts !== "undefined") {
      inventoryProducts.length = 0;
      mapped.forEach(p => inventoryProducts.push(p));
    }

    // Re-render grid if visible
    if (document.getElementById("section-inventory")?.classList.contains("active")) {
      if (typeof renderInventoryGrid === "function") renderInventoryGrid();
    }

    // Update stat counters
    updateLiveStats(products);
  });
}

function firestoreToLocal(p) {
  const stock     = p.stockQuantity || 0;
  const threshold = p.minThreshold  || 10;
  const lvl       = stock <= threshold ? 'critical' : stock <= threshold * 3 ? 'low' : 'healthy';
  // Use a styled SVG icon container as the fallback when no image is uploaded
  const iconHTML  = `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:rgba(79,128,255,0.06);border-radius:12px;">${getCategoryIcon(p.category)}</div>`;
  return {
    id:            p.id,
    firestoreId:   p.id,
    name:          p.productName || '',
    emoji:         iconHTML,          // SVG icon shown when no image
    image:         p.imageURL    || '',
    category:      p.category    || 'Uncategorized',
    stock:         stock,
    stockLevel:    lvl,
    demand:        'medium',
    demandWord:    'Medium',
    trend:         'stable',
    trendArrow:    '→',
    price:         [Math.round(p.costPrice || 0), p.price || 0],
    insight:       `Supplier: ${p.supplierName || 'N/A'}. Unit: ${p.unit || 'pcs'}.`,
    points:        [30,32,30,34,32,34,36,34,36,38,36,38],
    costPrice:     p.costPrice    || 0,
    minThreshold:  threshold,
    unit:          p.unit         || 'pcs',
    smartDemand:   p.smartDemand  || false,
    supplierName:  p.supplierName || '',
    tags:          p.tags         || [],
    expiryDate:    p.expiryDate   || '',
    imagePath:     p.imagePath    || '',
    restockHistory: p.restockHistory || []
  };
}

function updateLiveStats(products) {
  const totalEl = document.querySelector("#stat-total-products .stat-value");
  const lowEl   = document.querySelector("#stat-low-stock .stat-value");
  if (totalEl) totalEl.textContent = products.length;
  if (lowEl) {
    const lowCount = products.filter(p => (p.stockQuantity||0) <= ((p.minThreshold||10)*3)).length;
    lowEl.textContent = lowCount;
  }
}

// ══════════════════════════════════════════
// AI PRODUCT IMAGE GENERATOR (Canvas)
// Generates a themed gradient image when no photo uploaded
// ══════════════════════════════════════════
function generateProductPlaceholder(name, category) {
  const canvas = document.createElement('canvas');
  canvas.width = 400; canvas.height = 400;
  const ctx = canvas.getContext('2d');

  // Category colour palettes
  const palettes = {
    'Electronics':  ['#1a1a2e','#16213e','#0f3460','#4F80FF'],
    'Fitness':      ['#0d1b2a','#1b263b','#415a77','#00C9A7'],
    'Footwear':     ['#1a0533','#2d1b69','#4a1b8c','#7C3AED'],
    'Accessories':  ['#0a1628','#0e2340','#1e3a5f','#4F80FF'],
    'Bags':         ['#1a1200','#2d2100','#4a3500','#FEBC2E'],
    'Home Office':  ['#0a1f1a','#0f3028','#1a5044','#00C9A7'],
    'Lifestyle':    ['#0d1b2a','#162032','#1e3a5f','#00C9A7'],
    'Food':         ['#1a0f00','#2d1a00','#4a2d00','#FEBC2E'],
    'Fashion':      ['#1a0033','#2d0055','#4a008c','#9B59B6'],
    'Uncategorized':['#111621','#1a2236','#242f45','#4F80FF'],
  };
  const pal = palettes[category] || palettes['Uncategorized'];

  // Background gradient
  const bg = ctx.createRadialGradient(200,200,0, 200,200,300);
  bg.addColorStop(0, pal[2]); bg.addColorStop(1, pal[0]);
  ctx.fillStyle = bg;
  ctx.fillRect(0,0,400,400);

  // Subtle grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
  for (let x=0;x<=400;x+=40) { ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,400);ctx.stroke(); }
  for (let y=0;y<=400;y+=40) { ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(400,y);ctx.stroke(); }

  // Glowing circle
  const glow = ctx.createRadialGradient(200,180,0, 200,180,120);
  glow.addColorStop(0, pal[3]+'33'); glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow; ctx.fillRect(0,0,400,400);

  // Category icon (text-based)
  const icons = {
    'Electronics':'⚡','Fitness':'💪','Footwear':'👟','Accessories':'⚙',
    'Bags':'🎒','Home Office':'🏠','Lifestyle':'🌿','Food':'🌾',
    'Fashion':'✨','Uncategorized':'📦'
  };
  ctx.font = '80px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(icons[category] || '📦', 200, 165);

  // Product name (up to 16 chars per line)
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  const words = name.split(' '), lines = [];
  let cur = '';
  words.forEach(w => { const t = cur ? cur+' '+w : w; if (t.length>18){lines.push(cur);cur=w;}else cur=t; });
  if (cur) lines.push(cur);
  lines.slice(0,2).forEach((ln,i) => ctx.fillText(ln, 200, 265 + i*24));

  // Category label
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = pal[3] + 'cc';
  ctx.fillText(category.toUpperCase(), 200, 330);

  // Bottom accent bar
  ctx.fillStyle = pal[3] + '66';
  ctx.fillRect(0, 390, 400, 10);

  return canvas.toDataURL('image/png');
}

// ══════════════════════════════════════════
// 3. ADD PRODUCT — override saveProduct()
// ══════════════════════════════════════════
window.saveProduct = async function(addAnother) {
  const nameInput = document.getElementById("ap-name");
  const name      = nameInput?.value.trim();

  if (!name) {
    nameInput?.classList.add("error");
    nameInput?.focus();
    return;
  }

  const saveBtn = document.getElementById(addAnother ? "ap-save-another" : "ap-save");
  const origText = saveBtn?.textContent || 'Add Product';
  if (saveBtn) {
    saveBtn.disabled    = true;
    saveBtn.textContent = 'Saving…';
    saveBtn.classList.add("saving");
  }

  const category = document.getElementById("ap-category")?.value || "Uncategorized";

  const formData = {
    productName:   name,
    category:      category,
    price:         parseFloat(document.getElementById("ap-price")?.value)     || 0,
    costPrice:     parseFloat(document.getElementById("ap-cost")?.value)      || 0,
    stockQuantity: parseInt(document.getElementById("ap-stock")?.value)       || 0,
    minThreshold:  parseInt(document.getElementById("ap-threshold")?.value)   || 10,
    unit:          document.getElementById("ap-unit")?.value                  || "pcs",
    smartDemand:   document.getElementById("ap-demand-toggle")?.classList.contains("on") || false,
    supplierName:  document.getElementById("ap-supplier")?.value              || "",
    tags:          window.apTags || [],
    expiryDate:    document.getElementById("ap-expiry")?.value                || ""
  };

  // ── Check if user uploaded an image ──
  const imageFile = (window.apUploadedFiles || [])[0] || null;
  // NOTE: If no image, we skip the Storage upload entirely.
  // The category SVG icon fallback in firestoreToLocal() renders instantly.
  // This avoids the 3-8s delay from canvas generation + Storage upload.

  try {
    await addProductToFirestore(formData, imageFile);  // imageFile may be null — that's fine

    // Re-enable button
    if (saveBtn) {
      saveBtn.disabled    = false;
      saveBtn.textContent = origText;
      saveBtn.classList.remove("saving");
    }

    if (addAnother) {
      if (typeof showInlineSuccess   === "function") showInlineSuccess(name);
      if (typeof resetAddProductForm === "function") resetAddProductForm();
    } else {
      if (typeof closeAddProduct      === "function") closeAddProduct();
      if (typeof showSuccessAnimation === "function") showSuccessAnimation(name);
    }
  } catch (err) {
    console.error("Add product error:", err);
    // Show user-friendly error
    let msg = "Failed to save product.";
    if (err.code === "permission-denied") msg = "Permission denied — check Firestore rules.";
    else if (err.message) msg = err.message;
    alert("❌ " + msg);

    if (saveBtn) {
      saveBtn.disabled    = false;
      saveBtn.textContent = origText;
      saveBtn.classList.remove("saving");
    }
  }
};


// ══════════════════════════════════════════
// 4. EDIT PRODUCT
// ══════════════════════════════════════════
window.openEditModal = function(localId) {
  const fp = _firestoreProducts.find(p => p.id === localId || p.id === String(localId));
  if (!fp) return;

  let root = document.getElementById("inv-modal-root");
  if (!root) { root = document.createElement("div"); root.id = "inv-modal-root"; document.body.appendChild(root); }

  root.innerHTML = `
    <div class="inv-modal-overlay" onclick="closeInvModal()">
      <div class="inv-modal" onclick="event.stopPropagation()">
        <div class="inv-modal-header">
          <div class="inv-modal-title">✏️ Edit Product</div>
          <button class="inv-modal-close" onclick="closeInvModal()">✕</button>
        </div>
        <div class="inv-modal-body">
          <div class="inv-modal-field"><label>Product Name</label>
            <input id="fedit-name" type="text" value="${fp.productName || ""}"/></div>
          <div class="inv-modal-field"><label>Category</label>
            <input id="fedit-cat" type="text" value="${fp.category || ""}"/></div>
          <div class="inv-modal-row">
            <div class="inv-modal-field"><label>Price</label>
              <input id="fedit-price" type="number" min="0" value="${fp.price || 0}"/></div>
            <div class="inv-modal-field"><label>Cost Price</label>
              <input id="fedit-cost" type="number" min="0" value="${fp.costPrice || 0}"/></div>
          </div>
          <div class="inv-modal-row">
            <div class="inv-modal-field"><label>Stock Qty</label>
              <input id="fedit-stock" type="number" min="0" value="${fp.stockQuantity || 0}"/></div>
            <div class="inv-modal-field"><label>Min Threshold</label>
              <input id="fedit-threshold" type="number" min="0" value="${fp.minThreshold || 10}"/></div>
            <div class="inv-modal-field"><label>Unit</label>
              <input id="fedit-unit" type="text" value="${fp.unit || "pcs"}"/></div>
          </div>
          <div class="inv-modal-field"><label>Supplier</label>
            <input id="fedit-supplier" type="text" value="${fp.supplierName || ""}"/></div>
          <div class="inv-modal-field"><label>Expiry Date</label>
            <input id="fedit-expiry" type="date" value="${fp.expiryDate || ""}"/></div>
          <div class="inv-modal-field"><label>Replace Image (optional)</label>
            <input id="fedit-image" type="file" accept="image/*"
              style="color:var(--text-secondary);font-size:13px;"/></div>
          <div style="height:3px;background:rgba(255,255,255,.06);border-radius:2px;margin-top:-8px;">
            <div id="fedit-progress" style="height:100%;width:0%;background:linear-gradient(90deg,#4F80FF,#00C9A7);transition:width 300ms;"></div>
          </div>
        </div>
        <div class="inv-modal-footer">
          <button class="inv-modal-btn secondary" onclick="closeInvModal()">Cancel</button>
          <button class="inv-modal-btn primary" onclick="window._saveFirebaseEdit('${fp.id}','${fp.imagePath || ""}')">Save Changes</button>
        </div>
      </div>
    </div>`;
};

window._saveFirebaseEdit = async function(firestoreId, oldImagePath) {
  const formData = {
    productName:   document.getElementById("fedit-name")?.value.trim()     || "",
    category:      document.getElementById("fedit-cat")?.value.trim()      || "",
    price:         document.getElementById("fedit-price")?.value           || 0,
    costPrice:     document.getElementById("fedit-cost")?.value            || 0,
    stockQuantity: document.getElementById("fedit-stock")?.value           || 0,
    minThreshold:  document.getElementById("fedit-threshold")?.value       || 10,
    unit:          document.getElementById("fedit-unit")?.value            || "pcs",
    supplierName:  document.getElementById("fedit-supplier")?.value.trim() || "",
    expiryDate:    document.getElementById("fedit-expiry")?.value          || "",
    tags: []
  };
  const imageFile = document.getElementById("fedit-image")?.files?.[0] || null;
  const saveBtn   = document.querySelector(".inv-modal-footer .inv-modal-btn.primary");
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = "Saving..."; }

  // Immediately update in-memory so UI reflects instantly without waiting for Firestore
  const local = (inventoryProducts || []).find(p => p.firestoreId === firestoreId);
  if (local) {
    local.name         = formData.productName   || local.name;
    local.category     = formData.category      || local.category;
    local.stock        = parseInt(formData.stockQuantity) || local.stock;
    local.minThreshold = parseInt(formData.minThreshold)  || local.minThreshold;
    local.price        = [Math.round(parseFloat(formData.costPrice)||0), parseFloat(formData.price)||0];
    local.stockLevel   = local.stock <= local.minThreshold ? 'critical'
                        : local.stock <= local.minThreshold * 3 ? 'low' : 'healthy';
    if (typeof renderInventoryGrid === 'function') renderInventoryGrid();
  }

  try {
    await editProductInFirestore(firestoreId, formData, imageFile, oldImagePath, (pct) => {
      const bar = document.getElementById("fedit-progress");
      if (bar) bar.style.width = pct + "%";
    });
    if (typeof closeInvModal   === "function") closeInvModal();
    if (typeof exitFocusedMode === "function") exitFocusedMode();
    if (typeof showToast === 'function') showToast('"' + formData.productName + '" updated successfully');
  } catch (err) {
    console.error("Edit error:", err);
    alert("Failed to update: " + err.message);
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = "Save Changes"; }
  }
};

// Smart Delete: Case A = Firestore product, Case B = UI-only product
window.deleteProduct = async function(localId) {
  const local       = (inventoryProducts || []).find(p => p.id === localId || p.id === String(localId));
  const firestoreId = local?.firestoreId;   // undefined for UI-only products
  const imagePath   = local?.imagePath || '';
  const productName = local?.name || 'Product';

  // 1. Close modals and panels immediately
  if (typeof closeInvModal   === 'function') closeInvModal();
  if (typeof exitFocusedMode === 'function') exitFocusedMode();

  // 2. Remove from in-memory array instantly (card disappears immediately)
  const idx = (inventoryProducts || []).findIndex(p => p.id === localId || p.id === String(localId));
  if (idx !== -1) inventoryProducts.splice(idx, 1);
  if (typeof renderInventoryGrid === 'function') renderInventoryGrid();
  if (typeof showToast === 'function') showToast('"' + productName + '" deleted');

  // Case A: Has Firestore ID -> delete from DB
  if (firestoreId && typeof deleteProductFromFirestore === 'function') {
    try {
      await deleteProductFromFirestore(firestoreId, imagePath);
    } catch (err) {
      // Silent warn - UI already cleaned up
      console.warn('Firestore delete warn (may be UI-only):', err.code || err.message);
    }
  }
  // Case B: UI-only product -> already removed from array above, nothing more to do
};

// ══════════════════════════════════════════
// 6. RESTOCK
// ══════════════════════════════════════════
window.openRestockModal = function(localId) {
  const local        = (inventoryProducts || []).find(p => p.id === localId || p.id === String(localId));
  const firestoreId  = local?.firestoreId || String(localId);
  const productName  = local?.name        || "Product";
  const currentStock = local?.stock       || 0;

  _restockTargetId = firestoreId;

  let root = document.getElementById("inv-modal-root");
  if (!root) { root = document.createElement("div"); root.id = "inv-modal-root"; document.body.appendChild(root); }

  root.innerHTML = `
    <div class="inv-modal-overlay" onclick="closeInvModal()">
      <div class="inv-modal inv-modal-sm" onclick="event.stopPropagation()">
        <div class="inv-modal-header">
          <div class="inv-modal-title">📦 Restock — ${productName}</div>
          <button class="inv-modal-close" onclick="closeInvModal()">✕</button>
        </div>
        <div class="inv-modal-body">
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">
            Current stock: <strong style="color:var(--text-primary)">${currentStock} units</strong>
          </div>
          <div class="inv-modal-field"><label>Order Quantity</label>
            <div class="inv-qty-row">
              <button class="inv-qty-step" onclick="document.getElementById('restock-qty').value=Math.max(1,+document.getElementById('restock-qty').value-10)">−10</button>
              <button class="inv-qty-step" onclick="document.getElementById('restock-qty').value=Math.max(1,+document.getElementById('restock-qty').value-1)">−1</button>
              <input id="restock-qty" type="number" min="1" value="50" style="text-align:center;width:90px"/>
              <button class="inv-qty-step" onclick="document.getElementById('restock-qty').value=+document.getElementById('restock-qty').value+1">+1</button>
              <button class="inv-qty-step" onclick="document.getElementById('restock-qty').value=+document.getElementById('restock-qty').value+10">+10</button>
            </div>
          </div>
          <div class="inv-modal-field"><label>Delivery Priority</label>
            <select id="restock-priority" style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;color:var(--text-primary);font-family:inherit;font-size:14px;outline:none;width:100%;">
              <option value="Standard">🚛 Standard (5–7 days)</option>
              <option value="Express">⚡ Express (1–2 days)</option>
            </select>
          </div>
          <div style="display:flex;gap:8px;margin-top:4px;">
            <span style="font-size:12px;color:var(--text-muted)">Quick:</span>
            ${[50,100,200,500].map(n => `<button onclick="document.getElementById('restock-qty').value=${n}" style="background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:4px 10px;color:var(--text-secondary);font-size:12px;cursor:pointer;">${n}</button>`).join("")}
          </div>
        </div>
        <div class="inv-modal-footer">
          <button class="inv-modal-btn secondary" onclick="closeInvModal()">Cancel</button>
          <button class="inv-modal-btn primary" id="restock-confirm-btn" onclick="window._confirmFirebaseRestock()">Confirm Restock</button>
        </div>
      </div>
    </div>`;
};

window._confirmFirebaseRestock = async function() {
  if (!_restockTargetId) return;
  const qty      = parseInt(document.getElementById("restock-qty")?.value) || 0;
  const priority = document.getElementById("restock-priority")?.value      || "Standard";

  if (qty <= 0) { alert("Please enter a quantity greater than 0."); return; }

  const btn = document.getElementById("restock-confirm-btn");
  if (btn) { btn.disabled = true; btn.textContent = "Processing…"; }

  try {
    const newTotal = await restockProductInFirestore(_restockTargetId, qty, priority);
    if (typeof closeInvModal   === "function") closeInvModal();
    if (typeof exitFocusedMode === "function") exitFocusedMode();
    console.log(`✅ Restocked! New total: ${newTotal} (${priority})`);
  } catch (err) {
    console.error("Restock error:", err);
    alert("❌ Restock failed: " + err.message);
    if (btn) { btn.disabled = false; btn.textContent = "Confirm Restock"; }
  }
};

// ══════════════════════════════════════════
// 7. CLEANUP
// ══════════════════════════════════════════
window.addEventListener("beforeunload", stopListening);

// ═══════════════════════════════════════════
// 9. SVG ICON REPLACEMENT — replaces emoji in UI with themed SVGs
// ═══════════════════════════════════════════
const _SVG_ICONS = {
  // Analytics strip
  '\ud83d\udcc8': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`, // 📈
  '\ud83d\udce6': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`, // 📦
  '\ud83d\udcb0': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`, // 💰
  '\ud83d\udd2e': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/></svg>`, // 🔮
  // Card titles
  '\ud83d\udcca': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`, // 📊
  '\ud83c\udfc6': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`, // 🏆
  '\ud83e\udde0': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/></svg>`, // 🧠
  // Add Product panel
  '\ud83d\udccb': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1"/></svg>`, // 📋
  '\ud83d\uddbc\ufe0f': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`, // 🖼️
  '\u2699\ufe0f': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`, // ⚙️
  '\ud83d\udcf8': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`, // 📸
};

function _applyIconReplacements() {
  // Analytics strip icons
  document.querySelectorAll('.analytics-stat-icon').forEach(el => {
    const t = el.textContent.trim();
    if (_SVG_ICONS[t]) { el.innerHTML = _SVG_ICONS[t]; }
  });
  // Card title span icons
  document.querySelectorAll('.an-card-title > span:first-child, .ap-section-title > span').forEach(el => {
    const t = el.textContent.trim();
    if (_SVG_ICONS[t]) {
      el.innerHTML = _SVG_ICONS[t];
      el.style.display = 'inline-flex';
      el.style.alignItems = 'center';
    }
  });
  // Add Product header icon
  const apHeader = document.querySelector('.ap-header-icon');
  if (apHeader && _SVG_ICONS[apHeader.textContent.trim()]) {
    apHeader.innerHTML = _SVG_ICONS[apHeader.textContent.trim()];
    apHeader.style.cssText = 'width:42px;height:42px;background:linear-gradient(135deg,rgba(79,128,255,.15),rgba(0,201,167,.1));border-radius:12px;display:flex;align-items:center;justify-content:center;';
  }
  // Upload zone icon
  const upIcon = document.querySelector('.ap-upload-icon');
  if (upIcon && _SVG_ICONS[upIcon.textContent.trim()]) {
    upIcon.innerHTML = _SVG_ICONS[upIcon.textContent.trim()];
    upIcon.style.cssText = 'display:flex;justify-content:center;margin-bottom:8px;opacity:.5;';
  }
  // Predict card icon  
  const predictIcon = document.querySelector('.ap-predict-icon');
  if (predictIcon) {
    predictIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C9A7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/></svg>`;
    predictIcon.style.cssText = 'display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:rgba(0,201,167,.1);border-radius:8px;flex-shrink:0;';
  }
}

// Run on DOM ready + observe for dynamic panel opens
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _applyIconReplacements);
} else {
  _applyIconReplacements();
}
// Re-apply when Add Product panel opens (it has its own icons)
const _origOpenAP = window.openAddProduct;
window.openAddProduct = function() {
  _origOpenAP && _origOpenAP(...arguments);
  setTimeout(_applyIconReplacements, 100);
};
