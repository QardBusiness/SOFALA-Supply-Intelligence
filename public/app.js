// ── SOFALA Supply Intelligence — Frontend App ─────────────────────────────

const $ = id => document.getElementById(id);
const fmt = n => new Intl.NumberFormat('en-US').format(Math.round(n));
const fmtUSD = n => '$' + new Intl.NumberFormat('en-US', { notation: n >= 1e6 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(n);
const fmtDate = d => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

let currentPage = 'dashboard';

// ── Routing ───────────────────────────────────────────────────────────────
function navigate(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page);
  });
  const titles = { dashboard: 'Dashboard', suppliers: 'Suppliers', inventory: 'Inventory', orders: 'Orders', analytics: 'Analytics' };
  $('pageTitle').textContent = titles[page] || page;
  loadPage(page);
}

document.querySelectorAll('.nav-item').forEach(nav => {
  nav.addEventListener('click', e => { e.preventDefault(); navigate(nav.dataset.page); });
});

$('menuBtn').addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('open');
});

document.addEventListener('click', e => {
  const sidebar = document.querySelector('.sidebar');
  if (window.innerWidth <= 768 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== $('menuBtn')) {
    sidebar.classList.remove('open');
  }
});

// ── Date ──────────────────────────────────────────────────────────────────
$('pageDate').textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

// ── Toast ─────────────────────────────────────────────────────────────────
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  $('toast-container').appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── API ───────────────────────────────────────────────────────────────────
async function api(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(r.statusText);
  return r.json();
}

// ── Page Loader ───────────────────────────────────────────────────────────
async function loadPage(page) {
  const content = $('pageContent');
  content.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text3)">Loading…</div>';
  try {
    if (page === 'dashboard') await renderDashboard();
    else if (page === 'suppliers') await renderSuppliers();
    else if (page === 'inventory') await renderInventory();
    else if (page === 'orders') await renderOrders();
    else if (page === 'analytics') await renderAnalytics();
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><p>Error loading data. Please try again.</p></div>`;
  }
}

// ── Status Helpers ────────────────────────────────────────────────────────
function supplierBadge(status) {
  const map = { active: 'badge-green', 'at-risk': 'badge-yellow', inactive: 'badge-gray' };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function orderBadge(status) {
  const map = { delivered: 'badge-green', 'in-transit': 'badge-blue', confirmed: 'badge-purple', pending: 'badge-yellow', cancelled: 'badge-red' };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status.replace('-', ' ')}</span>`;
}

