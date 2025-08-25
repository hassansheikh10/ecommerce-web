const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.placeOrder = async (req, res) => {
  try {
    const { userId, totalPrice, deliveryCharges, gstAmount, grandTotal } = req.body;

    const cartItems = await Cart.findAll({ where: { userId }, include: [Product] });

    if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });

    // Create Order with frontend values
    const order = await Order.create({
      userId,
      totalPrice,
      deliveryCharges,
      gstAmount,
      grandTotal
    });

    // Create Order Items
    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price
      });

      // Update stock
      item.Product.quantity -= item.quantity;
      await item.Product.save();

      // Remove from Cart
      await item.destroy();
    }

    res.json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, include: [Product] }]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, include: [Product] }]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};