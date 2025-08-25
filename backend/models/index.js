const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.Product = require("./Product");
db.Cart = require("./Cart");
db.Order = require("./Order");
db.OrderItem = require("./OrderItem");
db.Category = require("./Category");
db.SubCategory = require("./SubCategory");

// Associations

// Cart belongs to Product
db.Cart.belongsTo(db.Product, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});

// Order has many OrderItems
db.Order.hasMany(db.OrderItem, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
});
db.OrderItem.belongsTo(db.Order, {
  foreignKey: "orderId",
});
db.OrderItem.belongsTo(db.Product, {
  foreignKey: "productId",
});

// Category has many SubCategories
db.Category.hasMany(db.SubCategory, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});
db.SubCategory.belongsTo(db.Category, {
  foreignKey: "categoryId",
});

// SubCategory has many Products
db.SubCategory.hasMany(db.Product, {
  foreignKey: "subCategoryId",
  onDelete: "CASCADE",
});
db.Product.belongsTo(db.SubCategory, {
  foreignKey: "subCategoryId",
});

// Optional: Category hierarchy (parent-child)
db.Category.hasMany(db.Category, {
  as: "children", // alias changed from "subcategories" to "children"
  foreignKey: "parentId",
});
db.Category.belongsTo(db.Category, {
  as: "parent",
  foreignKey: "parentId",
});

module.exports = db;
