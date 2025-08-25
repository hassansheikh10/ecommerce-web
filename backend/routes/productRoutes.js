const express = require("express");
const { upload, compressAndSave } = require("../middlewares/upload-temp");
const productController = require("../controllers/productController");

const router = express.Router();


router.get('/category/:category', productController.getProductsByCategory);
router.get('/category/:category/:subcategory', productController.getProductsByCategory); 
// router.post('/', upload.array("images", 5), compressAndSave, productController.addProduct);
router.post('/', upload.array("images", 5), compressAndSave, productController.addProduct);

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.delete('/:id', productController.deleteProduct);
router.put('/:id', upload.array("images", 5), productController.updateProduct);



module.exports = router;