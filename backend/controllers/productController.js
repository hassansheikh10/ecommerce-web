const Product = require("../models/Product");

exports.addProduct = async (req, res) => {
    try {
        console.log("Files received:", req.files);  // check filenames here

        const {
            name, description, price, size, categoryId, subCategoryId,
            quantity, discount, brand,
        } = req.body;

        const images = req.files ? req.files.map((file) => file.savedFilename) : [];

        console.log("Images to save:", images);

        const product = await Product.create({
            name,
            description,
            price,
            size,
            categoryId,
            subCategoryId,
            quantity,
            discount,
            brand,
            images,
        });

        res.json({ message: "✅ Product added", product });
    } catch (err) {
        console.error("Add Product Error:", err);
        res.status(500).json({ error: err.message });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, size, category, quantity, discount, brand } = req.body;
        const image = req.file ? req.file.filename : null;

        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await product.update({
            name,
            description,
            price,
            size,
            category,
            quantity,
            discount,
            brand,
            ...(image && { image })
        });

        res.json({ message: 'Product updated', product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { category, subcategory } = req.params;
        const { Category, SubCategory } = require("../models");

        const categoryRecord = await Category.findOne({ where: { name: category } });
        if (!categoryRecord) return res.status(404).json({ message: "Category not found" });

        let whereClause = { categoryId: categoryRecord.id };

        if (subcategory) {
            const subCategoryRecord = await SubCategory.findOne({
                where: { name: subcategory, categoryId: categoryRecord.id }
            });
            if (!subCategoryRecord) return res.status(404).json({ message: "Subcategory not found" });

            whereClause.subCategoryId = subCategoryRecord.id;
        }

        const products = await Product.findAll({ where: whereClause });
        res.json(products);
    } catch (err) {
        console.error("getProductsByCategory error:", err); // error log
        res.status(500).json({ error: err.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.destroy({ where: { id: req.params.id } });
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};