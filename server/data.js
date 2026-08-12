// In-memory data store for SOFALA Supply Intelligence

export const suppliers = [
  { id: 1, name: "AgroTrade Mozambique", category: "Grains & Cereals", country: "Mozambique", city: "Maputo", contact: "João Machava", email: "j.machava@agrotrade.mz", phone: "+258 84 123 4567", status: "active", rating: 4.7, onTimeDelivery: 94, qualityScore: 96, totalOrders: 142, totalValue: 2340000, lastOrder: "2026-08-01", since: "2022-03-15" },
  { id: 2, name: "Sofala Harvest Co.", category: "Vegetables & Produce", country: "Mozambique", city: "Beira", contact: "Maria Nhantumbo", email: "m.nhantumbo@sofalaharvest.mz", phone: "+258 82 234 5678", status: "active", rating: 4.5, onTimeDelivery: 91, qualityScore: 93, totalOrders: 98, totalValue: 1120000, lastOrder: "2026-08-05", since: "2023-01-10" },
  { id: 3, name: "Zambeze Logistics", category: "Transport & Logistics", country: "Mozambique", city: "Tete", contact: "Carlos Fumo", email: "c.fumo@zambeze.mz", phone: "+258 86 345 6789", status: "active", rating: 4.3, onTimeDelivery: 88, qualityScore: 90, totalOrders: 215, totalValue: 890000, lastOrder: "2026-08-08", since: "2021-07-22" },
  { id: 4, name: "Nampula Packaging Ltd", category: "Packaging Materials", country: "Mozambique", city: "Nampula", contact: "Fatima Abdul", email: "f.abdul@nampulapack.mz", phone: "+258 84 456 7890", status: "active", rating: 4.1, onTimeDelivery: 85, qualityScore: 88, totalOrders: 67, totalValue: 430000, lastOrder: "2026-07-28", since: "2023-06-01" },
  { id: 5, name: "Índico Marine Supplies", category: "Seafood & Marine", country: "Mozambique", city: "Pemba", contact: "António Sitoe", email: "a.sitoe@indicomarine.mz", phone: "+258 82 567 8901", status: "at-risk", rating: 3.8, onTimeDelivery: 78, qualityScore: 82, totalOrders: 44, totalValue: 760000, lastOrder: "2026-07-15", since: "2024-02-14" },
  { id: 6, name: "Southern Agri Inputs", category: "Fertilizers & Inputs", country: "South Africa", city: "Johannesburg", contact: "Priya Naidoo", email: "p.naidoo@southernagri.za", phone: "+27 11 234 5678", status: "active", rating: 4.6, onTimeDelivery: 92, qualityScore: 95, totalOrders: 53, totalValue: 1870000, lastOrder: "2026-08-03", since: "2022-09-30" },
  { id: 7, name: "Malawi Grain Exchange", category: "Grains & Cereals", country: "Malawi", city: "Lilongwe", contact: "Grace Phiri", email: "g.phiri@malawigrain.mw", phone: "+265 1 234 567", status: "active", rating: 4.4, onTimeDelivery: 89, qualityScore: 91, totalOrders: 31, totalValue: 680000, lastOrder: "2026-07-22", since: "2023-11-05" },
  { id: 8, name: "Maputo Cold Chain", category: "Cold Storage & Logistics", country: "Mozambique", city: "Maputo", contact: "Ricardo Bila", email: "r.bila@maputocold.mz", phone: "+258 84 678 9012", status: "inactive", rating: 3.5, onTimeDelivery: 72, qualityScore: 78, totalOrders: 19, totalValue: 290000, lastOrder: "2026-05-10", since: "2024-04-01" },
];

