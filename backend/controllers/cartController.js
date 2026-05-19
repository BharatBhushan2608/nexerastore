import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

// ✅ Get Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: [],
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ Add to Cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    // 🔍 Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 🔍 Find user's cart
    let cart = await Cart.findOne({ userId });

    // 🆕 If cart doesn't exist → create new
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity: 1,
            price: product.productPrice,
          },
        ],
        totalPrice: product.productPrice,
      });

    } else {
      // 🔁 Check if product already exists in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // 👉 Product exists → increase quantity
        cart.items[itemIndex].quantity += 1;

      } else {
        // 👉 New product → add to cart
        cart.items.push({
          productId,
          quantity: 1,
          price: product.productPrice,
        });
      }

      // 💰 Recalculate total price
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    }

    // 💾 Save cart
    await cart.save();

    // 🔄 Populate before sending response
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId"
    );

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: populatedCart,
    });

  } catch (error) {
    console.log("Add To Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, type } = req.body;

    // 🔍 Find user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // 🔍 Find item in cart
    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // 🔄 Update quantity
    if (type === "increase") {
      item.quantity += 1;
    }

    if (type === "decrease" && item.quantity > 1) {
      item.quantity -= 1;
    }

    // 💰 Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // 💾 Save cart
    await cart.save();

    // 🔄 Populate before sending response
    cart = await cart.populate("items.productId");

    return res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {
    console.log("Update Quantity Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    // 🔍 Find user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // ❌ Remove item from cart
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    // 💰 Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // 💾 Save cart
    await cart.save();

    // 🔄 Populate before sending response
    cart = await cart.populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });

  } catch (error) {
    console.log("Remove From Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};