import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { suppliers, inventory, orders, alerts, monthlyStats } from "./data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "sofala-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

app.use(express.static(path.join(__dirname, "../public")));

// ── Dashboard KPIs ──────────────────────────────────────────────────────────
app.get("/api/dashboard", (req, res) => {
  const totalInventoryValue = inventory.reduce(
    (sum, i) => sum + i.quantity * i.unitCost,
    0,
  );
  const activeSuppliers = suppliers.filter((s) => s.status === "active").length;
  const openOrders = orders.filter((o) =>
    ["pending", "confirmed", "in-transit"].includes(o.status),
  ).length;
  const criticalAlerts = alerts.filter(
    (a) => !a.resolved && a.type === "critical",
  ).length;
  const avgDeliveryRate = Math.round(
    suppliers
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + s.onTimeDelivery, 0) / activeSuppliers,
  );
  const monthSpend = monthlyStats[monthlyStats.length - 1].spend;

  const lowStockItems = inventory.filter(
    (i) => i.status === "low" || i.status === "critical",
  ).length;
  const totalAlerts = alerts.filter((a) => !a.resolved).length;

  res.json({
    totalInventoryValue,
    activeSuppliers,
    openOrders,
    criticalAlerts,
    totalAlerts,
    avgDeliveryRate,
    monthSpend,
    lowStockItems,
    monthlyStats,
    recentOrders: orders.slice(0, 5),
    topAlerts: alerts.filter((a) => !a.resolved).slice(0, 5),
  });
});

// ── Suppliers ────────────────────────────────────────────────────────────────
app.get("/api/suppliers", (req, res) => {
  const { search, status, category } = req.query;
  let result = [...suppliers];
  if (search)
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase()),
    );
  if (status) result = result.filter((s) => s.status === status);
  if (category) result = result.filter((s) => s.category === category);
  res.json(result);
});

app.get("/api/suppliers/:id", (req, res) => {
  const s = suppliers.find((s) => s.id === parseInt(req.params.id));
  if (!s) return res.status(404).json({ error: "Not found" });
  const supplierOrders = orders.filter((o) => o.supplierId === s.id);
  res.json({ ...s, orders: supplierOrders });
});

// ── Inventory ────────────────────────────────────────────────────────────────
app.get("/api/inventory", (req, res) => {
  const { search, status, category } = req.query;
  let result = [...inventory];
  if (search)
    result = result.filter(
      (i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.sku.toLowerCase().includes(search.toLowerCase()),
    );
  if (status) result = result.filter((i) => i.status === status);
  if (category) result = result.filter((i) => i.category === category);
  res.json(result);
});

// ── Orders ───────────────────────────────────────────────────────────────────
app.get("/api/orders", (req, res) => {
  const { search, status } = req.query;
  let result = [...orders];
  if (search)
    result = result.filter(
      (o) =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.supplierName.toLowerCase().includes(search.toLowerCase()),
    );
  if (status) result = result.filter((o) => o.status === status);
  res.json(result);
});

// ── Alerts ───────────────────────────────────────────────────────────────────
app.get("/api/alerts", (req, res) => {
  res.json(alerts.filter((a) => !a.resolved));
});

// ── Catch-all ────────────────────────────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;
