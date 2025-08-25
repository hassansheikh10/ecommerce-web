const { SubCategory } = require("../models");

// Add
exports.addSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const subCategory = await SubCategory.create({ name, categoryId });
    res.json({ message: "SubCategory added", subCategory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.findAll();
    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get By Category
exports.getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subCategories = await SubCategory.findAll({ where: { categoryId } });
    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId } = req.body;

    await SubCategory.update({ name, categoryId }, { where: { id } });
    res.json({ message: "SubCategory updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await SubCategory.destroy({ where: { id } });
    res.json({ message: "SubCategory deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
