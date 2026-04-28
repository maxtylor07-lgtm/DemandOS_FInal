// ═══════════════════════════════════════
// TRENDS PAGE — REDESIGNED JS
// ═══════════════════════════════════════

// Image map for all trend products
const trendImageMap = {
  'Smart Watch Pro': 'images/smart-watch-pro.png',
  'Wireless Earbuds': 'images/wireless-earbuds.png',
  'Bluetooth Speaker': 'images/bluetooth-speaker.png',
  'USB-C Hub': 'images/usbc-hub-ultra.png',
  '4K Webcam': 'images/webcam-4k.png',
  'Phone Case Armor': 'images/phone-case-armor.png',
  'Running Shoes X1': 'images/running-shoes-x1.png',
  'Yoga Mat Premium': 'images/yoga-mat-premium.png',
  'Resistance Bands': 'images/resistance-bands.png',
  'Protein Shaker': 'images/protein-shaker.png',
  'Oversized Hoodie': 'images/oversized-hoodie.png',
  'Canvas Sneakers': 'images/canvas-sneakers.png',
  'Crossbody Bag': 'images/crossbody-bag.png',
  'Cold Brew Coffee': 'images/cold-brew-coffee.png',
  'Protein Bars': 'images/protein-bars.png',
  'Trail Mix Organic': 'images/trail-mix-organic.png',
  'Desk Lamp LED': 'images/desk-lamp-led.png',
  'Ergonomic Chair': 'images/ergonomic-chair.png',
  'Water Bottle Steel': 'images/water-bottle-steel.png',
  'Backpack Voyager': 'images/backpack-voyager.png',
  'Journal Notebook': 'images/journal-notebook.png',
};

// SVG icons for categories (consistent line-icon system)
const trendCatIcons = {
  'all': '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  'electronics': '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  'fitness': '<svg viewBox="0 0 24 24"><path d="M6.5 6.5a1.5 1.5 0 1 1 3 0v11a1.5 1.5 0 0 1-3 0z"/><path d="M14.5 6.5a1.5 1.5 0 1 1 3 0v11a1.5 1.5 0 0 1-3 0z"/><line x1="9.5" y1="12" x2="14.5" y2="12"/><line x1="3" y1="9" x2="6.5" y2="9"/><line x1="3" y1="15" x2="6.5" y2="15"/><line x1="17.5" y1="9" x2="21" y2="9"/><line x1="17.5" y1="15" x2="21" y2="15"/></svg>',
  'fashion': '<svg viewBox="0 0 24 24"><path d="M12 2L8 6H4v4l-2 2 2 2v4h4l4 4 4-4h4v-4l2-2-2-2V6h-4L12 2z"/></svg>',
  'food': '<svg viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
  'home': '<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  'lifestyle': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><line x1="2" y1="12" x2="22" y2="12"/></svg>',
};

const trendCategories = [
  { id:'all', label:'All Categories' },
  { id:'electronics', label:'Electronics' },
  { id:'fitness', label:'Fitness' },
  { id:'fashion', label:'Fashion' },
  { id:'food', label:'Food & Grocery' },
  { id:'home', label:'Home & Office' },
  { id:'lifestyle', label:'Lifestyle' },
];

