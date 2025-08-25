import dotenv from "dotenv";
import db from "./models/index.js";
import Order from "./models/Order.js";

dotenv.config();

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const dummyOrders = Array.from({ length: 100 }, (_, i) => {
  const totalPrice = Math.floor(Math.random() * 5000) + 500; // Rs. 500 – Rs. 5500
  const statusOptions = ["pending", "delivered", "shipped"];
  return {
    userId: Math.floor(Math.random() * 10) + 1, // userId 1-10
    totalPrice,
    status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
    createdAt: randomDate(new Date("2024-01-01"), new Date("2025-07-31")),
  };
});

const insertOrders = async () => {
  try {
    await db.sequelize.sync();
    await Order.bulkCreate(dummyOrders);
    console.log("✅ 100 Dummy Orders Inserted Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error inserting orders:", error);
    process.exit(1);
  }
};

insertOrders();