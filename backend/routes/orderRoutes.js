const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Place an order (login required)
router.post("/", protect, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const a = shippingAddress || {};
    if (!a.fullName || !a.phone || !a.address || !a.city || !a.pincode) {
      return res
        .status(400)
        .json({ message: "Please fill in all delivery details" });
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(400)
          .json({ message: "A product in your cart no longer exists" });
      }

      const qty = Number(item.qty);
      if (!Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      if (product.stock < qty) {
        return res
          .status(400)
          .json({ message: "Not enough stock for " + product.name });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        qty,
      });
      total += product.price * qty;
    }

    for (const oi of orderItems) {
      await Product.findByIdAndUpdate(oi.product, {
        $inc: { stock: -oi.qty },
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress: a,
      totalPrice: total,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my orders (login required)
router.get("/mine", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;