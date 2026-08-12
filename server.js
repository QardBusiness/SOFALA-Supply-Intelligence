const express = require("express");
const app = express();
app.use(express.json());

console.log("📦 Iniciando SOFALA Supply Intelligence...");

// Banco de dados simulado (Cardápio e Insumos da Operação)
const mockInventory = {
  crispy_pork: { name: "Crispy Pork Burger", stock: 12, dailyAverage: 15 },
  krug_zero: { name: "Cerveja Krug Zero", stock: 85, dailyAverage: 20 },
  beef_portion: { name: "Cassava & Beef Portion", stock: 4, dailyAverage: 10 },
};

// Rota de status vital
app.get("/", (req, res) => {
  res.send("Módulo Administrativo de Supply Chain: ONLINE");
});

// Lista o estoque atual
app.get("/api/inventory", (req, res) => {
  res.json(mockInventory);
});

// IA Katlyn prevendo ruptura e sugerindo compras
app.post("/api/inventory/analyze", (req, res) => {
  const { itemId } = req.body;
  const item = mockInventory[itemId];

  if (!item)
    return res
      .status(404)
      .json({ error: "Insumo não localizado no inventário." });

  console.log(`\n🔍 Katlyn AI analisando fluxo de estoque para: ${item.name}`);

  // Motor lógico: Se o estoque durar menos de 2 dias, aciona o alerta vermelho
  const daysLeft = (item.stock / item.dailyAverage).toFixed(1);
  const requiresRestock = daysLeft < 2;

  res.json({
    status: "Análise Preditiva Concluída",
    agent: "Katlyn AI",
    insight: {
      product: item.name,
      currentStock: item.stock,
      estimatedDaysLeft: parseFloat(daysLeft),
      restockAlert: requiresRestock,
      suggestedOrder: requiresRestock ? item.dailyAverage * 7 : 0, // Sugere pedido para cobrir 1 semana
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`📡 Supply Intelligence monitorando insumos na porta ${port}.`);
});