export const inventory = [
  { id: 1, sku: "GRN-MAZ-001", name: "White Maize", category: "Grains & Cereals", unit: "MT", quantity: 850, reorderPoint: 200, maxStock: 1200, unitCost: 285, supplierId: 1, supplierName: "AgroTrade Mozambique", warehouse: "Beira Main", lastUpdated: "2026-08-10", expiryDate: "2027-03-01", status: "healthy" },
  { id: 2, sku: "GRN-RIC-002", name: "Parboiled Rice", category: "Grains & Cereals", unit: "MT", quantity: 320, reorderPoint: 150, maxStock: 600, unitCost: 520, supplierId: 7, supplierName: "Malawi Grain Exchange", warehouse: "Maputo Central", lastUpdated: "2026-08-09", expiryDate: "2027-06-15", status: "healthy" },
  { id: 3, sku: "VEG-TOM-003", name: "Tomatoes", category: "Vegetables & Produce", unit: "KG", quantity: 4200, reorderPoint: 2000, maxStock: 8000, unitCost: 18, supplierId: 2, supplierName: "Sofala Harvest Co.", warehouse: "Beira Cold Store", lastUpdated: "2026-08-11", expiryDate: "2026-08-25", status: "healthy" },
  { id: 4, sku: "VEG-ONI-004", name: "Onions", category: "Vegetables & Produce", unit: "KG", quantity: 980, reorderPoint: 1500, maxStock: 5000, unitCost: 12, supplierId: 2, supplierName: "Sofala Harvest Co.", warehouse: "Beira Cold Store", lastUpdated: "2026-08-08", expiryDate: "2026-09-30", status: "low" },
  { id: 5, sku: "SEA-FIS-005", name: "Dried Fish (Matemba)", category: "Seafood & Marine", unit: "KG", quantity: 2100, reorderPoint: 800, maxStock: 4000, unitCost: 95, supplierId: 5, supplierName: "Índico Marine Supplies", warehouse: "Pemba Warehouse", lastUpdated: "2026-08-07", expiryDate: "2026-12-01", status: "healthy" },
  { id: 6, sku: "PKG-SAC-006", name: "Polypropylene Sacks (50kg)", category: "Packaging Materials", unit: "Units", quantity: 12400, reorderPoint: 5000, maxStock: 25000, unitCost: 4.5, supplierId: 4, supplierName: "Nampula Packaging Ltd", warehouse: "Nampula Store", lastUpdated: "2026-08-06", expiryDate: null, status: "healthy" },
  { id: 7, sku: "INP-FER-007", name: "NPK Fertilizer 15-15-15", category: "Fertilizers & Inputs", unit: "MT", quantity: 45, reorderPoint: 50, maxStock: 300, unitCost: 820, supplierId: 6, supplierName: "Southern Agri Inputs", warehouse: "Maputo Central", lastUpdated: "2026-08-05", expiryDate: "2028-01-01", status: "critical" },
  { id: 8, sku: "INP-SED-008", name: "Hybrid Maize Seed (SC403)", category: "Fertilizers & Inputs", unit: "KG", quantity: 6800, reorderPoint: 3000, maxStock: 15000, unitCost: 3.8, supplierId: 6, supplierName: "Southern Agri Inputs", warehouse: "Maputo Central", lastUpdated: "2026-08-04", expiryDate: "2027-09-01", status: "healthy" },
  { id: 9, sku: "GRN-SOR-009", name: "Sorghum", category: "Grains & Cereals", unit: "MT", quantity: 110, reorderPoint: 100, maxStock: 400, unitCost: 240, supplierId: 1, supplierName: "AgroTrade Mozambique", warehouse: "Chimoio Depot", lastUpdated: "2026-08-03", expiryDate: "2027-04-01", status: "low" },
  { id: 10, sku: "VEG-CAB-010", name: "Cabbage", category: "Vegetables & Produce", unit: "KG", quantity: 3300, reorderPoint: 1000, maxStock: 6000, unitCost: 8, supplierId: 2, supplierName: "Sofala Harvest Co.", warehouse: "Beira Cold Store", lastUpdated: "2026-08-11", expiryDate: "2026-08-22", status: "healthy" },
];

