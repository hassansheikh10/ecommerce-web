import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./models/index.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const API_SECRET = process.env.API_SECRET;

function verifyApiToken(req, res, next) {
  const token = req.headers["x-api-key"];

  if (!token || token.trim() !== process.env.API_SECRET.trim()) {
    return res.status(401).json({ message: "Unauthorized: Invalid API token" });
  }
  next();
}

app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));

app.use("/api/products", verifyApiToken, productRoutes);
app.use("/api/cart", verifyApiToken, cartRoutes);
app.use("/api/orders", verifyApiToken, orderRoutes);
app.use("/api/categories", verifyApiToken, categoryRoutes);
app.use("/api/subcategories", verifyApiToken, subCategoryRoutes);
app.use("/api/dashboard", verifyApiToken, dashboardRoutes);

db.sequelize.sync({ alter: true });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));