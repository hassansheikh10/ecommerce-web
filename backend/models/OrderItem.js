const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Product = require("./Product");
const Order = require("./Order");

const OrderItem = sequelize.define("OrderItem", {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false }
});

OrderItem.belongsTo(Order, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });

module.exports = OrderItem;