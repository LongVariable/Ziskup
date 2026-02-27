'use strict';

// ═══════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════

const STORAGE_KEY = 'finance_v2';
const DEFAULT_CATS = ['Prace', 'Sporeni', 'Investice', 'Nakupy', 'Jine'];
const MONTH_NAMES  = ['','Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'];

// SVG ikony — klíč → vnitřní obsah <svg> (24×24, stroke=currentColor)
const ICONS = {
  // Peníze & finance
  'wallet':    '<path d="M20 12V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5"/><path d="M20 12h-4a2 2 0 000 4h4V12z"/>',
  'card':      '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/>',
  'bank':      '<path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11"/>',
  'coins':     '<circle cx="10" cy="14" r="6"/><path d="M14.35 8A6 6 0 1119 14.65"/>',
  'transfer':  '<path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4"/>',
  'chart':     '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>',
  'trending':  '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  'piggy':     '<path d="M19 9c0-3.87-3.13-7-7-7S5 5.13 5 9c-1.1 0-2 .9-2 2s.9 2 2 2c0 2.76 1.96 5.08 4.59 5.71L9 21h6l-.59-2.29C16.96 17.08 19 14.76 19 12c1.1 0 2-.9 2-2s-.9-2-2-2z"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/><path d="M19 9h2"/>',
  // Domácnost & doprava
  'home':      '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  'car':       '<path d="M5 17H3a2 2 0 01-2-2V9l3-4h12l3 4v6a2 2 0 01-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  'plane':     '<path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/>',
  'train':     '<rect x="5" y="2" width="14" height="16" rx="3"/><path d="M5 9h14M9 16l-2 4M15 16l2 4M12 2v7"/>',
  'fuel':      '<path d="M3 22V7l7-5 5 3.5V6"/><path d="M3 11h7M3 15h7M3 19h7"/><rect x="14" y="10" width="7" height="8" rx="1"/><path d="M17.5 10V8a2 2 0 10-4 0"/>',
  'cart':      '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.97 1.61h9.72a2 2 0 001.97-1.67L23 6H6"/>',
  'tools':     '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>',
  'key':       '<circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6M15.5 7.5L18 10l3-3"/>',
  // Jídlo & pití
  'utensils':  '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>',
  'coffee':    '<path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>',
  'apple':     '<path d="M12 3c0 0 2-1.5 4-1 0 2-1 3.5-3 4"/><path d="M9 6.5A5.5 5.5 0 003 12c0 4.5 3.5 9 5.5 10 .5.2 1 .4 1.5.4s1-.2 1.5-.4c.5-.2 1-.5 1.5-.5s1 .3 1.5.5c.5.2 1 .4 1.5.4 2 0 5.5-5.5 5.5-10A5.5 5.5 0 0015 6.5c-1.5 0-2.5.5-3 1.5-.5-1-1.5-1.5-3-1.5z"/>',
  'wine':      '<path d="M8 22h8M12 11v11M19 3H5l3 8a4 4 0 008 0l3-8z"/>',
  'leaf':      '<path d="M2 22l11-11"/><path d="M13.5 2C10 6 8 10 10 15c1 2.5 3 4.5 5.5 5.5C20.5 22 22 16 22 12c0-5-3.5-10-8.5-10z"/>',
  'pizza':     '<path d="M12 2a10 10 0 0110 10H12V2z"/><path d="M12 12L3.5 20.5A10 10 0 0112 22a10 10 0 0010-10"/><circle cx="16" cy="8" r="1.5"/><circle cx="9" cy="16" r="1.5"/>',
  'droplet':   '<path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>',
  'fish':      '<path d="M6.5 12c0-5.5 5.5-8 5.5-8s5.5 2.5 5.5 8-5.5 8-5.5 8-5.5-2.5-5.5-8z"/><circle cx="15" cy="11.5" r="1"/><path d="M2 12h4.5"/>',
  // Technologie & práce
  'laptop':    '<rect x="2" y="4" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="18" x2="12" y2="21"/>',
  'phone':     '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
  'box':       '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  'bulb':      '<line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1.38.56 2.38 1.5 3.5A4.61 4.61 0 018.91 14"/>',
  'book':      '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>',
  'grad':      '<path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  'briefcase': '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>',
  'pen':       '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>',
  // Zdraví & volný čas
  'pill':      '<path d="M10.5 20.5L3.5 13.5a5 5 0 017-7l7 7a5 5 0 01-7 7z"/><line x1="8.5" y1="11.5" x2="15.5" y2="18.5"/>',
  'cross':     '<rect x="9" y="2" width="6" height="20" rx="1"/><rect x="2" y="9" width="20" height="6" rx="1"/>',
  'dumbbell':  '<path d="M6.5 6.5h11M6.5 17.5h11M4.5 9h-2v6h2M19.5 9h2v6h-2M6.5 6.5v11M17.5 6.5v11"/>',
  'ball':      '<circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/>',
  'gamepad':   '<rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 12h4M8 10v4"/><circle cx="15" cy="11" r="1"/><circle cx="17" cy="13" r="1"/>',
  'film':      '<rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5"/>',
  'music':     '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  'camera':    '<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>',
  // Různé
  'gift':      '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>',
  'heart':     '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>',
  'person':    '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'baby':      '<circle cx="12" cy="7" r="3.5"/><path d="M4 21v-2a7 7 0 0114 0v2"/>',
  'paw':       '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><circle cx="4" cy="8" r="2"/><path d="M12 9c-3.5 0-7 3-7 7a4.5 4.5 0 009 0 4.5 4.5 0 009 0c0-4-3.5-7-7-7h-4z"/>',
  'tree':      '<path d="M17 14l-5-9-5 9h3l-2 8h8l-2-8h3z"/>',
  'star':      '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  'fire':      '<path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>',
  'target':    '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  'globe':     '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>',
};

// Sestaví SVG element z paths (fill=none, stroke=currentColor)
function makeSvg(paths, size = 15) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

// Příjmy — zelené + modré odstíny (střídají se)
const GREEN_SHADES = ['#1fd87a','#2870ff','#3eea92','#4090ff','#0fa854','#60b0ff','#6ef4b4','#1a50cc','#0a6634','#80c8ff'];
// Výdaje — tmavě červená → červená → oranžová (žádná žlutá ani růžová)
const RED_SHADES   = ['#8b0818','#cc1030','#f03a5a','#e04010','#ff5520','#c82030','#ff7030','#a01020','#ff6040','#d03020'];
// Bilance — žlutá
const BAL_COLOR    = '#f0b020';

