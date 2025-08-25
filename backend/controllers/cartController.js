const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // ✅ Product Exist Check
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ Cart Table me User ke liye check karo
    let cartItem = await Cart.findOne({ where: { userId, productId } });

    if (cartItem) {
      // Quantity update
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Naya record
      cartItem = await Cart.create({ userId, productId, quantity });
    }

    res.json({ success: true, message: "Added to cart", data: cartItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findAll({
      where: { userId },
      include: [{ model: Product }], 
    });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    await Cart.destroy({ where: { id: req.params.id } });
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};