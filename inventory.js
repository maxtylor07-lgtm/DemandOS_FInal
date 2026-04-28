// ═══════════════════════════════════════
// INVENTORY MANAGEMENT — REDESIGNED JS
// ═══════════════════════════════════════

const inventoryProducts = [
  { id:1, name:'Smart Watch Pro', emoji:'⌚', image:'images/smart-watch-pro.png', category:'Electronics', stock:245, stockLevel:'healthy', demand:'high', demandWord:'High', trend:'rising', trendArrow:'↗', price:[89,149], insight:'Demand has increased 34% this month. Sales peak expected during the upcoming holiday season.', points:[20,25,30,28,35,42,50,55,60,58,65,72] },
  { id:2, name:'Running Shoes X1', emoji:'👟', image:'images/running-shoes-x1.png', category:'Footwear', stock:12, stockLevel:'critical', demand:'high', demandWord:'High', trend:'rising', trendArrow:'↗', price:[65,120], insight:'Stock critically low. Reorder immediately — demand is rising with fitness season approaching.', points:[30,28,32,35,40,45,50,55,62,68,72,78] },
  { id:3, name:'Wireless Earbuds', emoji:'🎧', image:'images/wireless-earbuds.png', category:'Electronics', stock:89, stockLevel:'healthy', demand:'medium', demandWord:'Medium', trend:'stable', trendArrow:'→', price:[29,79], insight:'Steady demand with seasonal fluctuations. Current stock is sufficient for the next 3 weeks.', points:[40,42,38,41,39,43,40,42,44,41,43,42] },
  { id:4, name:'Yoga Mat Premium', emoji:'🧘', image:'images/yoga-mat-premium.png', category:'Fitness', stock:34, stockLevel:'low', demand:'medium', demandWord:'Medium', trend:'rising', trendArrow:'↗', price:[25,55], insight:'Demand is picking up with New Year fitness resolutions. Consider restocking soon.', points:[25,28,30,32,35,34,38,40,42,45,48,52] },
  { id:5, name:'USB-C Hub Ultra', emoji:'🔌', image:'images/usbc-hub-ultra.png', category:'Accessories', stock:156, stockLevel:'healthy', demand:'medium', demandWord:'Medium', trend:'stable', trendArrow:'→', price:[35,65], insight:'Consistent demand across all channels. Well-stocked for current order velocity.', points:[45,43,44,46,45,47,44,46,45,43,44,46] },
  { id:6, name:'Backpack Voyager', emoji:'🎒', image:'images/backpack-voyager.png', category:'Bags', stock:67, stockLevel:'healthy', demand:'low', demandWord:'Low', trend:'falling', trendArrow:'↘', price:[45,89], insight:'Demand declining post-travel season. Consider promotional pricing to move inventory.', points:[60,55,52,48,45,42,40,38,35,33,30,28] },
  { id:7, name:'Resistance Bands', emoji:'💪', image:'images/resistance-bands.png', category:'Fitness', stock:28, stockLevel:'low', demand:'high', demandWord:'High', trend:'rising', trendArrow:'↗', price:[12,35], insight:'Extremely popular in home fitness category. Stock running low against rising demand curve.', points:[15,20,25,30,35,42,50,58,65,70,75,82] },
  { id:8, name:'Desk Lamp LED', emoji:'💡', image:'images/desk-lamp-led.png', category:'Home Office', stock:92, stockLevel:'healthy', demand:'low', demandWord:'Low', trend:'stable', trendArrow:'→', price:[22,48], insight:'Stable low demand. Current stock will last approximately 8 weeks at current sell rate.', points:[20,22,21,23,20,22,21,19,20,22,21,23] },
  { id:9, name:'Water Bottle Steel', emoji:'🍶', image:'images/water-bottle-steel.png', category:'Lifestyle', stock:8, stockLevel:'critical', demand:'medium', demandWord:'Medium', trend:'rising', trendArrow:'↗', price:[15,32], insight:'Nearly out of stock with growing interest. Urgent restock needed to avoid missed sales.', points:[30,32,35,38,40,42,45,48,50,52,55,58] },
  { id:10, name:'Bluetooth Speaker', emoji:'🔊', image:'images/bluetooth-speaker.png', category:'Electronics', stock:45, stockLevel:'low', demand:'high', demandWord:'High', trend:'rising', trendArrow:'↗', price:[39,99], insight:'Strong social media driven demand. Currently trending on review platforms.', points:[22,28,35,40,48,55,60,68,72,78,82,88] },
  { id:11, name:'Phone Case Armor', emoji:'📱', image:'images/phone-case-armor.png', category:'Accessories', stock:320, stockLevel:'healthy', demand:'medium', demandWord:'Medium', trend:'stable', trendArrow:'→', price:[12,25], insight:'Reliable seller with consistent margins. Demand follows new phone release cycles.', points:[50,48,52,50,54,52,56,54,52,50,48,50] },
  { id:12, name:'Trail Mix Organic', emoji:'🥜', image:'images/trail-mix-organic.png', category:'Food', stock:180, stockLevel:'healthy', demand:'low', demandWord:'Low', trend:'falling', trendArrow:'↘', price:[8,18], insight:'Post-hiking season decline. Consider bundling with other outdoor products to boost sales.', points:[50,48,45,42,40,38,35,32,30,28,26,24] },
];