// ═══════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════

const state = {
  view:       null,
  year:       null,
  month:      null,
  charts:     {},   // hlavní grafy — klíč → Chart instance
  miniCharts: {},   // mini grafy v sub-blocích — safeId → Chart instance | null
  search:     '',   // vyhledávací řetězec
  incMode:    'cat', // 'cat' | 'item' — režim grafu příjmů
  expMode:    'cat', // 'cat' | 'item' — režim grafu výdajů
};

// ═══════════════════════════════════════════════════
// STORAGE  (s jednoduchým in-memory cache)
// ═══════════════════════════════════════════════════

let _cache = null;

function load() {
  if (_cache) return _cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const d   = raw ? JSON.parse(raw) : {};
    if (!Array.isArray(d.months))     d.months     = [];
    if (!Array.isArray(d.customCats)) d.customCats = [];
    if (!Array.isArray(d.catOrder))   d.catOrder   = [];
    if (!Array.isArray(d.hiddenCats)) d.hiddenCats = [];
    return (_cache = d);
  } catch { return (_cache = { months: [], customCats: [], catOrder: [], hiddenCats: [] }); }
}

function save(data) {
  _cache = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function invalidateCache() { _cache = null; }

function getOrCreate(data, year, month) {
  let m = data.months.find(x => x.year === year && x.month === month);
  if (!m) { m = { year, month, entries: [] }; data.months.push(m); }
  if (!Array.isArray(m.entries)) m.entries = [];
  return m;
}

// ═══════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════

function fmt(n) {
  return new Intl.NumberFormat('cs-CZ', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    .format(Math.abs(n)) + ' Kč';
}
function fmtSigned(n) { return (n > 0 ? '+' : n < 0 ? '-' : '') + fmt(n); }
function escH(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2400);
}

// Bezpečné CSS ID — žádné mezery, diakritika, speciální znaky
function safeId(cat) {
  return 'c_' + Array.from(String(cat)).map(c => /[a-zA-Z0-9]/.test(c) ? c : '_' + c.charCodeAt(0)).join('');
}

// Vrátí viditelné kategorie v uloženém pořadí
function allCats() {
  const d       = load();
  const hidden  = new Set(d.hiddenCats || []);
  const base    = [...DEFAULT_CATS, ...(d.customCats || [])].filter(c => !hidden.has(c));
  const order   = d.catOrder || [];
  // Seřadit dle uloženého pořadí, neznámé přidat na konec
  const ordered = order.filter(c => base.includes(c));
  const rest    = base.filter(c => !ordered.includes(c));
  return [...ordered, ...rest];
}

// Uloží aktuální pořadí podtabulek z DOM
function saveCatOrder() {
  const grid  = document.getElementById('subGrid');
  const order = [...grid.querySelectorAll('.sub-block')].map(el => el.dataset.cat);
  const data  = load();
  data.catOrder = order;
  save(data);
}

// Smaže kategorii úplně (+ všechny záznamy v ní)
function deleteCategory(cat) {
  const data    = load();
  const hasData = data.months.some(m => (m.entries||[]).some(e => e.category === cat));
  const isDef   = DEFAULT_CATS.includes(cat);

  const title = isDef ? `Skrýt kategorii "${cat}"?` : `Smazat kategorii "${cat}"?`;
  let   msg   = isDef
    ? `Výchozí kategorie bude skryta z pohledu.`
    : `Kategorie bude trvale smazána.`;
  if (hasData) msg += ` Všechny záznamy v ní budou odstraněny!`;

  openConfirm(title, msg, () => {
    const d2 = load();
    for (const m of d2.months) {
      m.entries = (m.entries||[]).filter(e => e.category !== cat);
    }
    d2.customCats = (d2.customCats||[]).filter(c => c !== cat);
    d2.catOrder   = (d2.catOrder||[]).filter(c => c !== cat);
    if (isDef) {
      if (!d2.hiddenCats) d2.hiddenCats = [];
      if (!d2.hiddenCats.includes(cat)) d2.hiddenCats.push(cat);
    } else {
      d2.hiddenCats = (d2.hiddenCats||[]).filter(c => c !== cat);
    }
    save(d2);
    const m = getOrCreate(d2, state.year, state.month);
    refreshMonthUI(m.entries);
    renderSubTables(m);
    renderSidebar();
    toast(`Kategorie "${cat}" smazána`);
  });
}

// ═══════════════════════════════════════════════════
// VYHLEDÁVÁNÍ
// ═══════════════════════════════════════════════════

function onSearch(val) {
  state.search = val.toLowerCase().trim();
  document.getElementById('searchClear').style.display = state.search ? 'block' : 'none';
  applySearch();
}

function clearSearch() {
  state.search = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('searchClear').style.display = 'none';
  applySearch();
}

function applySearch() {
  const q    = state.search;
  const grid = document.getElementById('subGrid');
  if (!grid) return;
  for (const block of grid.querySelectorAll('.sub-block')) {
    let blockMatch = false;
    for (const tr of block.querySelectorAll('tbody tr')) {
      const match = !q || tr.textContent.toLowerCase().includes(q);
      tr.classList.toggle('row-hidden', !match);
      if (match) blockMatch = true;
    }
    block.classList.toggle('search-dim', q ? !blockMatch : false);
  }
}

// ═══════════════════════════════════════════════════
// CUSTOM CONFIRM
// ═══════════════════════════════════════════════════

let _confirmCb = null;

function openConfirm(title, msg, onYes) {
  _confirmCb = onYes;
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').textContent   = msg;
  document.getElementById('modalConfirm').classList.add('open');
}

function confirmYes() {
  closeModal('modalConfirm');
  if (_confirmCb) { _confirmCb(); _confirmCb = null; }
}

document.getElementById('modalConfirm').addEventListener('click', e => {
  if (e.target === document.getElementById('modalConfirm')) closeModal('modalConfirm');
});

// ═══════════════════════════════════════════════════
// SIDEBAR  —  skupiny podle roku + mazání měsíce
// ═══════════════════════════════════════════════════

function renderSidebar() {
  const data  = load();
  const el    = document.getElementById('sbMonths');
  // Template (year=0) se nezobrazuje v seznamu měsíců
  const items = [...data.months].filter(m => m.year > 0).sort((a,b) => a.year !== b.year ? b.year-a.year : b.month-a.month);
  // Aktivní stav template tlačítka
  const tmplBtn = document.getElementById('navTemplate');
  if (tmplBtn) tmplBtn.classList.toggle('active', state.year === 0);
  el.innerHTML = '';
  if (!items.length) {
    el.innerHTML = '<div style="padding:8px 18px;color:var(--text3);font-size:0.78rem">Žádné záznamy</div>';
    return;
  }

  // Skupiny podle roku
  const years = [...new Set(items.map(m => m.year))].sort((a,b) => b-a);
  for (const year of years) {
    const yearEl = document.createElement('div');
    yearEl.className = 'sb-year-group';
    yearEl.innerHTML = `<div class="sb-year-label">${year}</div>`;

    for (const m of items.filter(x => x.year === year)) {
      const bal = (m.entries||[]).reduce((s,e) => s + e.amount, 0);
      const div = document.createElement('div');
      div.className = 'month-item' + (m.year === state.year && m.month === state.month ? ' active' : '');
      div.innerHTML = `
        <span class="month-name">${MONTH_NAMES[m.month]}</span>
        <span class="month-bal ${bal >= 0 ? 'pos' : 'neg'}">${fmtSigned(bal)}</span>
        <button class="month-del" title="Smazat měsíc" onclick="event.stopPropagation();deleteMonth(${m.year},${m.month})">×</button>`;
      div.addEventListener('click', () => openMonth(m.year, m.month));
      yearEl.appendChild(div);
    }
    el.appendChild(yearEl);
  }
}

function deleteMonth(year, month) {
  openConfirm(
    `Smazat ${MONTH_NAMES[month]} ${year}?`,
    'Všechny záznamy v tomto měsíci budou trvale smazány. Tato akce je nevratná.',
    () => {
      const data = load();
      data.months = data.months.filter(m => !(m.year === year && m.month === month));
      save(data);
      renderSidebar();
      if (state.year === year && state.month === month) {
        state.year = null; state.month = null; state.view = null;
        document.getElementById('viewMonth').classList.remove('active');
        document.getElementById('viewWelcome').style.display = '';
      }
      toast(`${MONTH_NAMES[month]} ${year} smazán`);
    }
  );
}

// ═══════════════════════════════════════════════════
// VIEW SWITCHING
// ═══════════════════════════════════════════════════

function showView(v) {
  document.getElementById('viewWelcome').style.display = 'none';
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.sb-btn').forEach(el => el.classList.remove('active'));
  // Sync mobile nav
  const mD = document.getElementById('mobNavDash');
  const mM = document.getElementById('mobNavMonth');
  if (mD) mD.classList.toggle('active', v === 'dashboard');
  if (mM) mM.classList.toggle('active', v === 'month');
  if (v === 'dashboard') {
    document.getElementById('viewDashboard').classList.add('active');
    document.getElementById('navDash').classList.add('active');
    initDashFilter();
    renderDashboard();
  } else {
    document.getElementById('viewMonth').classList.add('active');
    // Template má žlutý dot — zvýraznit jiné tlačítko než navMonth
    if (state.year === 0) {
      const t = document.getElementById('navTemplate'); if (t) t.classList.add('active');
    } else {
      document.getElementById('navMonth').classList.add('active');
    }
    if (state.year != null) renderMonthView();
  }
  state.view = v;
}

function openMonth(year, month) {
  state.year = year; state.month = month;
  showView('month');
  renderSidebar();
}

// ═══════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════

function buildYearOpts(sel, selY) {
  const data  = load();
  const years = [...new Set(data.months.filter(m => m.year > 0).map(m => m.year))].sort((a,b) => a-b);
  if (!years.length) years.push(new Date().getFullYear());
  sel.innerHTML = '';
  years.forEach(y => sel.appendChild(new Option(y, y, y === selY, y === selY)));
}

function initDashFilter() {
  const now = new Date();
  buildYearOpts(document.getElementById('dashFromY'), now.getFullYear());
  buildYearOpts(document.getElementById('dashToY'),   now.getFullYear());
  document.getElementById('dashFromM').value = 1;
  document.getElementById('dashToM').value   = now.getMonth() + 1;
}

function dashCurrentYear() {
  const y = new Date().getFullYear();
  buildYearOpts(document.getElementById('dashFromY'), y);
  buildYearOpts(document.getElementById('dashToY'),   y);
  document.getElementById('dashFromM').value = 1;
  document.getElementById('dashToM').value   = 12;
  renderDashboard();
}

function dashAllTime() {
  const data = load();
  if (!data.months.length) return;
  const s = [...data.months].sort((a,b) => a.year!==b.year ? a.year-b.year : a.month-b.month);
  buildYearOpts(document.getElementById('dashFromY'), s[0].year);
  buildYearOpts(document.getElementById('dashToY'),   s[s.length-1].year);
  document.getElementById('dashFromM').value = s[0].month;
  document.getElementById('dashToM').value   = s[s.length-1].month;
  renderDashboard();
}

function getFiltered() {
  const fy = +document.getElementById('dashFromY').value;
  const fm = +document.getElementById('dashFromM').value;
  const ty = +document.getElementById('dashToY').value;
  const tm = +document.getElementById('dashToM').value;
  const data   = load();
  const months = data.months.filter(m =>
    (m.year > fy || (m.year === fy && m.month >= fm)) &&
    (m.year < ty || (m.year === ty && m.month <= tm))
  );
  return { months, entries: months.flatMap(m => m.entries || []) };
}

function dChart(key) {
  if (state.charts[key]) { state.charts[key].destroy(); delete state.charts[key]; }
}

function renderDashboard() {
  const { months, entries } = getFiltered();
  const income  = entries.filter(e=>e.amount>0).reduce((s,e)=>s+e.amount, 0);
  const expense = entries.filter(e=>e.amount<0).reduce((s,e)=>s+Math.abs(e.amount), 0);
  const balance = income - expense;
  const mc      = months.length;

  document.getElementById('dIncome').textContent    = fmt(income);
  document.getElementById('dExpense').textContent   = fmt(expense);
  document.getElementById('dBalance').textContent   = fmt(balance);
  document.getElementById('dBalance').className     = 'card-value yellow';
  document.getElementById('dIncomeSub').textContent  = mc ? `průměr ${fmt(income/mc)} / měsíc` : '';
  document.getElementById('dExpenseSub').textContent = mc ? `průměr ${fmt(expense/mc)} / měsíc` : '';
  document.getElementById('dBalanceSub').textContent = mc ? `průměr ${fmt(balance/mc)} / měsíc` : '';

  // Počet měsíců vedle filtru
  const pcEl = document.getElementById('dPeriodCount');
  if (pcEl) pcEl.textContent = mc ? `${mc}\u00a0${mc === 1 ? 'měsíc' : mc < 5 ? 'měsíce' : 'měsíců'}` : '';

  // Nejvyšší příjem / největší výdaj (absolutní hodnota)
  const incE = entries.filter(e=>e.amount>0);
  const expE = entries.filter(e=>e.amount<0);
  const topInc = incE.length ? incE.reduce((a,b) => b.amount > a.amount ? b : a) : null;
  const topExp = expE.length ? expE.reduce((a,b) => b.amount < a.amount ? b : a) : null;
  document.getElementById('dTopInc').textContent     = topInc ? fmt(topInc.amount) : '—';
  document.getElementById('dTopIncName').textContent = topInc ? (topInc.name || '—') : '';
  document.getElementById('dTopExp').textContent     = topExp ? fmt(Math.abs(topExp.amount)) : '—';
  document.getElementById('dTopExpName').textContent = topExp ? (topExp.name || '—') : '';

  dChart('dInc'); dChart('dExp'); dChart('dBal');

  state.charts.dInc = (state.incMode === 'item' ? makeItemChart : makeCatChart)('chartIncomeCat',  entries, true);
  state.charts.dExp = (state.expMode === 'item' ? makeItemChart : makeCatChart)('chartExpenseCat', entries, false);

  // Bilance po měsících — čárový graf
  const sm = [...months].sort((a,b) => a.year!==b.year ? a.year-b.year : a.month-b.month);
  state.charts.dBal = makeLineChart(
    'chartBalLine',
    sm.map(m => `${MONTH_NAMES[m.month].slice(0,3)} ${m.year}`),
    sm.map(m => { const es = m.entries || []; return es.reduce((s,e) => s + e.amount, 0); })
  );

  renderCatBreakdown(entries);

  renderROTable('dTableInc', entries.filter(e=>e.amount>0), true);
  renderROTable('dTableExp', entries.filter(e=>e.amount<0), false);
  document.getElementById('dTableIncSum').textContent = fmt(income);
  document.getElementById('dTableExpSum').textContent = fmt(expense);
}

function setChartMode(which, mode) {
  if (which === 'inc') state.incMode = mode;
  else                 state.expMode = mode;

  // Aktualizuj aktivní tlačítko v toggle
  const toggle = document.getElementById(which === 'inc' ? 'incToggle' : 'expToggle');
  if (toggle) {
    toggle.querySelectorAll('.ctbtn').forEach((btn, i) => {
      btn.classList.toggle('active', (i === 0 && mode === 'cat') || (i === 1 && mode === 'item'));
    });
  }

  // Přerenduj jen daný graf
  const canvasId = which === 'inc' ? 'chartIncomeCat' : 'chartExpenseCat';
  const chartKey = which === 'inc' ? 'dInc' : 'dExp';
  dChart(chartKey);
  const { entries } = getFiltered();
  state.charts[chartKey] = (mode === 'item' ? makeItemChart : makeCatChart)(canvasId, entries, which === 'inc');
}

function renderDashCatStats(entries) {
  const container = document.getElementById('dashCatStats');
  if (!container) return;
  container.innerHTML = '';
  let idx = 0;
  for (const cat of allCats()) {
    const catE = entries.filter(e => e.category === cat);
    if (!catE.length) continue;
    const inc = catE.filter(e=>e.amount>0).reduce((s,e)=>s+e.amount,0);
    const exp = catE.filter(e=>e.amount<0).reduce((s,e)=>s+Math.abs(e.amount),0);
    const bal = inc - exp;
    const card = document.createElement('div');
    card.className = 'cat-stat-card';
    card.style.animationDelay = `${idx * 30}ms`;
    card.innerHTML = `
      <div class="cat-stat-name">${escH(cat)}</div>
      ${inc > 0 ? `<div class="cat-stat-row"><span>Příjmy</span><span class="csg">${fmt(inc)}</span></div>` : ''}
      ${exp > 0 ? `<div class="cat-stat-row"><span>Výdaje</span><span class="csr">${fmt(exp)}</span></div>` : ''}
      <div class="cat-stat-bal ${bal >= 0 ? 'csg' : 'csr'}">${fmtSigned(bal)}</div>`;
    container.appendChild(card);
    idx++;
  }
}

function renderCatBreakdown(entries) {
  const container = document.getElementById('catBreakdown');
  container.innerHTML = '';
  const cats = allCats();
  const expByCat = {};
  for (const e of entries.filter(e=>e.amount<0)) {
    expByCat[e.category] = (expByCat[e.category]||0) + Math.abs(e.amount);
  }
  const sorted = cats
    .filter(c => expByCat[c] > 0)
    .sort((a,b) => expByCat[b] - expByCat[a]);

  if (!sorted.length) {
    container.innerHTML = '<div style="color:var(--text3);font-size:0.8rem;padding:10px 0">Žádné výdaje</div>';
    return;
  }
  const max = expByCat[sorted[0]];
  sorted.forEach((cat, i) => {
    const val  = expByCat[cat];
    const pct  = Math.round((val / max) * 100);
    const col  = RED_SHADES[i % RED_SHADES.length];
    const row  = document.createElement('div');
    row.className = 'cat-row';
    row.innerHTML = `
      <span class="cat-row-name" title="${escH(cat)}">${escH(cat)}</span>
      <div class="cat-row-bar"><div class="cat-row-fill" style="width:${pct}%;background:${col}"></div></div>
      <span class="cat-row-val">${fmt(val)}</span>`;
    container.appendChild(row);
  });
}

// ═══════════════════════════════════════════════════
// MONTH VIEW
// ═══════════════════════════════════════════════════

function renderMonthView() {
  const data    = load();
  const m       = getOrCreate(data, state.year, state.month);
  document.getElementById('mTitle').textContent =
    state.year === 0 ? 'Vzor měsíce' : `${MONTH_NAMES[state.month]} ${state.year}`;
  refreshMonthUI(m.entries);
  renderSubTables(m);
}

function refreshMonthUI(entries) {
  const income  = entries.filter(e=>e.amount>0).reduce((s,e)=>s+e.amount, 0);
  const expense = entries.filter(e=>e.amount<0).reduce((s,e)=>s+Math.abs(e.amount), 0);
  const balance = income - expense;
  document.getElementById('mIncome').textContent  = fmt(income);
  document.getElementById('mExpense').textContent = fmt(expense);
  document.getElementById('mBalance').textContent = fmt(balance);
  document.getElementById('mBalance').className   = 'card-value yellow';
}

// ═══════════════════════════════════════════════════
// SUB TABLES  —  BUG FIX: destroy jen existující instance
// ═══════════════════════════════════════════════════

function renderSubTables(monthData) {
  for (const [key, ch] of Object.entries(state.miniCharts)) {
    if (ch && typeof ch.destroy === 'function') ch.destroy();
  }
  state.miniCharts = {};

  const grid = document.getElementById('subGrid');
  grid.innerHTML = '';
  const cats = allCats().slice().sort((a, b) => {
    const ac = (monthData.entries || []).filter(e => e.category === a).length;
    const bc = (monthData.entries || []).filter(e => e.category === b).length;
    return bc - ac;
  });
  cats.forEach((cat, i) => {
    const block = buildSubBlock(monthData, cat);
    block.style.animationDelay = `${i * 38}ms`;
    grid.appendChild(block);
  });
}

function buildSubBlock(monthData, cat) {
  const sid      = safeId(cat);
  const entries  = (monthData.entries || []).filter(e => e.category === cat);
  const total    = entries.reduce((s,e) => s + e.amount, 0);
  const sumColor = total > 0 ? 'var(--g3)' : total < 0 ? 'var(--r4)' : 'var(--text2)';

  const block = document.createElement('div');
  block.className    = 'sub-block';
  block.dataset.cat  = cat;

  block.innerHTML = `
    <div class="sub-block-head">
      <span class="sub-block-title">${escH(cat)}</span>
      <span class="sub-block-sum" id="catSum-${sid}" style="color:${sumColor}">${fmtSigned(total)}</span>
      <button class="sub-del-btn" title="Smazat kategorii" onclick="deleteCategory('${escH(cat)}')">×</button>
    </div>
    <table class="ft">
      <thead>
        <tr>
          <th style="width:30px"></th>
          <th style="width:35%">Název</th>
          <th>Poznámka</th>
          <th class="tr" style="width:110px">Částka</th>
          <th style="width:28px"></th>
        </tr>
      </thead>
      <tbody id="catBody-${sid}"></tbody>
      <tfoot><tr><td colspan="4" class="add-row-cell">
        <button class="add-row-btn">+ Přidat řádek</button>
      </td></tr></tfoot>
    </table>`;

  const tbody = block.querySelector(`#catBody-${sid}`);
  for (const e of entries) tbody.appendChild(buildRow(e, cat, sid));
  block.querySelector('.add-row-btn').addEventListener('click', () => addRow(cat, sid));

  return block;
}

// ── DRAG & DROP  (pointer events — smooth ghost clone) ─────────────────────
function initDragDrop(grid) {
  let ds = null; // drag state

  grid.addEventListener('pointerdown', e => {
    if (!e.target.closest('.drag-handle')) return;
    const block = e.target.closest('.sub-block');
    if (!block) return;
    e.preventDefault();

    const rect = block.getBoundingClientRect();

    // Ghost klon sleduje kurzor
    const clone = block.cloneNode(true);
    Object.assign(clone.style, {
      position:     'fixed',
      left:         rect.left + 'px',
      top:          rect.top  + 'px',
      width:        rect.width + 'px',
      zIndex:       '1000',
      pointerEvents:'none',
      opacity:      '0.9',
      transform:    'scale(1.02) rotate(-0.4deg)',
      boxShadow:    '0 24px 64px rgba(0,0,0,0.55)',
      borderRadius: 'var(--r)',
      transition:   'transform 0.12s, box-shadow 0.12s',
    });
    document.body.appendChild(clone);

    // Placeholder v gridu — block zcela nahrazen placeholderem
    const ph = document.createElement('div');
    ph.className = 'sub-placeholder';
    ph.style.height = rect.height + 'px';
    block.replaceWith(ph);

    ds = { block, clone, ph, ox: e.clientX - rect.left, oy: e.clientY - rect.top };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup',   onUp,   { once: true });
    document.addEventListener('pointercancel', onUp, { once: true });
  });

  function onMove(e) {
    if (!ds) return;
    ds.clone.style.left = (e.clientX - ds.ox) + 'px';
    ds.clone.style.top  = (e.clientY - ds.oy) + 'px';
    movePlaceholder(e.clientX, e.clientY);
  }

  function movePlaceholder(cx, cy) {
    const blocks = [...grid.querySelectorAll('.sub-block')];
    if (!blocks.length) { grid.appendChild(ds.ph); return; }

    // Najdi nejbližší blok ke kurzoru (2D vzdálenost od středu)
    let best = null, bestDist = Infinity;
    for (const b of blocks) {
      const r = b.getBoundingClientRect();
      const dx = cx - (r.left + r.width  / 2);
      const dy = cy - (r.top  + r.height / 2);
      const d  = dx * dx + dy * dy;
      if (d < bestDist) { bestDist = d; best = b; }
    }

    const r    = best.getBoundingClientRect();
    const midY = r.top  + r.height / 2;
    const midX = r.left + r.width  / 2;
    // Vložit před: pokud je kurzor nad středem řádku, nebo na stejném řádku vlevo
    if (cy < midY - 8 || (Math.abs(cy - midY) <= 8 && cx < midX)) {
      grid.insertBefore(ds.ph, best);
    } else {
      best.after(ds.ph);
    }
  }

  function onUp() {
    if (!ds) return;
    document.removeEventListener('pointermove', onMove);

    // Animace klonu zpět na placeholder
    const pr = ds.ph.getBoundingClientRect();
    Object.assign(ds.clone.style, {
      transition: 'left 0.18s ease, top 0.18s ease, opacity 0.18s, transform 0.18s',
      left:       pr.left + 'px',
      top:        pr.top  + 'px',
      opacity:    '0',
      transform:  'scale(1)',
    });

    const { block, clone, ph } = ds;
    ds = null;

    setTimeout(() => {
      ph.replaceWith(block);
      clone.remove();
      saveCatOrder();
    }, 180);
  }
}

function buildRow(entry, cat, sid) {
  const tr = document.createElement('tr');
  tr.dataset.id = entry.id;
  const ac = entry.amount >= 0 ? 'c-green' : 'c-red';
  tr.innerHTML = `
    <td class="icon-cell"><button class="icon-btn${entry.icon ? ' has-icon' : ''}" title="Vybrat ikonu">${entry.icon && ICONS[entry.icon] ? makeSvg(ICONS[entry.icon]) : '<span class="icon-ph">+</span>'}</button></td>
    <td><input class="ce"              value="${escH(entry.name)}"       placeholder="Název..."></td>
    <td><input class="ce"              value="${escH(entry.note || '')}"  placeholder="Poznámka..."></td>
    <td><input class="ce mono tr ${ac}" value="${entry.amount !== 0 ? entry.amount : ''}" placeholder="0"></td>
    <td><button class="del-btn" title="Smazat">x</button></td>`;

  const [nameIn, noteIn, amountIn] = tr.querySelectorAll('input');
  let t;
  const persist = () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const val = parseFloat(String(amountIn.value).replace(',','.')) || 0;
      amountIn.className = `ce mono tr ${val >= 0 ? 'c-green' : 'c-red'}`;
      const data = load();
      const m    = getOrCreate(data, state.year, state.month);
      const e    = m.entries.find(x => x.id === entry.id);
      if (!e) return;
      e.name = nameIn.value; e.note = noteIn.value; e.amount = val;
      save(data);
      refreshAfterEdit(m.entries, cat, sid);
    }, 500);
  };
  nameIn.addEventListener('input', persist);
  noteIn.addEventListener('input', persist);
  amountIn.addEventListener('input', persist);

  tr.querySelector('.del-btn').addEventListener('click', () => {
    const data = load();
    const m    = getOrCreate(data, state.year, state.month);
    m.entries  = m.entries.filter(x => x.id !== entry.id);
    save(data);
    tr.remove();
    refreshAfterEdit(m.entries, cat, sid);
  });

  tr.querySelector('.icon-btn').addEventListener('click', function() {
    openIconPicker(entry.id, cat, sid, this);
  });

  return tr;
}