const trendProducts = [
  { name:'Smart Watch Pro', emoji:'⌚', cat:'electronics', demand:'high', tag:'rising', tagLabel:'🔥 Rising', reason:'Wearable tech adoption surging globally. Holiday season approaching with expected 40% demand spike.', price:'$89–$149', competition:'High', points:[20,25,30,28,35,42,50,55,60,58,65,72] },
  { name:'Wireless Earbuds', emoji:'🎧', cat:'electronics', demand:'medium', tag:'stable', tagLabel:'📊 Stable', reason:'Market is saturated but consistent. Noise-canceling models drive premium segment.', price:'$29–$79', competition:'Very High', points:[40,42,38,41,39,43,40,42,44,41,43,42] },
  { name:'Bluetooth Speaker', emoji:'🔊', cat:'electronics', demand:'high', tag:'viral', tagLabel:'🔥 Viral', reason:'Trending on social media. Waterproof portable models going viral on TikTok.', price:'$39–$99', competition:'Medium', points:[22,28,35,40,48,55,60,68,72,78,82,88] },
  { name:'USB-C Hub', emoji:'🔌', cat:'electronics', demand:'medium', tag:'stable', tagLabel:'📊 Stable', reason:'Steady demand from remote workers. New laptop releases drive periodic spikes.', price:'$35–$65', competition:'Medium', points:[45,43,44,46,45,47,44,46,45,43,44,46] },
  { name:'4K Webcam', emoji:'📹', cat:'electronics', demand:'medium', tag:'rising', tagLabel:'🔥 Rising', reason:'Streaming culture growth. Content creation tools seeing increased demand.', price:'$49–$129', competition:'Low', points:[30,32,35,38,42,45,48,52,55,58,62,65] },
  { name:'Phone Case Armor', emoji:'📱', cat:'electronics', demand:'medium', tag:'stable', tagLabel:'📊 Stable', reason:'Follows new phone release cycles. Compatible models drive periodic spikes.', price:'$12–$25', competition:'High', points:[50,48,52,50,54,52,56,54,52,50,48,50] },
  { name:'Running Shoes X1', emoji:'👟', cat:'fitness', demand:'high', tag:'rising', tagLabel:'🔥 Rising', reason:'Fitness season approaching. Marathon events and social media fitness trends key drivers.', price:'$65–$120', competition:'High', points:[30,28,32,35,40,45,50,55,62,68,72,78] },
  { name:'Yoga Mat Premium', emoji:'🧘', cat:'fitness', demand:'medium', tag:'rising', tagLabel:'📈 Growing', reason:'Home fitness trend continuing. Eco-friendly materials gaining market share.', price:'$25–$55', competition:'Medium', points:[25,28,30,32,35,34,38,40,42,45,48,52] },
  { name:'Resistance Bands', emoji:'💪', cat:'fitness', demand:'high', tag:'viral', tagLabel:'🔥 Viral', reason:'Home gym revolution. Fitness influencers driving massive social media demand.', price:'$12–$35', competition:'Low', points:[15,20,25,30,35,42,50,58,65,70,75,82] },
  { name:'Protein Shaker', emoji:'🥤', cat:'fitness', demand:'medium', tag:'stable', tagLabel:'📊 Stable', reason:'Consistent gym-goer demand. New designs with mixing balls trending.', price:'$8–$22', competition:'Medium', points:[35,37,36,38,37,39,38,36,37,39,38,40] },
  { name:'Oversized Hoodie', emoji:'🧥', cat:'fashion', demand:'high', tag:'viral', tagLabel:'🔥 Viral', reason:'Streetwear trend on social media. Seasonal demand spike with fall/winter approaching.', price:'$35–$75', competition:'High', points:[25,30,38,45,52,58,65,70,75,80,85,90] },
  { name:'Canvas Sneakers', emoji:'👟', cat:'fashion', demand:'medium', tag:'rising', tagLabel:'📈 Growing', reason:'Retro fashion comeback. Sustainable materials version gaining traction.', price:'$40–$85', competition:'High', points:[35,38,40,42,45,48,50,53,55,58,60,63] },
  { name:'Crossbody Bag', emoji:'👜', cat:'fashion', demand:'low', tag:'declining', tagLabel:'📉 Declining', reason:'Post-season decline. Smaller minimalist styles replacing larger models.', price:'$25–$60', competition:'Medium', points:[55,52,50,48,45,42,40,38,35,32,30,28] },
  { name:'Cold Brew Coffee', emoji:'☕', cat:'food', demand:'high', tag:'rising', tagLabel:'🔥 Rising', reason:'Summer season approaching. Ready-to-drink coffee market expanding rapidly.', price:'$3–$8', competition:'Medium', points:[28,32,35,40,45,50,55,60,65,70,75,80] },
  { name:'Protein Bars', emoji:'🍫', cat:'food', demand:'medium', tag:'stable', tagLabel:'📊 Stable', reason:'Health-conscious consumers maintain consistent demand. New flavors drive trial.', price:'$2–$5', competition:'High', points:[42,44,43,45,44,46,45,43,44,46,45,47] },
  { name:'Trail Mix Organic', emoji:'🥜', cat:'food', demand:'low', tag:'declining', tagLabel:'📉 Declining', reason:'Post-hiking season. Competition from newer snack alternatives increasing.', price:'$8–$18', competition:'Medium', points:[50,48,45,42,40,38,35,32,30,28,26,24] },
  { name:'Desk Lamp LED', emoji:'💡', cat:'home', demand:'low', tag:'stable', tagLabel:'📊 Stable', reason:'Remote work maintains baseline demand. Growth limited in mature market.', price:'$22–$48', competition:'Medium', points:[20,22,21,23,20,22,21,19,20,22,21,23] },
  { name:'Ergonomic Chair', emoji:'🪑', cat:'home', demand:'medium', tag:'rising', tagLabel:'📈 Growing', reason:'Work-from-home ergonomics awareness growing. Premium models trending.', price:'$150–$400', competition:'Medium', points:[30,32,35,38,40,43,45,48,50,53,55,58] },
  { name:'Water Bottle Steel', emoji:'🍶', cat:'lifestyle', demand:'medium', tag:'rising', tagLabel:'📈 Growing', reason:'Sustainability consciousness driving demand. Summer months show predictable peaks.', price:'$15–$32', competition:'Medium', points:[30,32,35,38,40,42,45,48,50,52,55,58] },
  { name:'Backpack Voyager', emoji:'🎒', cat:'lifestyle', demand:'low', tag:'declining', tagLabel:'📉 Declining', reason:'Post-travel season. Demand expected to recover with next vacation period.', price:'$45–$89', competition:'High', points:[60,55,52,48,45,42,40,38,35,33,30,28] },
  { name:'Journal Notebook', emoji:'📓', cat:'lifestyle', demand:'medium', tag:'rising', tagLabel:'📈 Growing', reason:'Mindfulness and productivity journaling trending. Leather-bound premium versions popular.', price:'$12–$30', competition:'Low', points:[28,30,33,35,38,40,42,45,48,50,52,55] },
];