let invFocusedMode = false;
let invSelectedId = null;
let invActiveFilter = 'all';

function initInventory() {
  renderInventoryGrid();
  setupInvSearch();
  setupInvFilters();
  setupKeyboardExit();
}

// ═══════════ FILTER BAR ═══════════
function setupInvFilters() {
  const bar = document.getElementById('inv-filter-bar');
  if (!bar) return;

  const categories = ['All', ...new Set(inventoryProducts.map(p => p.category))];
  bar.innerHTML = categories.map(cat => {
    const val = cat === 'All' ? 'all' : cat.toLowerCase();
    return `<button class="inv-filter-chip${val === invActiveFilter ? ' active' : ''}" data-filter="${val}">${cat}</button>`;
  }).join('');

  bar.addEventListener('click', e => {
    const chip = e.target.closest('.inv-filter-chip');
    if (!chip) return;
    invActiveFilter = chip.dataset.filter;
    bar.querySelectorAll('.inv-filter-chip').forEach(c => c.classList.toggle('active', c === chip));
    if (invFocusedMode) exitFocusedMode();
    renderInventoryGrid();
  });
}

// ═══════════ KEYBOARD EXIT ═══════════
function setupKeyboardExit() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && invFocusedMode) {
      exitFocusedMode();
    }
  });
}