export const orders = [
  { id: "PO-2026-0841", supplierId: 1, supplierName: "AgroTrade Mozambique", items: [{ sku: "GRN-MAZ-001", name: "White Maize", qty: 200, unit: "MT", unitCost: 285 }], totalValue: 57000, status: "delivered", orderDate: "2026-07-20", expectedDate: "2026-08-01", deliveredDate: "2026-08-01", warehouse: "Beira Main", paymentStatus: "paid" },
  { id: "PO-2026-0842", supplierId: 6, supplierName: "Southern Agri Inputs", items: [{ sku: "INP-FER-007", name: "NPK Fertilizer", qty: 80, unit: "MT", unitCost: 820 }], totalValue: 65600, status: "in-transit", orderDate: "2026-08-01", expectedDate: "2026-08-15", deliveredDate: null, warehouse: "Maputo Central", paymentStatus: "partial" },
  { id: "PO-2026-0843", supplierId: 2, supplierName: "Sofala Harvest Co.", items: [{ sku: "VEG-ONI-004", name: "Onions", qty: 5000, unit: "KG", unitCost: 12 }, { sku: "VEG-TOM-003", name: "Tomatoes", qty: 3000, unit: "KG", unitCost: 18 }], totalValue: 114000, status: "confirmed", orderDate: "2026-08-08", expectedDate: "2026-08-18", deliveredDate: null, warehouse: "Beira Cold Store", paymentStatus: "pending" },
  { id: "PO-2026-0844", supplierId: 7, supplierName: "Malawi Grain Exchange", items: [{ sku: "GRN-RIC-002", name: "Parboiled Rice", qty: 100, unit: "MT", unitCost: 520 }], totalValue: 52000, status: "pending", orderDate: "2026-08-10", expectedDate: "2026-08-25", deliveredDate: null, warehouse: "Maputo Central", paymentStatus: "pending" },
  { id: "PO-2026-0845", supplierId: 4, supplierName: "Nampula Packaging Ltd", items: [{ sku: "PKG-SAC-006", name: "Poly Sacks 50kg", qty: 10000, unit: "Units", unitCost: 4.5 }], totalValue: 45000, status: "delivered", orderDate: "2026-07-25", expectedDate: "2026-08-05", deliveredDate: "2026-08-07", warehouse: "Nampula Store", paymentStatus: "paid" },
  { id: "PO-2026-0846", supplierId: 3, supplierName: "Zambeze Logistics", items: [{ sku: "LOG-TRK-001", name: "Transport Services (Tete-Beira)", qty: 5, unit: "Trips", unitCost: 3800 }], totalValue: 19000, status: "in-transit", orderDate: "2026-08-09", expectedDate: "2026-08-12", deliveredDate: null, warehouse: "Beira Main", paymentStatus: "pending" },
  { id: "PO-2026-0839", supplierId: 1, supplierName: "AgroTrade Mozambique", items: [{ sku: "GRN-SOR-009", name: "Sorghum", qty: 150, unit: "MT", unitCost: 240 }], totalValue: 36000, status: "delivered", orderDate: "2026-07-05", expectedDate: "2026-07-18", deliveredDate: "2026-07-15", warehouse: "Chimoio Depot", paymentStatus: "paid" },
  { id: "PO-2026-0840", supplierId: 5, supplierName: "Índico Marine Supplies", items: [{ sku: "SEA-FIS-005", name: "Dried Fish", qty: 800, unit: "KG", unitCost: 95 }], totalValue: 76000, status: "delivered", orderDate: "2026-07-10", expectedDate: "2026-07-22", deliveredDate: "2026-07-24", warehouse: "Pemba Warehouse", paymentStatus: "paid" },
];

export const alerts = [
  { id: 1, type: "critical", category: "inventory", message: "NPK Fertilizer 15-15-15 is below reorder point (45 MT vs. 50 MT threshold)", item: "INP-FER-007", created: "2026-08-11T07:30:00Z", resolved: false },
  { id: 2, type: "warning", category: "inventory", message: "Onions stock is low — consider placing order immediately (980 KG vs. 1500 KG reorder point)", item: "VEG-ONI-004", created: "2026-08-10T14:15:00Z", resolved: false },
  { id: 3, type: "warning", category: "inventory", message: "Sorghum stock approaching reorder threshold (110 MT vs. 100 MT reorder point)", item: "GRN-SOR-009", created: "2026-08-09T09:00:00Z", resolved: false },
  { id: 4, type: "info", category: "supplier", message: "Índico Marine Supplies on-time delivery rate dropped to 78% — under 80% threshold", item: "SUP-005", created: "2026-08-08T11:00:00Z", resolved: false },
  { id: 5, type: "info", category: "order", message: "PO-2026-0842 (NPK Fertilizer) expected delivery in 3 days — ensure warehouse space", item: "PO-2026-0842", created: "2026-08-12T06:00:00Z", resolved: false },
];

export const monthlyStats = [
  { month: "Feb", spend: 312000, orders: 18, delivered: 17 },
  { month: "Mar", spend: 428000, orders: 24, delivered: 22 },
  { month: "Apr", spend: 395000, orders: 21, delivered: 20 },
  { month: "May", spend: 510000, orders: 29, delivered: 27 },
  { month: "Jun", spend: 467000, orders: 26, delivered: 24 },
  { month: "Jul", spend: 534000, orders: 31, delivered: 29 },
  { month: "Aug", spend: 352000, orders: 20, delivered: 17 },
];