const trendSections = [
  { id:'fast', title:'Fast Moving', emoji:'⚡', filter: p => p.demand === 'high' },
  { id:'viral', title:'Viral Products', emoji:'🔥', filter: p => p.tag === 'viral' || p.tag === 'rising' },
  { id:'profit', title:'High Profit Potential', emoji:'💰', filter: p => p.competition === 'Low' || p.competition === 'Medium' },
  { id:'ordered', title:'Most Popular This Week', emoji:'🛒', filter: p => p.demand !== 'low' },
  { id:'falling', title:'Falling Trends', emoji:'📉', filter: p => p.tag === 'declining' },
];

let currentTrendCat = 'all';

function initTrends() {
  renderTrendCategories();
  renderTrendSections();
}

function renderTrendCategories() {
  const list = document.getElementById('trends-cat-list');
  if (!list) return;
  list.innerHTML = '';
  trendCategories.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'trends-cat-item' + (c.id === currentTrendCat ? ' active' : '');
    btn.innerHTML = `<span class="trends-cat-icon">${trendCatIcons[c.id] || ''}</span><span>${c.label}</span>`;
    btn.onclick = () => { currentTrendCat = c.id; renderTrendCategories(); renderTrendSections(); };
    list.appendChild(btn);
  });
}

function renderTrendSections() {
  const main = document.getElementById('trends-sections');
  if (!main) return;
  main.innerHTML = '';

  const filtered = currentTrendCat === 'all' ? trendProducts : trendProducts.filter(p => p.cat === currentTrendCat);

  trendSections.forEach(sec => {
    const products = filtered.filter(sec.filter);
    if (!products.length) return;

    const section = document.createElement('div');
    section.className = 'trend-section';
    section.innerHTML = `<div class="trend-section-head"><span class="trend-section-emoji">${sec.emoji}</span><span class="trend-section-title">${sec.title}</span><span class="trend-section-count">${products.length} products</span></div>`;

    const railWrap = document.createElement('div');
    railWrap.className = 'trend-rail-wrap';

    const rail = document.createElement('div');
    rail.className = 'trend-rail';

    products.forEach(p => {
      const imgSrc = trendImageMap[p.name] || '';
      const card = document.createElement('div');
      card.className = 'trend-card';
      card.onclick = (e) => openTrendModal(p, e);
      card.innerHTML = `
        <div class="trend-card-img">
          <img src="${imgSrc}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.style.display='flex';this.parentElement.style.alignItems='center';this.parentElement.style.justifyContent='center';this.parentElement.style.fontSize='44px';this.parentElement.insertAdjacentHTML('beforeend','${p.emoji}')" />
          <div class="trend-card-overlay">
            <div class="trend-card-overlay-name">${p.name}</div>
            <span class="trend-card-overlay-tag ${p.tag}">${p.tagLabel}</span>
            <div class="trend-card-overlay-actions">
              <button class="trend-card-overlay-btn view" onclick="event.stopPropagation();openTrendModal(trendProducts.find(x=>x.name==='${p.name.replace(/'/g,"\\'")}'))">View</button>
              <button class="trend-card-overlay-btn analyze" onclick="event.stopPropagation();openTrendModal(trendProducts.find(x=>x.name==='${p.name.replace(/'/g,"\\'")}'))">Analyze</button>
            </div>
          </div>
        </div>
        <div class="trend-card-body">
          <div class="trend-card-name">${p.name}</div>
          <span class="trend-tag ${p.tag}">${p.tagLabel}</span>
        </div>`;
      rail.appendChild(card);
    });

    // Arrow buttons
    const leftArrow = document.createElement('button');
    leftArrow.className = 'trend-rail-arrow left';
    leftArrow.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>';
    leftArrow.onclick = () => { rail.scrollBy({ left: -300, behavior: 'smooth' }); };

    const rightArrow = document.createElement('button');
    rightArrow.className = 'trend-rail-arrow right';
    rightArrow.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>';
    rightArrow.onclick = () => { rail.scrollBy({ left: 300, behavior: 'smooth' }); };

    railWrap.appendChild(leftArrow);
    railWrap.appendChild(rail);
    railWrap.appendChild(rightArrow);
    section.appendChild(railWrap);
    main.appendChild(section);

    // Enable mouse drag scrolling
    enableDragScroll(rail);
  });

  // Re-trigger animations
  main.style.animation = 'none';
  main.offsetHeight;
  main.style.animation = '';
}