// ═══════════ RENDER GRID ═══════════
function renderInventoryGrid() {
  const grid = document.getElementById('inv-product-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const searchVal = document.getElementById('inv-search-input')?.value.toLowerCase() || '';

  let filtered = inventoryProducts.filter(p =>
    p.name.toLowerCase().includes(searchVal) || p.category.toLowerCase().includes(searchVal)
  );

  // Apply category filter
  if (invActiveFilter !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === invActiveFilter);
  }

  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'inv-card' + (invSelectedId === p.id ? ' selected' : '');
    card.setAttribute('data-id', p.id);
    card.onclick = () => enterFocusedMode(p.id);
    card.style.animationDelay = `${i * 40 + 40}ms`;

    const stockLabel = p.stockLevel === 'healthy' ? 'In Stock' : p.stockLevel === 'low' ? 'Low Stock' : 'Critical';
    const trendSymbol = p.trend === 'rising' ? '↑' : p.trend === 'falling' ? '↓' : '—';

    card.innerHTML = `
      <div class="inv-card-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.innerHTML='<span style=\\'font-size:48px\\'>${p.emoji}</span>'" />
        <div class="inv-card-status ${p.stockLevel}">
          <span class="inv-card-status-dot"></span>
          ${stockLabel}
        </div>
      </div>
      <div class="inv-card-body">
        <div class="inv-card-name">${p.name}</div>
        <div class="inv-card-category">${p.category}</div>
        <div class="inv-card-meta">
          <span class="inv-stock-badge ${p.stockLevel}">${p.stock} units</span>
          <span class="inv-demand-mini ${p.trend}">${trendSymbol} ${p.demandWord}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ═══════════ SEARCH ═══════════
function setupInvSearch() {
  const input = document.getElementById('inv-search-input');
  if (!input) return;
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (invFocusedMode) exitFocusedMode();
      renderInventoryGrid();
    }, 200);
  });
}

// ═══════════ ENTER FOCUSED MODE ═══════════
function enterFocusedMode(productId) {
  invFocusedMode = true;
  invSelectedId = productId;

  const layout = document.getElementById('inv-layout');
  const backBtn = document.getElementById('inv-back-btn');
  const detailPanel = document.getElementById('inv-detail-panel');
  const overlay = document.getElementById('inv-overlay');

  // Switch layout
  layout.classList.add('focused-mode');

  // Show back button
  backBtn.classList.add('visible');

  // Show overlay for click-outside detection
  if (overlay) overlay.classList.add('active');

  // Re-render grid as list
  renderInventoryGrid();

  // Build detail panel
  const product = inventoryProducts.find(p => p.id === productId);
  if (!product) return;

  detailPanel.innerHTML = buildDetailPanel(product);
  detailPanel.classList.add('visible');

  // Re-trigger animation
  detailPanel.style.animation = 'none';
  detailPanel.offsetHeight;
  detailPanel.style.animation = '';

  // Scroll selected card into view
  requestAnimationFrame(() => {
    const selectedCard = document.querySelector('.inv-card.selected');
    if (selectedCard) selectedCard.scrollIntoView({ behavior:'smooth', block:'nearest' });
  });
}

// ═══════════ EXIT FOCUSED MODE ═══════════
function exitFocusedMode() {
  invFocusedMode = false;
  invSelectedId = null;

  const layout = document.getElementById('inv-layout');
  const backBtn = document.getElementById('inv-back-btn');
  const detailPanel = document.getElementById('inv-detail-panel');
  const overlay = document.getElementById('inv-overlay');

  layout.classList.remove('focused-mode');
  backBtn.classList.remove('visible');
  detailPanel.classList.remove('visible');
  if (overlay) overlay.classList.remove('active');

  // Smooth exit: add a brief fade before re-render
  setTimeout(() => {
    detailPanel.innerHTML = '';
    renderInventoryGrid();
  }, 100);
}

// ═══════════ BUILD DETAIL PANEL ═══════════
function buildDetailPanel(p) {
  const chartPath = buildInvChartPath(p.points, 500, 120);
  const fillPath = chartPath + ' L 500,120 L 0,120 Z';
  const lastPt = p.points[p.points.length - 1];
  const maxPt = Math.max(...p.points);
  const lastY = 120 - ((lastPt / (maxPt * 1.1)) * 100) - 5;
  const strokeColor = p.demand === 'high' ? '#00C9A7' : p.demand === 'medium' ? '#F5A623' : '#8B909A';
  const fillColor = p.demand === 'high' ? 'rgba(0,201,167,.12)' : p.demand === 'medium' ? 'rgba(245,166,35,.12)' : 'rgba(139,144,154,.08)';

  const stockStatusText = p.stockLevel === 'critical' ? 'Critical' : p.stockLevel === 'low' ? 'Low' : 'Healthy';
  const trendLabel = p.trend.charAt(0).toUpperCase() + p.trend.slice(1);
  const trendIcon = p.trend === 'rising' ? '↗' : p.trend === 'falling' ? '↘' : '→';

  return `
    <!-- Hero -->
    <div class="inv-detail-hero">
      <div class="inv-detail-hero-img">
        <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none';this.parentElement.innerHTML='<span style=\\'font-size:64px;display:flex;align-items:center;justify-content:center;height:100%\\'>${p.emoji}</span>'" />
      </div>
      <div class="inv-detail-hero-info">
        <div class="inv-detail-name">${p.name}</div>
        <div class="inv-detail-category">${p.category}</div>
        <div class="inv-detail-stats">
          <div class="inv-detail-stat">
            <div class="inv-detail-stat-label">Stock</div>
            <div class="inv-detail-stat-value ${p.stockLevel}">${p.stock}</div>
          </div>
          <div class="inv-detail-stat">
            <div class="inv-detail-stat-label">Demand</div>
            <div class="inv-detail-stat-value ${p.demand === 'low' ? 'low-level' : p.demand}">${p.demandWord}</div>
          </div>
          <div class="inv-detail-stat">
            <div class="inv-detail-stat-label">Price Range</div>
            <div class="inv-detail-stat-value">$${p.price[0]}–$${p.price[1]}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sales Trend Graph -->
    <div class="inv-insight-card">
      <div class="inv-insight-title"><span>📊</span> Sales Trend & Demand Prediction</div>
      <div class="inv-demand-row">
        <span class="inv-demand-level ${p.demand}">${p.demandWord} Demand</span>
        <span class="inv-demand-trend ${p.trend}">${trendIcon} ${trendLabel}</span>
      </div>
      <div class="inv-chart-wrap">
        <svg viewBox="0 0 500 120" preserveAspectRatio="none">
          <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,.03)" stroke-width="1"/>
          <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,.03)" stroke-width="1"/>
          <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,.03)" stroke-width="1"/>
          <path class="inv-chart-fill" d="${fillPath}" fill="${fillColor}"/>
          <path class="inv-chart-line" d="${chartPath}" stroke="${strokeColor}"/>
          <circle cx="500" cy="${lastY}" r="4" fill="${strokeColor}" opacity="0.9"/>
          <circle cx="500" cy="${lastY}" r="8" fill="none" stroke="${strokeColor}" stroke-width="1.5" opacity="0.3">
            <animate attributeName="r" values="5;12;5" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
      <div class="inv-chart-labels"><span>12w ago</span><span>8w ago</span><span>4w ago</span><span>Now</span></div>
      <div class="inv-quick-insight">${p.insight}</div>
      <div class="inv-price-range">
        <span class="inv-price-label">Price Range</span>
        <span class="inv-price-value">$${p.price[0]}</span>
        <span class="inv-price-divider"></span>
        <span class="inv-price-value">$${p.price[1]}</span>
      </div>
    </div>

    <!-- Suggestions -->
    <div class="inv-detail-suggestions">
      <div class="inv-suggestion-card">
        <div class="inv-suggestion-icon ${p.stockLevel === 'critical' || p.stockLevel === 'low' ? 'restock' : 'trending'}">
          ${p.stockLevel === 'critical' || p.stockLevel === 'low' ? '📦' : '📈'}
        </div>
        <div class="inv-suggestion-title">${p.stockLevel === 'critical' ? 'Urgent Restock Needed' : p.stockLevel === 'low' ? 'Restock Recommended' : 'Stock Healthy'}</div>
        <div class="inv-suggestion-desc">${p.stockLevel === 'critical' ? 'Only '+p.stock+' units left. Order now to avoid stockout.' : p.stockLevel === 'low' ? 'Stock is getting low at '+p.stock+' units. Plan a reorder soon.' : 'You have '+p.stock+' units — sufficient for current demand.'}</div>
      </div>
      <div class="inv-suggestion-card">
        <div class="inv-suggestion-icon trending">📊</div>
        <div class="inv-suggestion-title">Demand ${p.trend === 'rising' ? 'Increasing' : p.trend === 'falling' ? 'Decreasing' : 'Stable'}</div>
        <div class="inv-suggestion-desc">${p.trend === 'rising' ? 'Customer interest is growing. Great time to ensure availability.' : p.trend === 'falling' ? 'Interest is declining. Consider promotional strategies.' : 'Demand is consistent. Maintain current stock levels.'}</div>
      </div>
    </div>

    <!-- Actions -->
    <div class="inv-detail-actions">
      <button class="inv-action-btn primary"  onclick="event.stopPropagation();openEditModal(${p.id})">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Edit Product
      </button>
      <button class="inv-action-btn secondary" onclick="event.stopPropagation();openRestockModal(${p.id})">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        Update Stock
      </button>
      <button class="inv-action-btn danger"   onclick="event.stopPropagation();confirmDeleteProduct(${p.id})">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        Delete
      </button>
    </div>
  `;
}

// ═══════════ MODAL SYSTEM ═══════════
function getOrCreateModalRoot() {
  let root = document.getElementById('inv-modal-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'inv-modal-root';
    document.body.appendChild(root);
  }
  return root;
}

function closeInvModal() {
  const root = document.getElementById('inv-modal-root');
  if (root) {
    root.innerHTML = '';
  }
}

// ═══════════ EDIT PRODUCT MODAL ═══════════
function openEditModal(productId) {
  const p = inventoryProducts.find(x => x.id === productId);
  if (!p) return;
  const root = getOrCreateModalRoot();
  root.innerHTML = `
    <div class="inv-modal-overlay" onclick="closeInvModal()">
      <div class="inv-modal" onclick="event.stopPropagation()">
        <div class="inv-modal-header">
          <div class="inv-modal-title">Edit Product</div>
          <button class="inv-modal-close" onclick="closeInvModal()">✕</button>
        </div>
        <div class="inv-modal-body">
          <div class="inv-modal-field">
            <label>Product Name</label>
            <input id="edit-name" type="text" value="${p.name}" />
          </div>
          <div class="inv-modal-field">
            <label>Category</label>
            <input id="edit-cat" type="text" value="${p.category}" />
          </div>
          <div class="inv-modal-row">
            <div class="inv-modal-field">
              <label>Stock Quantity</label>
              <input id="edit-stock" type="number" min="0" value="${p.stock}" />
            </div>
            <div class="inv-modal-field">
              <label>Price Low ($)</label>
              <input id="edit-price-low" type="number" min="0" value="${p.price[0]}" />
            </div>
            <div class="inv-modal-field">
              <label>Price High ($)</label>
              <input id="edit-price-high" type="number" min="0" value="${p.price[1]}" />
            </div>
          </div>
          <div class="inv-modal-field">
            <label>Insight / Notes</label>
            <textarea id="edit-insight" rows="3">${p.insight}</textarea>
          </div>
        </div>
        <div class="inv-modal-footer">
          <button class="inv-modal-btn secondary" onclick="closeInvModal()">Cancel</button>
          <button class="inv-modal-btn primary" onclick="saveEditProduct(${productId})">Save Changes</button>
        </div>
      </div>
    </div>`;
  ensureModalStyles();
}

function saveEditProduct(productId) {
  const p = inventoryProducts.find(x => x.id === productId);
  if (!p) return;
  p.name     = document.getElementById('edit-name').value.trim() || p.name;
  p.category = document.getElementById('edit-cat').value.trim() || p.category;
  p.stock    = parseInt(document.getElementById('edit-stock').value) || 0;
  p.price    = [parseInt(document.getElementById('edit-price-low').value) || 0, parseInt(document.getElementById('edit-price-high').value) || 0];
  p.insight  = document.getElementById('edit-insight').value.trim() || p.insight;
  p.stockLevel = p.stock <= 10 ? 'critical' : p.stock <= 40 ? 'low' : 'healthy';
  closeInvModal();
  renderInventoryGrid();
  showToast(`✅ "${p.name}" updated successfully`);
  enterFocusedMode(productId);
}

// ═══════════ RESTOCK MODAL ═══════════
function openRestockModal(productId) {
  const p = inventoryProducts.find(x => x.id === productId);
  if (!p) return;
  const root = getOrCreateModalRoot();
  root.innerHTML = `
    <div class="inv-modal-overlay" onclick="closeInvModal()">
      <div class="inv-modal inv-modal-sm" onclick="event.stopPropagation()">
        <div class="inv-modal-header">
          <div class="inv-modal-title">Update Stock — ${p.name}</div>
          <button class="inv-modal-close" onclick="closeInvModal()">✕</button>
        </div>
        <div class="inv-modal-body">
          <div class="inv-modal-stock-display">Current: <strong>${p.stock}</strong> units</div>
          <div class="inv-modal-field">
            <label>Set New Stock Quantity</label>
            <div class="inv-qty-row">
              <button class="inv-qty-step" onclick="stepQty(-10)">−10</button>
              <button class="inv-qty-step" onclick="stepQty(-1)">−1</button>
              <input id="restock-qty" type="number" min="0" value="${p.stock}" style="text-align:center;width:90px"/>
              <button class="inv-qty-step" onclick="stepQty(1)">+1</button>
              <button class="inv-qty-step" onclick="stepQty(10)">+10</button>
            </div>
          </div>
          <div class="inv-modal-presets">
            <span class="inv-preset-label">Quick set:</span>
            <button class="inv-preset-btn" onclick="document.getElementById('restock-qty').value=50">50</button>
            <button class="inv-preset-btn" onclick="document.getElementById('restock-qty').value=100">100</button>
            <button class="inv-preset-btn" onclick="document.getElementById('restock-qty').value=200">200</button>
            <button class="inv-preset-btn" onclick="document.getElementById('restock-qty').value=500">500</button>
          </div>
        </div>
        <div class="inv-modal-footer">
          <button class="inv-modal-btn secondary" onclick="closeInvModal()">Cancel</button>
          <button class="inv-modal-btn primary" onclick="saveRestock(${productId})">Update Stock</button>
        </div>
      </div>
    </div>`;
  ensureModalStyles();
}

function stepQty(delta) {
  const input = document.getElementById('restock-qty');
  if (!input) return;
  input.value = Math.max(0, (parseInt(input.value) || 0) + delta);
}

function saveRestock(productId) {
  const p = inventoryProducts.find(x => x.id === productId);
  if (!p) return;
  const newQty = parseInt(document.getElementById('restock-qty').value) || 0;
  const oldQty = p.stock;
  p.stock = newQty;
  p.stockLevel = newQty <= 10 ? 'critical' : newQty <= 40 ? 'low' : 'healthy';
  closeInvModal();
  renderInventoryGrid();
  const diff = newQty - oldQty;
  showToast(`📦 Stock ${diff >= 0 ? 'increased' : 'decreased'} by ${Math.abs(diff)} → now ${newQty} units`);
  enterFocusedMode(productId);
}

// ═══════════ DELETE PRODUCT ═══════════
function confirmDeleteProduct(productId) {
  const p = inventoryProducts.find(x => x.id === productId);
  if (!p) return;
  const root = getOrCreateModalRoot();
  root.innerHTML = `
    <div class="inv-modal-overlay" onclick="closeInvModal()">
      <div class="inv-modal inv-modal-sm" onclick="event.stopPropagation()">
        <div class="inv-modal-header">
          <div class="inv-modal-title" style="color:#FF5F57">Delete Product</div>
          <button class="inv-modal-close" onclick="closeInvModal()">✕</button>
        </div>
        <div class="inv-modal-body">
          <p style="color:var(--text-secondary);font-size:14px;line-height:1.6;">
            Are you sure you want to delete <strong style="color:var(--text-primary)">${p.name}</strong>?<br/>
            This action cannot be undone.
          </p>
        </div>
        <div class="inv-modal-footer">
          <button class="inv-modal-btn secondary" onclick="closeInvModal()">Cancel</button>
          <button class="inv-modal-btn danger" onclick="deleteProduct(${productId})">Yes, Delete</button>
        </div>
      </div>
    </div>`;
  ensureModalStyles();
}

function deleteProduct(productId) {
  const idx = inventoryProducts.findIndex(x => x.id === productId);
  const name = inventoryProducts[idx]?.name;
  if (idx === -1) return;
  inventoryProducts.splice(idx, 1);
  closeInvModal();
  exitFocusedMode();
  showToast(`🗑️ "${name}" removed from inventory`);
}

// ═══════════ ADD PRODUCT (from header button) ═══════════
function openAddProductModal() {
  const root = getOrCreateModalRoot();
  root.innerHTML = `
    <div class="inv-modal-overlay" onclick="closeInvModal()">
      <div class="inv-modal" onclick="event.stopPropagation()">
        <div class="inv-modal-header">
          <div class="inv-modal-title">Add New Product</div>
          <button class="inv-modal-close" onclick="closeInvModal()">✕</button>
        </div>
        <div class="inv-modal-body">
          <div class="inv-modal-field"><label>Product Name *</label><input id="add-name" type="text" placeholder="e.g. Premium Headphones" /></div>
          <div class="inv-modal-field"><label>Category *</label><input id="add-cat" type="text" placeholder="e.g. Electronics" /></div>
          <div class="inv-modal-row">
            <div class="inv-modal-field"><label>Stock Qty *</label><input id="add-stock" type="number" min="0" placeholder="0" /></div>
            <div class="inv-modal-field"><label>Price Low ($)</label><input id="add-price-low" type="number" min="0" placeholder="0" /></div>
            <div class="inv-modal-field"><label>Price High ($)</label><input id="add-price-high" type="number" min="0" placeholder="0" /></div>
          </div>
          <div class="inv-modal-field"><label>Notes / Insight</label><textarea id="add-insight" rows="2" placeholder="Brief product insight..."></textarea></div>
        </div>
        <div class="inv-modal-footer">
          <button class="inv-modal-btn secondary" onclick="closeInvModal()">Cancel</button>
          <button class="inv-modal-btn primary" onclick="saveNewProduct()">Add Product</button>
        </div>
      </div>
    </div>`;
  ensureModalStyles();
}

function saveNewProduct() {
  const name   = document.getElementById('add-name').value.trim();
  const cat    = document.getElementById('add-cat').value.trim();
  const stock  = parseInt(document.getElementById('add-stock').value) || 0;
  const pLow   = parseInt(document.getElementById('add-price-low').value) || 0;
  const pHigh  = parseInt(document.getElementById('add-price-high').value) || 0;
  const insight = document.getElementById('add-insight').value.trim();
  if (!name || !cat) { showToast('⚠️ Name and category are required', 'warn'); return; }
  const newId = Math.max(...inventoryProducts.map(p => p.id)) + 1;
  inventoryProducts.push({
    id: newId, name, emoji: '📦', image: '',
    category: cat, stock,
    stockLevel: stock <= 10 ? 'critical' : stock <= 40 ? 'low' : 'healthy',
    demand: 'medium', demandWord: 'Medium', trend: 'stable', trendArrow: '→',
    price: [pLow, pHigh], insight: insight || 'Newly added product.',
    points: [30,32,30,34,32,34,36,34,36,38,36,38],
  });
  closeInvModal();
  renderInventoryGrid();
  showToast(`✅ "${name}" added to inventory`);
}

// ═══════════ TOAST NOTIFICATION ═══════════
function showToast(msg, type = 'success') {
  let toast = document.getElementById('inv-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'inv-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'inv-toast show' + (type === 'warn' ? ' warn' : '');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ═══════════ INJECT MODAL + TOAST STYLES ═══════════
let _modalStylesInjected = false;
function ensureModalStyles() {
  if (_modalStylesInjected) return;
  _modalStylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    .inv-modal-overlay {
      position: fixed; inset: 0; z-index: 2000;
      background: rgba(0,0,0,0.65); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn 200ms ease;
    }
    .inv-modal {
      background: var(--surface, #161B27); border: 1px solid var(--border, rgba(255,255,255,0.08));
      border-radius: 16px; width: 100%; max-width: 540px;
      box-shadow: 0 32px 80px rgba(0,0,0,0.5);
      animation: slideUp 250ms cubic-bezier(0.34,1.56,0.64,1);
    }
    .inv-modal-sm { max-width: 400px; }
    .inv-modal-header {
      padding: 20px 24px 16px; border-bottom: 1px solid var(--border, rgba(255,255,255,0.08));
      display: flex; align-items: center; justify-content: space-between;
    }
    .inv-modal-title { font-size: 16px; font-weight: 700; color: var(--text-primary, #fff); }
    .inv-modal-close {
      background: none; border: none; color: var(--text-muted, #666);
      font-size: 16px; cursor: pointer; padding: 4px 8px; border-radius: 6px;
      transition: background 150ms, color 150ms;
    }
    .inv-modal-close:hover { background: rgba(255,255,255,0.06); color: var(--text-primary, #fff); }
    .inv-modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
    .inv-modal-field { display: flex; flex-direction: column; gap: 6px; }
    .inv-modal-field label { font-size: 11px; font-weight: 600; color: var(--text-muted, #888); letter-spacing: 0.05em; text-transform: uppercase; }
    .inv-modal-field input, .inv-modal-field textarea {
      background: var(--bg2, #0F1118); border: 1px solid var(--border, rgba(255,255,255,0.08));
      border-radius: 8px; padding: 10px 14px; color: var(--text-primary, #fff);
      font-family: inherit; font-size: 14px; outline: none; width: 100%; box-sizing: border-box;
      transition: border-color 200ms;
    }
    .inv-modal-field input:focus, .inv-modal-field textarea:focus { border-color: var(--accent, #4F80FF); }
    .inv-modal-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    .inv-modal-stock-display { font-size: 14px; color: var(--text-secondary, #aaa); padding: 10px 14px; background: var(--bg2, #0F1118); border-radius: 8px; }
    .inv-qty-row { display: flex; align-items: center; gap: 6px; }
    .inv-qty-step {
      background: var(--bg2, #0F1118); border: 1px solid var(--border, rgba(255,255,255,0.08));
      border-radius: 6px; color: var(--text-primary, #fff); padding: 8px 10px;
      font-family: inherit; font-size: 12px; font-weight: 600; cursor: pointer;
      transition: background 150ms; white-space: nowrap;
    }
    .inv-qty-step:hover { background: rgba(79,128,255,0.15); border-color: rgba(79,128,255,0.3); }
    .inv-modal-presets { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .inv-preset-label { font-size: 11px; color: var(--text-muted, #888); }
    .inv-preset-btn {
      background: var(--bg2, #0F1118); border: 1px solid var(--border, rgba(255,255,255,0.08));
      border-radius: 20px; color: var(--text-secondary, #aaa);
      padding: 4px 12px; font-size: 12px; cursor: pointer;
      transition: background 150ms, color 150ms;
    }
    .inv-preset-btn:hover { background: rgba(79,128,255,0.15); color: var(--accent, #4F80FF); }
    .inv-modal-footer {
      padding: 16px 24px 20px; border-top: 1px solid var(--border, rgba(255,255,255,0.08));
      display: flex; gap: 10px; justify-content: flex-end;
    }
    .inv-modal-btn {
      border-radius: 8px; padding: 10px 20px; font-family: inherit;
      font-size: 13px; font-weight: 600; cursor: pointer; border: none;
      transition: opacity 200ms, transform 150ms;
    }
    .inv-modal-btn:active { transform: scale(0.97); }
    .inv-modal-btn.primary { background: var(--accent, #4F80FF); color: #fff; }
    .inv-modal-btn.primary:hover { opacity: 0.88; }
    .inv-modal-btn.secondary { background: rgba(255,255,255,0.07); color: var(--text-secondary, #aaa); border: 1px solid var(--border, rgba(255,255,255,0.08)); }
    .inv-modal-btn.secondary:hover { background: rgba(255,255,255,0.12); }
    .inv-modal-btn.danger { background: rgba(255,95,87,0.15); color: #FF5F57; border: 1px solid rgba(255,95,87,0.3); }
    .inv-modal-btn.danger:hover { background: rgba(255,95,87,0.25); }
    .inv-action-btn.danger { background: rgba(255,95,87,0.1); color: #FF5F57; border: 1px solid rgba(255,95,87,0.25); }
    .inv-action-btn.danger:hover { background: rgba(255,95,87,0.2); }
    .inv-action-btn svg { width: 14px; height: 14px; flex-shrink: 0; }
    .inv-action-btn { display: inline-flex; align-items: center; gap: 6px; }
    .inv-toast {
      position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(20px);
      background: var(--surface, #161B27); border: 1px solid var(--border, rgba(255,255,255,0.1));
      border-radius: 40px; padding: 12px 24px; font-size: 13px; font-weight: 500;
      color: var(--text-primary, #fff); box-shadow: 0 12px 40px rgba(0,0,0,0.4);
      z-index: 3000; opacity: 0; transition: opacity 300ms, transform 300ms;
      pointer-events: none; white-space: nowrap;
    }
    .inv-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    .inv-toast.warn { border-color: rgba(254,188,46,0.4); color: #FEBC2E; }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    @keyframes slideUp { from { transform: translateY(20px) scale(0.97); opacity: 0; } to { transform: none; opacity: 1; } }
  `;
  document.head.appendChild(style);
}

