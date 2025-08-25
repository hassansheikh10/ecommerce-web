const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Product = require("./Product");

const Cart = sequelize.define("Cart", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 }
});

Cart.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });

module.exports = Cart;