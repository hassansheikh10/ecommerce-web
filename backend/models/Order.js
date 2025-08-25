const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define("Order", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  deliveryCharges: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  gstAmount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  grandTotal: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: "Pending" }
});

// ✅ Add this association here
Order.associate = (models) => {
  Order.hasMany(models.OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" });
};

module.exports = Order;