// ═══════════ CHART PATH BUILDER ═══════════
function buildInvChartPath(pts, w, h) {
  if (!pts.length) return '';
  const maxVal = Math.max(...pts) * 1.1;
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w);
  const ys = pts.map(p => h - ((p / maxVal) * h * 0.8) - h * 0.05);
  let d = `M ${xs[0]},${ys[0]}`;
  for (let i = 1; i < pts.length; i++) {
    const cpx = (xs[i-1] + xs[i]) / 2;
    d += ` C ${cpx},${ys[i-1]} ${cpx},${ys[i]} ${xs[i]},${ys[i]}`;
  }
  return d;
}

// ═══════════ SECTION SWITCH HOOKS ═══════════
const origSwitchSection = window.switchSection;
if (origSwitchSection) {
  window.switchSection = function(name, navEl) {
    const result = origSwitchSection(name, navEl);
    if (name === 'inventory') {
      invFocusedMode = false;
      invSelectedId = null;
      invActiveFilter = 'all';
      setTimeout(initInventory, 50);
    }
    if (name === 'demand') {
      setTimeout(initDemandPage, 50);
    }
    if (name === 'trends') {
      setTimeout(initTrends, 50);
    }
    if (name === 'alerts') {
      setTimeout(initAlerts, 50);
    }
    if (name === 'analytics') {
      setTimeout(() => {
        const graphEl = document.getElementById('analytics-graph');
        if (graphEl) graphEl.innerHTML = getAnalyticsGraphSVG();
        initAnalytics();
      }, 50);
    }
    return result;
  };
}

// ═══════════ INIT ON LOAD ═══════════
window.addEventListener('load', () => {
  setTimeout(() => {
    if (document.getElementById('section-inventory')?.classList.contains('active')) {
      initInventory();
    }
  }, 100);
});
