const express = require("express");
const router = express.Router();
const subCategoryController = require("../controllers/subCategoryController");

router.post("/", subCategoryController.addSubCategory);
router.get("/", subCategoryController.getSubCategories);
router.get("/:categoryId", subCategoryController.getSubCategoriesByCategory);
router.put("/:id", subCategoryController.updateSubCategory);
router.delete("/:id", subCategoryController.deleteSubCategory);

module.exports = router;