function stockBadge(status) {
  const map = { healthy: 'badge-green', low: 'badge-yellow', critical: 'badge-red' };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function payBadge(status) {
  const map = { paid: 'badge-green', partial: 'badge-yellow', pending: 'badge-gray' };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────
async function renderDashboard() {
  const d = await api('/api/dashboard');
  $('alertCount').textContent = d.totalAlerts;

  const maxSpend = Math.max(...d.monthlyStats.map(m => m.spend));

  $('pageContent').innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card blue">
        <div class="kpi-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="kpi-label">Inventory Value</div>
        <div class="kpi-value">${fmtUSD(d.totalInventoryValue)}</div>
        <div class="kpi-sub">Across all warehouses</div>
      </div>
      <div class="kpi-card green">
        <div class="kpi-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="kpi-label">Active Suppliers</div>
        <div class="kpi-value">${d.activeSuppliers}</div>
        <div class="kpi-sub">Across 4 countries</div>
      </div>
      <div class="kpi-card yellow">
        <div class="kpi-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="kpi-label">Open Orders</div>
        <div class="kpi-value">${d.openOrders}</div>
        <div class="kpi-sub">${fmtUSD(d.monthSpend)} this month</div>
      </div>
      <div class="kpi-card red">
        <div class="kpi-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="kpi-label">Active Alerts</div>
        <div class="kpi-value">${d.totalAlerts}</div>
        <div class="kpi-sub">${d.criticalAlerts} critical · ${d.lowStockItems} low-stock items</div>
      </div>
    </div>

    <div class="dash-grid">
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Monthly Procurement Spend</div>
              <div class="card-subtitle">Last 7 months</div>
            </div>
          </div>
          <div class="chart-wrap">
            <div class="bar-chart">
              ${d.monthlyStats.map(m => `
                <div class="bar-group">
                  <div class="bar spend" style="height:${Math.round((m.spend / maxSpend) * 160)}px" title="${m.month}: ${fmtUSD(m.spend)}"></div>
                  <div class="bar-label">${m.month}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">Recent Purchase Orders</div>
            <span class="section-link" onclick="navigate('orders')">View all →</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>PO Number</th><th>Supplier</th><th>Value</th><th>Status</th><th>Expected</th></tr></thead>
              <tbody>
                ${d.recentOrders.map(o => `
                  <tr>
                    <td class="text-mono">${o.id}</td>
                    <td>${o.supplierName}</td>
                    <td>${fmtUSD(o.totalValue)}</td>
                    <td>${orderBadge(o.status)}</td>
                    <td>${fmtDate(o.expectedDate)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:20px;">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Active Alerts</div>
            <span class="section-link" onclick="navigate('inventory')">View all →</span>
          </div>
          <div class="alert-list">
            ${d.topAlerts.map(a => `
              <div class="alert-item">
                <div class="alert-dot ${a.type}"></div>
                <div class="alert-text">${a.message}</div>
              </div>`).join('')}
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">Supply Chain Health</div>
          </div>
          <div class="scorecard-row">
            <div class="scorecard-item">
              <div class="scorecard-meta">
                <span class="scorecard-label">Avg. On-Time Delivery</span>
                <span class="scorecard-val">${d.avgDeliveryRate}%</span>
              </div>
              <div class="progress-bar"><div class="progress-fill ${d.avgDeliveryRate >= 90 ? 'green' : d.avgDeliveryRate >= 80 ? 'yellow' : 'red'}" style="width:${d.avgDeliveryRate}%"></div></div>
            </div>
            <div class="scorecard-item">
              <div class="scorecard-meta">
                <span class="scorecard-label">Stock Availability</span>
                <span class="scorecard-val">${Math.round((10 - d.lowStockItems) / 10 * 100)}%</span>
              </div>
              <div class="progress-bar"><div class="progress-fill green" style="width:${Math.round((10 - d.lowStockItems) / 10 * 100)}%"></div></div>
            </div>
            <div class="scorecard-item">
              <div class="scorecard-meta">
                <span class="scorecard-label">Order Fulfillment Rate</span>
                <span class="scorecard-val">92%</span>
              </div>
              <div class="progress-bar"><div class="progress-fill green" style="width:92%"></div></div>
            </div>
            <div class="scorecard-item">
              <div class="scorecard-meta">
                <span class="scorecard-label">Supplier Compliance</span>
                <span class="scorecard-val">87%</span>
              </div>
              <div class="progress-bar"><div class="progress-fill yellow" style="width:87%"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── SUPPLIERS ─────────────────────────────────────────────────────────────
async function renderSuppliers(search = '', status = '', category = '') {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  if (category) params.set('category', category);

  const data = await api('/api/suppliers?' + params);
  const categories = [...new Set(data.map(s => s.category))].sort();

  $('pageContent').innerHTML = `
    <div class="filters">
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input id="supSearch" placeholder="Search suppliers…" value="${search}" />
      </div>
      <select class="filter-select" id="supStatus">
        <option value="">All Status</option>
        <option value="active" ${status === 'active' ? 'selected' : ''}>Active</option>
        <option value="at-risk" ${status === 'at-risk' ? 'selected' : ''}>At Risk</option>
        <option value="inactive" ${status === 'inactive' ? 'selected' : ''}>Inactive</option>
      </select>
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Supplier Directory</div>
          <div class="card-subtitle">${data.length} supplier${data.length !== 1 ? 's' : ''} found</div>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Category</th>
              <th>Location</th>
              <th>Rating</th>
              <th>On-Time</th>
              <th>Quality</th>
              <th>Total Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.length === 0 ? `<tr><td colspan="8"><div class="empty-state"><p>No suppliers match your filters.</p></div></td></tr>` : ''}
            ${data.map(s => `
              <tr style="cursor:pointer" onclick="renderSupplierDetail(${s.id})">
                <td>
                  <div style="font-weight:600">${s.name}</div>
                  <div style="font-size:11px;color:var(--text3)">${s.contact}</div>
                </td>
                <td><span style="font-size:12px;color:var(--text2)">${s.category}</span></td>
                <td>${s.city}, ${s.country}</td>
                <td>
                  <div class="stars">${stars(s.rating)}</div>
                  <div style="font-size:11px;color:var(--text3)">${s.rating}/5</div>
                </td>
                <td>
                  <div style="font-weight:600;color:${s.onTimeDelivery >= 90 ? 'var(--green)' : s.onTimeDelivery >= 80 ? 'var(--yellow)' : 'var(--red)'}">${s.onTimeDelivery}%</div>
                </td>
                <td><div style="font-weight:600">${s.qualityScore}%</div></td>
                <td>${fmtUSD(s.totalValue)}</td>
                <td>${supplierBadge(s.status)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  $('supSearch').addEventListener('input', e => renderSuppliers(e.target.value, $('supStatus').value, category));
  $('supStatus').addEventListener('change', e => renderSuppliers($('supSearch').value, e.target.value, category));
}

async function renderSupplierDetail(id) {
  const s = await api(`/api/suppliers/${id}`);
  $('pageContent').innerHTML = `
    <div style="margin-bottom:16px;">
      <span class="section-link" onclick="renderSuppliers()">&larr; Back to Suppliers</span>
    </div>
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:20px;">
      <div class="card">
        <div class="flex-between" style="margin-bottom:16px">
          <div>
            <h2 style="font-size:18px;font-weight:700">${s.name}</h2>
            <div style="font-size:13px;color:var(--text3);margin-top:2px">${s.category} · ${s.city}, ${s.country}</div>
          </div>
          ${supplierBadge(s.status)}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div>
            <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Contact Person</div>
            <div style="font-weight:600">${s.contact}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Email</div>
            <div style="font-weight:600">${s.email}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Phone</div>
            <div style="font-weight:600">${s.phone}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Partner Since</div>
            <div style="font-weight:600">${fmtDate(s.since)}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Total Orders</div>
            <div style="font-weight:600">${fmt(s.totalOrders)}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Total Value</div>
            <div style="font-weight:600">${fmtUSD(s.totalValue)}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title" style="margin-bottom:16px">Performance</div>
        <div style="text-align:center;margin-bottom:16px">
          <div class="stars" style="font-size:20px">${stars(s.rating)}</div>
          <div style="font-size:24px;font-weight:700;margin-top:4px">${s.rating}</div>
          <div style="font-size:12px;color:var(--text3)">Overall Rating</div>
        </div>
        <div class="scorecard-row">
          <div class="scorecard-item">
            <div class="scorecard-meta">
              <span class="scorecard-label">On-Time Delivery</span>
              <span class="scorecard-val">${s.onTimeDelivery}%</span>
            </div>
            <div class="progress-bar"><div class="progress-fill ${s.onTimeDelivery >= 90 ? 'green' : s.onTimeDelivery >= 80 ? 'yellow' : 'red'}" style="width:${s.onTimeDelivery}%"></div></div>
          </div>
          <div class="scorecard-item">
            <div class="scorecard-meta">
              <span class="scorecard-label">Quality Score</span>
              <span class="scorecard-val">${s.qualityScore}%</span>
            </div>
            <div class="progress-bar"><div class="progress-fill ${s.qualityScore >= 90 ? 'green' : s.qualityScore >= 80 ? 'yellow' : 'red'}" style="width:${s.qualityScore}%"></div></div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Order History</div>
        <div class="card-subtitle">${s.orders.length} order${s.orders.length !== 1 ? 's' : ''}</div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>PO Number</th><th>Items</th><th>Total Value</th><th>Status</th><th>Order Date</th><th>Delivery</th><th>Payment</th></tr></thead>
          <tbody>
            ${s.orders.length === 0 ? '<tr><td colspan="7"><div class="empty-state"><p>No orders found.</p></div></td></tr>' : ''}
            ${s.orders.map(o => `
              <tr>
                <td class="text-mono">${o.id}</td>
                <td>${o.items.map(i => i.name).join(', ')}</td>
                <td>${fmtUSD(o.totalValue)}</td>
                <td>${orderBadge(o.status)}</td>
                <td>${fmtDate(o.orderDate)}</td>
                <td>${o.deliveredDate ? fmtDate(o.deliveredDate) : fmtDate(o.expectedDate) + ' (exp)'}</td>
                <td>${payBadge(o.paymentStatus)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── INVENTORY ─────────────────────────────────────────────────────────────
async function renderInventory(search = '', status = '', category = '') {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  if (category) params.set('category', category);

  const data = await api('/api/inventory?' + params);
  const totalValue = data.reduce((s, i) => s + i.quantity * i.unitCost, 0);
  const critCount = data.filter(i => i.status === 'critical').length;
  const lowCount = data.filter(i => i.status === 'low').length;

  $('pageContent').innerHTML = `
    <div class="kpi-grid" style="margin-bottom:20px">
      <div class="kpi-card blue">
        <div class="kpi-label">Total Items</div>
        <div class="kpi-value">${data.length}</div>
        <div class="kpi-sub">SKUs tracked</div>
      </div>
      <div class="kpi-card green">
        <div class="kpi-label">Stock Value</div>
        <div class="kpi-value">${fmtUSD(totalValue)}</div>
        <div class="kpi-sub">Current inventory</div>
      </div>
      <div class="kpi-card yellow">
        <div class="kpi-label">Low Stock</div>
        <div class="kpi-value">${lowCount}</div>
        <div class="kpi-sub">Items near reorder point</div>
      </div>
      <div class="kpi-card red">
        <div class="kpi-label">Critical</div>
        <div class="kpi-value">${critCount}</div>
        <div class="kpi-sub">Below reorder threshold</div>
      </div>
    </div>

    <div class="filters">
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input id="invSearch" placeholder="Search by name or SKU…" value="${search}" />
      </div>
      <select class="filter-select" id="invStatus">
        <option value="">All Status</option>
        <option value="healthy" ${status === 'healthy' ? 'selected' : ''}>Healthy</option>
        <option value="low" ${status === 'low' ? 'selected' : ''}>Low Stock</option>
        <option value="critical" ${status === 'critical' ? 'selected' : ''}>Critical</option>
      </select>
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Inventory Register</div>
          <div class="card-subtitle">${data.length} item${data.length !== 1 ? 's' : ''}</div>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Category</th>
              <th>Stock Level</th>
              <th>Unit Cost</th>
              <th>Total Value</th>
              <th>Warehouse</th>
              <th>Expiry</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.length === 0 ? '<tr><td colspan="9"><div class="empty-state"><p>No items match.</p></div></td></tr>' : ''}
            ${data.map(i => {
              const pct = Math.min(100, Math.round(i.quantity / i.maxStock * 100));
              const barColor = i.status === 'critical' ? 'red' : i.status === 'low' ? 'yellow' : 'green';
              return `<tr>
                <td class="text-mono">${i.sku}</td>
                <td><div style="font-weight:600">${i.name}</div><div style="font-size:11px;color:var(--text3)">${i.supplierName}</div></td>
                <td style="font-size:12px;color:var(--text2)">${i.category}</td>
                <td>
                  <div style="font-weight:600;font-size:12px;margin-bottom:4px">${fmt(i.quantity)} ${i.unit}</div>
                  <div class="stock-bar-wrap">
                    <div class="progress-bar"><div class="progress-fill ${barColor}" style="width:${pct}%"></div></div>
                    <div class="stock-labels">
                      <span class="stock-label">0</span>
                      <span class="stock-label">${fmt(i.reorderPoint)} min</span>
                    </div>
                  </div>
                </td>
                <td>${fmtUSD(i.unitCost)}/${i.unit}</td>
                <td>${fmtUSD(i.quantity * i.unitCost)}</td>
                <td style="font-size:12px">${i.warehouse}</td>
                <td style="font-size:12px;color:${i.expiryDate && new Date(i.expiryDate) < new Date(Date.now() + 30 * 86400000) ? 'var(--red)' : 'var(--text2)'}">${i.expiryDate ? fmtDate(i.expiryDate) : '—'}</td>
                <td>${stockBadge(i.status)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  $('invSearch').addEventListener('input', e => renderInventory(e.target.value, $('invStatus').value, category));
  $('invStatus').addEventListener('change', e => renderInventory($('invSearch').value, e.target.value, category));
}

// ── ORDERS ────────────────────────────────────────────────────────────────
async function renderOrders(search = '', status = '') {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (status) params.set('status', status);

  const data = await api('/api/orders?' + params);
  const total = data.reduce((s, o) => s + o.totalValue, 0);
  const delivered = data.filter(o => o.status === 'delivered').length;
  const inTransit = data.filter(o => o.status === 'in-transit').length;
  const pending = data.filter(o => ['pending', 'confirmed'].includes(o.status)).length;

  $('pageContent').innerHTML = `
    <div class="kpi-grid" style="margin-bottom:20px">
      <div class="kpi-card blue">
        <div class="kpi-label">Total Orders</div>
        <div class="kpi-value">${data.length}</div>
        <div class="kpi-sub">${fmtUSD(total)} total value</div>
      </div>
      <div class="kpi-card green">
        <div class="kpi-label">Delivered</div>
        <div class="kpi-value">${delivered}</div>
        <div class="kpi-sub">Completed</div>
      </div>
      <div class="kpi-card yellow">
        <div class="kpi-label">In Transit</div>
        <div class="kpi-value">${inTransit}</div>
        <div class="kpi-sub">On the way</div>
      </div>
      <div class="kpi-card purple">
        <div class="kpi-label">Pending</div>
        <div class="kpi-value">${pending}</div>
        <div class="kpi-sub">Awaiting dispatch</div>
      </div>
    </div>

    <div class="filters">
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input id="ordSearch" placeholder="Search by PO number or supplier…" value="${search}" />
      </div>
      <select class="filter-select" id="ordStatus">
        <option value="">All Status</option>
        <option value="pending" ${status === 'pending' ? 'selected' : ''}>Pending</option>
        <option value="confirmed" ${status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
        <option value="in-transit" ${status === 'in-transit' ? 'selected' : ''}>In Transit</option>
        <option value="delivered" ${status === 'delivered' ? 'selected' : ''}>Delivered</option>
      </select>
    </div>

    <div style="display:flex;flex-direction:column;gap:12px">
      ${data.length === 0 ? '<div class="card"><div class="empty-state"><p>No orders match.</p></div></div>' : ''}
      ${data.map(o => `
        <div class="card">
          <div class="flex-between" style="margin-bottom:12px">
            <div class="flex-gap">
              <span class="text-mono" style="font-size:14px;font-weight:700">${o.id}</span>
              ${orderBadge(o.status)}
              ${payBadge(o.paymentStatus)}
            </div>
            <div style="font-size:18px;font-weight:700">${fmtUSD(o.totalValue)}</div>
          </div>
          <div style="font-weight:600;margin-bottom:4px">${o.supplierName}</div>
          <div style="font-size:12px;color:var(--text3);margin-bottom:10px">
            ${o.items.map(i => `${fmt(i.qty)} ${i.unit} × ${i.name}`).join(' · ')}
          </div>
          <div class="order-meta">
            <div class="order-meta-item">📦 <strong>Warehouse:</strong> ${o.warehouse}</div>
            <div class="order-meta-item">📅 <strong>Ordered:</strong> ${fmtDate(o.orderDate)}</div>
            <div class="order-meta-item">🎯 <strong>Expected:</strong> ${fmtDate(o.expectedDate)}</div>
            ${o.deliveredDate ? `<div class="order-meta-item">✅ <strong>Delivered:</strong> ${fmtDate(o.deliveredDate)}</div>` : ''}
          </div>
        </div>`).join('')}
    </div>
  `;

  $('ordSearch').addEventListener('input', e => renderOrders(e.target.value, $('ordStatus').value));
  $('ordStatus').addEventListener('change', e => renderOrders($('ordSearch').value, e.target.value));
}

// ── ANALYTICS ─────────────────────────────────────────────────────────────
async function renderAnalytics() {
  const [d, suppliers, inventory] = await Promise.all([
    api('/api/dashboard'),
    api('/api/suppliers'),
    api('/api/inventory')
  ]);

  const totalSpend = d.monthlyStats.reduce((s, m) => s + m.spend, 0);
  const totalOrders = d.monthlyStats.reduce((s, m) => s + m.orders, 0);
  const totalDelivered = d.monthlyStats.reduce((s, m) => s + m.delivered, 0);
  const fulfillRate = Math.round(totalDelivered / totalOrders * 100);

  // Category spend breakdown
  const catMap = {};
  suppliers.forEach(s => {
    catMap[s.category] = (catMap[s.category] || 0) + s.totalValue;
  });
  const cats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const maxCat = cats[0][1];

  // Top suppliers by value
  const topSup = [...suppliers].sort((a, b) => b.totalValue - a.totalValue).slice(0, 5);

  // Inventory by category
  const invCat = {};
  inventory.forEach(i => {
    invCat[i.category] = (invCat[i.category] || 0) + i.quantity * i.unitCost;
  });
  const invCatArr = Object.entries(invCat).sort((a, b) => b[1] - a[1]);
  const maxInvCat = invCatArr[0]?.[1] || 1;

  $('pageContent').innerHTML = `
    <div class="kpi-grid" style="margin-bottom:24px">
      <div class="kpi-card blue">
        <div class="kpi-label">7-Month Spend</div>
        <div class="kpi-value">${fmtUSD(totalSpend)}</div>
        <div class="kpi-sub">Feb–Aug 2026</div>
      </div>
      <div class="kpi-card green">
        <div class="kpi-label">Fulfillment Rate</div>
        <div class="kpi-value">${fulfillRate}%</div>
        <div class="kpi-sub">${totalDelivered}/${totalOrders} orders delivered</div>
      </div>
      <div class="kpi-card yellow">
        <div class="kpi-label">Avg Monthly Spend</div>
        <div class="kpi-value">${fmtUSD(totalSpend / 7)}</div>
        <div class="kpi-sub">Per month average</div>
      </div>
      <div class="kpi-card purple">
        <div class="kpi-label">Active Suppliers</div>
        <div class="kpi-value">${suppliers.filter(s => s.status === 'active').length}</div>
        <div class="kpi-sub">of ${suppliers.length} total</div>
      </div>
    </div>

    <div class="analytics-grid">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Spend by Category</div>
          <div class="card-subtitle">All-time procurement</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${cats.map(([cat, val]) => `
            <div>
              <div class="flex-between" style="margin-bottom:4px">
                <span style="font-size:13px;color:var(--text2)">${cat}</span>
                <span style="font-size:13px;font-weight:600">${fmtUSD(val)}</span>
              </div>
              <div class="progress-bar"><div class="progress-fill blue" style="width:${Math.round(val / maxCat * 100)}%"></div></div>
            </div>`).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Top Suppliers by Value</div>
          <div class="card-subtitle">Ranked by total procurement</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${topSup.map((s, idx) => `
            <div class="flex-between">
              <div class="flex-gap">
                <div style="width:22px;height:22px;border-radius:50%;background:var(--bg4);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--text3);flex-shrink:0">${idx + 1}</div>
                <div>
                  <div style="font-weight:600;font-size:13px">${s.name}</div>
                  <div style="font-size:11px;color:var(--text3)">${s.category}</div>
                </div>
              </div>
              <div style="text-align:right">
                <div style="font-weight:700">${fmtUSD(s.totalValue)}</div>
                <div style="font-size:11px;color:var(--text3)">${s.totalOrders} orders</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="analytics-grid" style="margin-top:20px">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Monthly Order Volume</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${d.monthlyStats.map(m => {
            const rate = Math.round(m.delivered / m.orders * 100);
            return `<div>
              <div class="flex-between" style="margin-bottom:3px">
                <span style="font-size:13px;color:var(--text2);width:32px">${m.month}</span>
                <span style="font-size:12px;color:var(--text3)">${m.orders} orders · ${rate}% delivered</span>
                <span style="font-size:12px;font-weight:600">${fmtUSD(m.spend)}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill ${rate >= 95 ? 'green' : rate >= 88 ? 'yellow' : 'red'}" style="width:${rate}%"></div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Inventory Value by Category</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${invCatArr.map(([cat, val]) => `
            <div>
              <div class="flex-between" style="margin-bottom:4px">
                <span style="font-size:13px;color:var(--text2)">${cat}</span>
                <span style="font-size:13px;font-weight:600">${fmtUSD(val)}</span>
              </div>
              <div class="progress-bar"><div class="progress-fill purple" style="width:${Math.round(val / maxInvCat * 100)}%"></div></div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:20px">
      <div class="card-header">
        <div class="card-title">Supplier Performance Matrix</div>
        <div class="card-subtitle">On-time delivery vs. quality score</div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Supplier</th><th>Status</th><th>On-Time Delivery</th><th>Quality Score</th><th>Rating</th><th>Orders</th><th>Total Value</th><th>Performance</th></tr>
          </thead>
          <tbody>
            ${suppliers.map(s => {
              const perf = Math.round((s.onTimeDelivery + s.qualityScore) / 2);
              const color = perf >= 92 ? 'green' : perf >= 85 ? 'yellow' : 'red';
              return `<tr>
                <td style="font-weight:600">${s.name}</td>
                <td>${supplierBadge(s.status)}</td>
                <td>
                  <div style="font-weight:600;margin-bottom:3px">${s.onTimeDelivery}%</div>
                  <div class="progress-bar" style="width:80px"><div class="progress-fill ${s.onTimeDelivery >= 90 ? 'green' : s.onTimeDelivery >= 80 ? 'yellow' : 'red'}" style="width:${s.onTimeDelivery}%"></div></div>
                </td>
                <td>
                  <div style="font-weight:600;margin-bottom:3px">${s.qualityScore}%</div>
                  <div class="progress-bar" style="width:80px"><div class="progress-fill ${s.qualityScore >= 90 ? 'green' : s.qualityScore >= 80 ? 'yellow' : 'red'}" style="width:${s.qualityScore}%"></div></div>
                </td>
                <td><div class="stars" style="font-size:11px">${stars(s.rating)}</div></td>
                <td>${fmt(s.totalOrders)}</td>
                <td>${fmtUSD(s.totalValue)}</td>
                <td><span class="badge badge-${color === 'green' ? 'green' : color === 'yellow' ? 'yellow' : 'red'}">${perf}%</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── Init ──────────────────────────────────────────────────────────────────
navigate('dashboard');
