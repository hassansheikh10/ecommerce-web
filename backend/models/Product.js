const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("Product", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
  size: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  discount: { type: DataTypes.FLOAT, defaultValue: 0 },
  brand: { type: DataTypes.STRING, allowNull: true },
  images: { type: DataTypes.JSON, allowNull: true}, 
  categoryId: { type: DataTypes.INTEGER, allowNull: false },
  subCategoryId: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Product;