// Mouse drag scrolling for rails
function enableDragScroll(el) {
  let isDown = false, startX, scrollLeft;
  el.addEventListener('mousedown', e => {
    if (e.target.closest('button')) return;
    isDown = true; el.style.cursor = 'grabbing';
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });
  el.addEventListener('mouseleave', () => { isDown = false; el.style.cursor = 'grab'; });
  el.addEventListener('mouseup', () => { isDown = false; el.style.cursor = 'grab'; });
  el.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}


// ═══ TREND POPUP — smart anchored popover with tail ═══════════════════════

let _tpStylesInjected = false;
function ensureTrendPopupStyles() {
  if (_tpStylesInjected) return;
  _tpStylesInjected = true;
  const s = document.createElement('style');
  s.textContent = `
    .trend-popup {
      position:fixed; width:264px; z-index:4000;
      background:#161B27; border:1px solid rgba(255,255,255,.12);
      border-radius:14px;
      box-shadow:0 24px 80px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.05);
      animation:tpIn 300ms cubic-bezier(.34,1.56,.64,1) forwards;
    }
    @keyframes tpIn  { from{transform:scale(0.45);opacity:0} to{transform:scale(1);opacity:1} }
    @keyframes tpOut { to  {transform:scale(0.6);opacity:0} }
    @keyframes tpDraw{ to  {stroke-dashoffset:0} }
    /* ── Tails ── */
    .tp-tail { position:absolute; width:0; height:0; }
    .tp-tail-left {
      left:-12px;
      border-top:10px solid transparent; border-bottom:10px solid transparent;
      border-right:12px solid rgba(255,255,255,.13);
    }
    .tp-tail-left::after { content:''; position:absolute; top:-8px; left:2px;
      width:0; height:0;
      border-top:8px solid transparent; border-bottom:8px solid transparent;
      border-right:11px solid #161B27; }
    .tp-tail-right {
      right:-12px;
      border-top:10px solid transparent; border-bottom:10px solid transparent;
      border-left:12px solid rgba(255,255,255,.13);
    }
    .tp-tail-right::after { content:''; position:absolute; top:-8px; right:2px;
      width:0; height:0;
      border-top:8px solid transparent; border-bottom:8px solid transparent;
      border-left:11px solid #161B27; }
    .tp-tail-top {
      top:-12px;
      border-left:10px solid transparent; border-right:10px solid transparent;
      border-bottom:12px solid rgba(255,255,255,.13);
    }
    .tp-tail-top::after { content:''; position:absolute; left:-8px; top:2px;
      width:0; height:0;
      border-left:8px solid transparent; border-right:8px solid transparent;
      border-bottom:11px solid #161B27; }
    .tp-tail-bot {
      bottom:-12px;
      border-left:10px solid transparent; border-right:10px solid transparent;
      border-top:12px solid rgba(255,255,255,.13);
    }
    .tp-tail-bot::after { content:''; position:absolute; left:-8px; bottom:2px;
      width:0; height:0;
      border-left:8px solid transparent; border-right:8px solid transparent;
      border-top:11px solid #161B27; }
    /* ── Content ── */
    .tp-inner   { padding:14px 16px; }
    .tp-hd      { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; margin-bottom:10px; }
    .tp-name    { font-size:13.5px; font-weight:700; color:#fff; letter-spacing:-.01em; line-height:1.3; }
    .tp-cat     { font-size:10px; text-transform:uppercase; letter-spacing:.08em; color:#555; font-weight:600; margin-top:2px; }
    .tp-x       { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); border-radius:50%;
                  width:24px; height:24px; color:#888; font-size:15px; cursor:pointer;
                  display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 150ms; }
    .tp-x:hover { background:rgba(255,255,255,.14); color:#fff; }
    .tp-alert   { background:rgba(255,92,92,.1); border:1px solid rgba(255,92,92,.25);
                  border-radius:7px; padding:6px 10px; font-size:11px; font-weight:600;
                  color:#FF5C5C; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
    .tp-stats   { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-bottom:10px; }
    .tp-stat    { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07);
                  border-radius:8px; padding:8px 10px; text-align:center; }
    .tp-sl      { display:block; font-size:9px; text-transform:uppercase; letter-spacing:.07em;
                  color:#555; font-weight:600; margin-bottom:3px; }
    .tp-sv      { font-size:14px; font-weight:700; letter-spacing:-.01em; }
    .tp-chart   { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06);
                  border-radius:8px; overflow:hidden; margin-bottom:10px; }
    .tp-insight { font-size:11px; color:#666; line-height:1.55; margin-bottom:10px; }
    .tp-foot    { display:flex; align-items:center; justify-content:space-between; }
    .tp-time    { font-size:10px; color:#444; }
    .tp-price   { font-size:11.5px; font-weight:600; color:#888; }
  `;
  document.head.appendChild(s);
}

