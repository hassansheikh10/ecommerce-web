const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SubCategory = sequelize.define("SubCategory", {
  name: { type: DataTypes.STRING, allowNull: false },
  categoryId: { type: DataTypes.INTEGER, allowNull: false },
});

// ASSOCIATION
SubCategory.associate = models => {
  SubCategory.belongsTo(models.Category, {
    foreignKey: "categoryId",
    as: "category",
  });
};

module.exports = SubCategory;
