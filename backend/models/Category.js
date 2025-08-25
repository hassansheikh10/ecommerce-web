const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define("Category", {
  name: { type: DataTypes.STRING, allowNull: false },
});

// ASSOCIATION
Category.associate = models => {
  Category.hasMany(models.SubCategory, {
    foreignKey: "categoryId",
    as: "subcategories",
    onDelete: "CASCADE",
  });
};

module.exports = Category;
