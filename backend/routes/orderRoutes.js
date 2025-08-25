const express = require("express");
const { placeOrder, getOrders, getAllOrders } = require("../controllers/orderController");

const router = express.Router();

router.post("/place", placeOrder);
router.get("/user/:userId", getOrders);
router.get("/admin/all", getAllOrders);

module.exports = router;