function _removeTrendPopup() {
  const p = document.getElementById('trend-popup');
  if (!p) return;
  p.style.animation = 'tpOut 180ms ease forwards';
  setTimeout(() => p.remove(), 180);
}

function openTrendModal(p, evt) {
  // Toggle: clicking same card again closes it
  if (document.getElementById('trend-popup')) { _removeTrendPopup(); return; }
  ensureTrendPopupStyles();

  const trigger = evt?.currentTarget || evt?.target?.closest('.trend-card');
  const rect = trigger
    ? trigger.getBoundingClientRect()
    : { left:window.innerWidth/2-132, top:window.innerHeight/2-185, width:0, height:0, right:window.innerWidth/2, bottom:window.innerHeight/2 };

  const PW = 264, PH = 380, GAP = 16;
  const vw = window.innerWidth, vh = window.innerHeight;

  // Choose best side relative to card
  let side = 'right';
  if      (vw - rect.right >= PW + GAP) side = 'right';
  else if (rect.left       >= PW + GAP) side = 'left';
  else if (vh - rect.bottom>= PH + GAP) side = 'bottom';
  else                                   side = 'top';

  // Popup base position
  let pl, pt;
  if      (side==='right')  { pl = rect.right  + GAP;       pt = rect.top + rect.height/2 - PH/2; }
  else if (side==='left')   { pl = rect.left   - PW - GAP;  pt = rect.top + rect.height/2 - PH/2; }
  else if (side==='bottom') { pl = rect.left + rect.width/2 - PW/2; pt = rect.bottom + GAP; }
  else                      { pl = rect.left + rect.width/2 - PW/2; pt = rect.top - PH - GAP; }

  // Clamp to viewport with 8px margin
  pl = Math.max(8, Math.min(pl, vw - PW - 8));
  pt = Math.max(8, Math.min(pt, vh - PH - 8));

  // Scale animation origin = the side facing the card
  const txo = side==='right'?'left center':side==='left'?'right center':side==='bottom'?'center top':'center bottom';

  // ── Data ──
  const inv  = typeof inventoryProducts !== 'undefined'
    ? inventoryProducts.find(i => i.name.toLowerCase() === p.name.toLowerCase()) : null;
  const stk  = inv ? inv.stock : null;
  const slvl = inv ? inv.stockLevel : null;
  const isLo = slvl === 'low' || slvl === 'critical';
  const sCol = slvl==='critical'?'#FF5C5C':slvl==='low'?'#F5A623':'#00C9A7';
  const acc  = p.demand==='high'?'#00C9A7':p.demand==='medium'?'#F5A623':'#8B909A';

  // Predicted demand (slope-based)
  const pts = p.points, last = pts[pts.length-1];
  const slp  = (pts[pts.length-1] - pts[Math.max(0,pts.length-4)]) / 3;
  const pr4  = Math.round(last + slp * 4);
  const pct  = last > 0 ? Math.round(((pr4-last)/last)*100) : 0;
  const ptxt = pct > 2 ? `+${pct}%` : pct < -2 ? `${pct}%` : 'Stable';
  const pcol = pct > 2 ? '#00C9A7' : pct < -2 ? '#FF5C5C' : '#8B909A';
  const parrow = pct > 2 ? '\u2197' : pct < -2 ? '\u2198' : '\u2192';

  // Mini chart
  const fillC = p.demand==='high'?'rgba(0,201,167,.15)':p.demand==='medium'?'rgba(245,166,35,.15)':'rgba(139,144,154,.1)';
  const cp = buildTrendChartPath(p.points, 232, 46);
  const fp = cp + ' L 232,46 L 0,46 Z';

  const ustr = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const tailClass = side==='right'?'tp-tail-left':side==='left'?'tp-tail-right':side==='bottom'?'tp-tail-top':'tp-tail-bot';

  const popup = document.createElement('div');
  popup.id = 'trend-popup';
  popup.className = 'trend-popup';
  popup.style.cssText = `left:${pl}px;top:${pt}px;transform-origin:${txo};`;

  popup.innerHTML = `
    <div class="tp-tail ${tailClass}" id="tp-tail-el"></div>
    <div class="tp-inner">
      <div class="tp-hd">
        <div>
          <div class="tp-name">${p.name}</div>
          <div class="tp-cat">${p.cat}</div>
        </div>
        <button class="tp-x" onclick="_removeTrendPopup()">&times;</button>
      </div>
      ${isLo ? `<div class="tp-alert">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
        ${slvl==='critical'?'Critical':'Low Stock'}: ${stk} units left
      </div>` : ''}
      <div class="tp-stats">
        <div class="tp-stat">
          <span class="tp-sl">Stock</span>
          <span class="tp-sv" style="color:${stk!==null?sCol:'#555'}">${stk!==null?stk:'\u2014'}</span>
        </div>
        <div class="tp-stat">
          <span class="tp-sl">Demand</span>
          <span class="tp-sv" style="color:${acc}">${p.demand==='high'?'High':p.demand==='medium'?'Med':'Low'}</span>
        </div>
        <div class="tp-stat">
          <span class="tp-sl">4-Week</span>
          <span class="tp-sv" style="color:${pcol};font-size:12px">${parrow} ${ptxt}</span>
        </div>
      </div>
      <div class="tp-chart">
        <svg viewBox="0 0 232 46" style="width:100%;height:44px;display:block" preserveAspectRatio="none">
          <path d="${fp}" fill="${fillC}"/>
          <path d="${cp}" fill="none" stroke="${acc}" stroke-width="2" stroke-linecap="round"
            style="stroke-dasharray:500;stroke-dashoffset:500;animation:tpDraw .9s ease .1s forwards"/>
        </svg>
      </div>
      <div class="tp-insight">${p.reason.length>90?p.reason.slice(0,90)+'\u2026':p.reason}</div>
      <div class="tp-foot">
        <span class="tp-time">Updated ${ustr}</span>
        <span class="tp-price">${p.price}</span>
      </div>
    </div>`;

  document.body.appendChild(popup);

  // Adjust tail to point exactly at card centre
  const tailEl = document.getElementById('tp-tail-el');
  if (tailEl) {
    if (side==='right' || side==='left') {
      const cy = Math.max(24, Math.min(rect.top + rect.height/2 - pt, PH - 24));
      tailEl.style.top = cy + 'px';
      tailEl.style.transform = 'translateY(-50%)';
    } else {
      const cx = Math.max(24, Math.min(rect.left + rect.width/2 - pl, PW - 24));
      tailEl.style.left = cx + 'px';
      tailEl.style.transform = 'translateX(-50%)';
    }
  }

  // Close on outside click (delayed so this click doesn't immediately close it)
  setTimeout(() => {
    document.addEventListener('click', function _out(e) {
      if (!document.getElementById('trend-popup')?.contains(e.target)) {
        _removeTrendPopup();
        document.removeEventListener('click', _out, true);
      }
    }, { capture: true });
  }, 80);
}

function closeTrendModal() { _removeTrendPopup(); }

function buildTrendChartPath(pts, w, h) {
  if (!pts.length) return '';
  const mx = Math.max(...pts) * 1.1;
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w);
  const ys = pts.map(p => h - ((p / mx) * h * 0.85) - h * 0.05);
  let d = `M ${xs[0]},${ys[0]}`;
  for (let i = 1; i < pts.length; i++) {
    const cpx = (xs[i-1]+xs[i])/2;
    d += ` C ${cpx},${ys[i-1]} ${cpx},${ys[i]} ${xs[i]},${ys[i]}`;
  }
  return d;
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') _removeTrendPopup(); });
