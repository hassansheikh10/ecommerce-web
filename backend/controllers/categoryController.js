const { Category, SubCategory } = require("../models");

// Add
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.json({ message: "Category added", category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCategoriesWithSubcategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { parentId: null }, // sirf top-level categories
      include: [
        {
          model: SubCategory,
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: SubCategory,
          as: "subcategories",
        }
      ]
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    await Category.update({ name }, { where: { id } });
    res.json({ message: "Category updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.destroy({ where: { id } });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};