function addRow(cat, sid) {
  const data  = load();
  const m     = getOrCreate(data, state.year, state.month);
  const entry = { id: uid(), name: '', note: '', amount: 0, category: cat, icon: '' };
  m.entries.push(entry);
  save(data);
  const tbody = document.getElementById(`catBody-${sid}`);
  if (tbody) { const row = buildRow(entry, cat, sid); tbody.appendChild(row); row.querySelector('input').focus(); }
  refreshAfterEdit(m.entries, cat, sid);
  renderSidebar();
}

function refreshAfterEdit(entries, cat, sid) {
  refreshMonthUI(entries);

  const catEntries = entries.filter(e => e.category === cat);
  const total      = catEntries.reduce((s,e) => s + e.amount, 0);
  const sumEl      = document.getElementById(`catSum-${sid}`);
  if (sumEl) {
    sumEl.textContent = fmtSigned(total);
    sumEl.style.color = total > 0 ? 'var(--g3)' : total < 0 ? 'var(--r4)' : 'var(--text2)';
  }
  renderSidebar();
}

// ═══════════════════════════════════════════════════
// READ-ONLY TABLES
// ═══════════════════════════════════════════════════

function renderROTable(tbodyId, entries, isIncome) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!entries.length) {
    tbody.innerHTML = `<tr><td colspan="3" class="ro" style="font-style:italic;color:var(--text3)">Žádné záznamy</td></tr>`;
    return;
  }
  const col = isIncome ? 'var(--g3)' : 'var(--r4)';
  for (const e of entries) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="ro">${e.icon && ICONS[e.icon] ? `<span class="row-icon">${makeSvg(ICONS[e.icon], 13)}</span>` : ''}${escH(e.name)||'—'}</td>
      <td class="ro"><span class="cat-tag">${escH(e.category)}</span></td>
      <td class="ro mono tr" style="color:${col}">${fmt(Math.abs(e.amount))}</td>`;
    tbody.appendChild(tr);
  }
}

// ═══════════════════════════════════════════════════
// CHARTS
// ═══════════════════════════════════════════════════

const TT_BASE = {
  backgroundColor: '#18181f', borderColor: '#2a2a36', borderWidth: 1,
  titleColor: '#eeeef4', bodyColor: '#8888a0',
  titleFont: { family: 'Syne', weight: '600', size: 12 },
  bodyFont:  { family: 'DM Mono', size: 11 }, padding: 10,
};
const LEGEND_CFG = { labels: { color: '#8888a0', font: { family: 'Syne', size: 11 }, boxWidth: 10, padding: 10 } };

/**
 * Hlavní koláčový graf — příjmy/výdaje podle kategorií.
 * Příjmy → zelené odstíny, Výdaje → červené odstíny.
 */
function makeCatChart(canvasId, allEntries, isIncome) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  const palette  = isIncome ? GREEN_SHADES : RED_SHADES;
  const filtered = allEntries.filter(e => isIncome ? e.amount > 0 : e.amount < 0);
  const cats     = allCats();
  const byCat    = {};
  for (const e of filtered) byCat[e.category] = (byCat[e.category]||0) + Math.abs(e.amount);

  const labels = []; const values = []; const colors = [];
  cats.forEach((cat, i) => {
    if ((byCat[cat]||0) > 0) { labels.push(cat); values.push(byCat[cat]); colors.push(palette[i % palette.length]); }
  });
  // Případné neznámé kategorie (import ze starého formátu)
  for (const [cat, val] of Object.entries(byCat)) {
    if (!cats.includes(cat) && val > 0) { labels.push(cat); values.push(val); colors.push(palette[labels.length % palette.length]); }
  }

  if (!labels.length) { drawEmpty(ctx); return null; }

  return new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data: values, backgroundColor: colors, borderColor: '#0a0a0d', borderWidth: 2, hoverOffset: 6 }] },
    options: {
      cutout: '60%', responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: LEGEND_CFG,
        tooltip: { ...TT_BASE, callbacks: { label: c => ` ${c.label}: ${new Intl.NumberFormat('cs-CZ').format(c.raw)} Kč` } }
      }
    }
  });
}

function makeItemChart(canvasId, allEntries, isIncome) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  const palette  = isIncome ? GREEN_SHADES : RED_SHADES;
  const filtered = allEntries.filter(e => isIncome ? e.amount > 0 : e.amount < 0);
  const byName   = {};
  for (const e of filtered) {
    const name = (e.name || '').trim() || '—';
    byName[name] = (byName[name]||0) + Math.abs(e.amount);
  }
  const sorted = Object.entries(byName).sort((a,b) => b[1] - a[1]);
  const TOP = 10;
  const labels = []; const values = []; const colors = [];
  sorted.slice(0, TOP).forEach(([name, val], i) => {
    labels.push(name); values.push(val); colors.push(palette[i % palette.length]);
  });
  if (sorted.length > TOP) {
    const rest = sorted.slice(TOP).reduce((s,[,v]) => s + v, 0);
    labels.push('Ostatní'); values.push(rest); colors.push(palette[TOP % palette.length]);
  }
  if (!labels.length) { drawEmpty(ctx); return null; }
  return new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data: values, backgroundColor: colors, borderColor: '#0a0a0d', borderWidth: 2, hoverOffset: 6 }] },
    options: {
      cutout: '60%', responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: LEGEND_CFG,
        tooltip: { ...TT_BASE, callbacks: { label: c => ` ${c.label}: ${new Intl.NumberFormat('cs-CZ').format(c.raw)} Kč` } }
      }
    }
  });
}

/**
 * Čárový graf bilance po měsících.
 */
function makeLineChart(canvasId, labels, data) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Bilance',
        data,
        borderColor: BAL_COLOR,
        backgroundColor: 'rgba(240,176,32,0.08)',
        borderWidth: 2,
        pointBackgroundColor: data.map(v => v >= 0 ? BAL_COLOR : '#f03a5a'),
        pointBorderColor:     data.map(v => v >= 0 ? BAL_COLOR : '#f03a5a'),
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.3,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { grid: { color: '#2a2a36' }, ticks: { color: '#8888a0', font: { family: 'Syne', size: 11 } } },
        y: { grid: { color: '#2a2a36' }, ticks: { color: '#8888a0', font: { family: 'Syne', size: 11 },
          callback: v => new Intl.NumberFormat('cs-CZ').format(v) + ' Kč' },
          afterDataLimits: axis => { const pad = Math.abs(axis.max - axis.min) * 0.1 || 1000; axis.max += pad; axis.min -= pad; }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: { ...TT_BASE, callbacks: {
          label: c => ` Bilance: ${new Intl.NumberFormat('cs-CZ').format(c.raw)} Kč`
        }}
      }
    }
  });
}

/**
 * Mini doughnut v hlavičce podtabulky.
 * Každá POLOŽKA = vlastní segment.
 * Seřazeno: kladné od nejvyšší → záporné od nejvyšší (absolutní hodnota).
 * Kladné → zeleno-modrá paleta, záporné → červeno-oranžová paleta.
 */
function makeMiniDoughnut(canvasId, entries) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  const nonZero = entries.filter(e => e.amount !== 0);
  if (!nonZero.length) return null;

  // Seřadit: nejdřív kladné (od nejvyšší), pak záporné (od nejvyšší abs)
  const positives = nonZero.filter(e => e.amount > 0).sort((a,b) => b.amount - a.amount);
  const negatives = nonZero.filter(e => e.amount < 0).sort((a,b) => a.amount - b.amount); // záporné — nejnižší číslo = největší abs
  const sorted    = [...positives, ...negatives];

  const labels = [];
  const values = [];
  const colors = [];
  let gi = 0, ri = 0;

  for (const e of sorted) {
    const name = (e.name && e.name.trim()) ? e.name.trim() : '(bez nazvu)';
    labels.push(name);
    values.push(Math.abs(e.amount));
    if (e.amount > 0) {
      colors.push(GREEN_SHADES[gi % GREEN_SHADES.length]); gi++;
    } else {
      colors.push(RED_SHADES[ri % RED_SHADES.length]); ri++;
    }
  }

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data:            values,
        backgroundColor: colors,
        borderColor:     '#18181f',
        borderWidth:     1.5,
        hoverOffset:     4,
      }]
    },
    options: {
      cutout: '52%', responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#18181f', borderColor: '#2a2a36', borderWidth: 1,
          titleColor: '#eeeef4', bodyColor: '#8888a0',
          titleFont: { family: 'Syne', size: 10 },
          bodyFont:  { family: 'DM Mono', size: 10 },
          padding: 8,
          callbacks: {
            title: items => labels[items[0].dataIndex],
            label: c => ` ${new Intl.NumberFormat('cs-CZ').format(c.raw)} Kč`
          }
        }
      }
    }
  });
}

function drawEmpty(ctx) {
  const c = ctx.getContext('2d');
  c.clearRect(0, 0, ctx.width, ctx.height);
  c.fillStyle = '#55556a'; c.font = '12px Syne';
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('Žádné záznamy', ctx.width/2, ctx.height/2);
}

// ═══════════════════════════════════════════════════
// ICON PICKER
// ═══════════════════════════════════════════════════

let _iconPickerClose = null;
let _iconPickerLastClose = 0;

function openIconPicker(entryId, cat, sid, btnEl) {
  if (Date.now() - _iconPickerLastClose < 120) return;
  closeIconPicker();

  const popup = document.createElement('div');
  popup.id = 'iconPickerPopup';
  popup.className = 'icon-picker-popup';

  const clearBtn = document.createElement('button');
  clearBtn.className = 'icon-clear-btn';
  clearBtn.textContent = 'Odebrat ikonu';
  clearBtn.addEventListener('click', e => { e.stopPropagation(); pickIcon('', entryId, cat, sid, btnEl); });
  popup.appendChild(clearBtn);

  const grid = document.createElement('div');
  grid.className = 'icon-grid';
  for (const [key, paths] of Object.entries(ICONS)) {
    const btn = document.createElement('button');
    btn.className = 'icon-item';
    btn.title = key;
    btn.innerHTML = makeSvg(paths, 20);
    btn.addEventListener('click', e => { e.stopPropagation(); pickIcon(key, entryId, cat, sid, btnEl); });
    grid.appendChild(btn);
  }
  popup.appendChild(grid);
  document.body.appendChild(popup);

  // Position near trigger button
  const bRect = btnEl.getBoundingClientRect();
  const pw = 264, ph = 280;
  const left = Math.min(bRect.left, window.innerWidth - pw - 8);
  const top  = (bRect.bottom + 4 + ph > window.innerHeight) ? bRect.top - ph - 4 : bRect.bottom + 4;
  popup.style.left = Math.max(8, left) + 'px';
  popup.style.top  = Math.max(8, top)  + 'px';

  _iconPickerClose = e => {
    const p = document.getElementById('iconPickerPopup');
    if (p && !p.contains(e.target)) {
      document.removeEventListener('pointerdown', _iconPickerClose);
      _iconPickerClose = null;
      closeIconPicker();
    }
  };
  setTimeout(() => document.addEventListener('pointerdown', _iconPickerClose), 10);
}

function closeIconPicker() {
  if (_iconPickerClose) {
    document.removeEventListener('pointerdown', _iconPickerClose);
    _iconPickerClose = null;
  }
  document.getElementById('iconPickerPopup')?.remove();
  _iconPickerLastClose = Date.now();
}

function pickIcon(key, entryId, cat, sid, btnEl) {
  const data = load();
  const m    = getOrCreate(data, state.year, state.month);
  const e    = m.entries.find(x => x.id === entryId);
  if (e) { e.icon = key; save(data); }
  if (btnEl) {
    btnEl.innerHTML = key && ICONS[key] ? makeSvg(ICONS[key]) : '<span class="icon-ph">+</span>';
    btnEl.classList.toggle('has-icon', !!key);
  }
  closeIconPicker();
}

// ═══════════════════════════════════════════════════
// MODAL — NOVÝ MĚSÍC
// ═══════════════════════════════════════════════════

function openNewMonth() {
  const now = new Date();
  document.getElementById('mYear').value  = now.getFullYear();
  document.getElementById('mMonth').value = now.getMonth() + 1;
  document.getElementById('modalMonth').classList.add('open');
}
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function confirmNewMonth() {
  const year  = +document.getElementById('mYear').value;
  const month = +document.getElementById('mMonth').value;
  closeModal('modalMonth');
  const data = load();
  const newM = getOrCreate(data, year, month);
  // Předvyplnit z vzoru (year=0, month=0), pokud nový měsíc ještě nemá záznamy
  if (!newM.entries.length) {
    const tmpl = data.months.find(m => m.year === 0 && m.month === 0);
    if (tmpl && tmpl.entries.length) {
      newM.entries = tmpl.entries.map(e => ({ id: uid(), name: e.name, note: e.note || '', amount: e.amount, category: e.category, icon: e.icon || '' }));
    }
  }
  save(data);
  openMonth(year, month); renderSidebar();
  toast(`${MONTH_NAMES[month]} ${year} vytvořen`);
}

function openTemplate() {
  state.year = 0; state.month = 0;
  showView('month');
  renderSidebar();
}
document.getElementById('modalMonth').addEventListener('click', e => {
  if (e.target === document.getElementById('modalMonth')) closeModal('modalMonth');
});

// ═══════════════════════════════════════════════════
// VLASTNÍ KATEGORIE
// ═══════════════════════════════════════════════════

function addCustomCategory() {
  const name = prompt('Název nové kategorie:');
  if (!name || !name.trim()) return;
  const key = name.trim();
  if (allCats().includes(key)) { alert('Tato kategorie již existuje.'); return; }
  const data = load(); data.customCats.push(key); save(data);
  const m = getOrCreate(data, state.year, state.month);
  renderSubTables(m);
  toast(`Kategorie "${key}" přidána`);
}

// ═══════════════════════════════════════════════════
// EXPORT / IMPORT
// ═══════════════════════════════════════════════════

function exportData() {
  const data = load();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `finance-${new Date().toISOString().slice(0,10)}.json`; a.click();
  URL.revokeObjectURL(a.href); toast('Export dokončen');
}

function importData(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      let raw = JSON.parse(ev.target.result);
      // Zpetna kompatibilita
      if (Array.isArray(raw)) raw = { months: raw, customCats: [] };
      if (!Array.isArray(raw.months))     raw.months     = [];
      if (!Array.isArray(raw.customCats)) raw.customCats = [];
      // Oprav chybejici ID a chybejici kategorie
      for (const m of raw.months) {
        if (!Array.isArray(m.entries)) m.entries = [];
        for (const entry of m.entries) {
          if (!entry.id) entry.id = uid();
          // Pokud polozka nema kategorii, dej ji "Jine"
          if (!entry.category) entry.category = 'Jine';
        }
      }
      save(raw);
      invalidateCache();
      renderSidebar();
      toast('Import dokončen');
      // Po importu znovu vykreslit aktualni view se spravnymi daty
      if (state.view === 'month' && state.year) {
        const data = load();
        const m    = getOrCreate(data, state.year, state.month);
        refreshMonthUI(m.entries);
        renderSubTables(m);      // <-- toto zajisti spravne nacteni dat z importu
      }
      if (state.view === 'dashboard') renderDashboard();
    } catch { alert('Neplatny nebo poskozeny JSON soubor.'); }
  };
  reader.readAsText(file); e.target.value = '';
}

// ═══════════════════════════════════════════════════
// MOBILE NAV
// ═══════════════════════════════════════════════════

function toggleSidebar() {
  const sb  = document.getElementById('sidebar');
  const ov  = document.getElementById('sidebarOverlay');
  const open = sb.classList.toggle('mob-open');
  ov.classList.toggle('open', open);
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('mob-open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

function mobNav(v) {
  document.getElementById('mobNavDash').classList.toggle('active',  v === 'dashboard');
  document.getElementById('mobNavMonth').classList.toggle('active', v === 'month');
  document.getElementById('mobNavMenu').classList.remove('active');
  showView(v);
  closeSidebar();
}

// Close sidebar on month select (mobile)
document.getElementById('sbMonths').addEventListener('click', () => {
  if (window.innerWidth <= 768) closeSidebar();
});



(function init() {
  const fromM = document.getElementById('dashFromM');
  const toM   = document.getElementById('dashToM');
  for (let i = 1; i <= 12; i++) {
    fromM.appendChild(new Option(MONTH_NAMES[i], i));
    toM.appendChild(new Option(MONTH_NAMES[i], i));
  }
  renderSidebar();
  const data = load();
  if (data.months.length) {
    const latest = [...data.months].sort((a,b) => a.year!==b.year ? b.year-a.year : b.month-a.month)[0];
    openMonth(latest.year, latest.month);
  }
})();
