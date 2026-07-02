import razorpayInstance from "../config/razorpay.js";
import { Order } from "../models/orderModel.js";
import { Cart } from "../models/cartModel.js"
import crypto from "crypto"
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";

export const createOrder = async (req, res) => {
    try {
        // ✅ Validate Razorpay Configuration
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
            console.error("❌ Razorpay keys not configured in environment variables");
            return res.status(500).json({
                success: false,
                message: "Payment gateway not configured. Please contact support.",
                details: "Missing RAZORPAY_KEY_ID or RAZORPAY_SECRET"
            });
        }

        console.log("📨 REQUEST BODY:", req.body)
        console.log("👤 USER:", req.user?.email)
        console.log("🔑 RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID?.substring(0, 10) + "...")

        const { products, amount, tax, shipping, currency } = req.body;
        
        // Validate required fields
        if (!products || !amount) {
            console.error("❌ Missing required fields: products or amount");
            return res.status(400).json({
                success: false,
                message: "Missing required fields: products and amount"
            });
        }

        const options = {
            amount: Math.round(Number(amount) * 100), // convert to paise
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`
        }

        console.log("📦 Creating Razorpay order with options:", options);
        console.log("📦 Amount in paise:", options.amount);
        const razorpayOrder = await razorpayInstance.orders.create(options)
        console.log("✅ Razorpay order created:", razorpayOrder.id);

        //save order in DB
        const newOrder = new Order({
            user: req.user._id,
            products,
            amount,
            tax,
            shipping,
            currency,
            status: "pending",
            razorpayOrderId: razorpayOrder.id
        })

        await newOrder.save()

        res.json({
            success: true,
            order: razorpayOrder,
            dbOrder: newOrder
        })


    } catch (error) {
        console.error("❌❌❌ ERROR IN CREATE ORDER ❌❌❌");
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
        console.error("Full Error:", error);
        
        // ✅ Better error messages for common issues
        let errorMessage = error.message || error.error?.description || "Unknown error";
        
        // Check for Razorpay authentication error
        if (error.statusCode === 401 || error.error?.code === "BAD_REQUEST_ERROR") {
            errorMessage = "❌ Razorpay authentication failed. Your API keys are invalid or don't match.";
        } else if (errorMessage && errorMessage.includes("Invalid API key")) {
            errorMessage = "Invalid Razorpay API key. Please check your credentials.";
        } else if (errorMessage && errorMessage.includes("Unauthorized")) {
            errorMessage = "Razorpay authentication failed. Invalid credentials.";
        } else if (errorMessage && errorMessage.includes("ECONNREFUSED")) {
            errorMessage = "Cannot connect to Razorpay. Check your internet connection.";
        } else if (errorMessage && errorMessage.includes("Cast to ObjectId failed")) {
            errorMessage = "Invalid user ID. Please login again.";
        } else if (errorMessage && errorMessage.includes("ValidationError")) {
            errorMessage = "Invalid order data. Please check your cart items.";
        }
        
        res
            .status(500)
            .json({
                success: false,
                message: errorMessage,
                error: error.message
            })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            paymentFailed,
        } = req.body;
        const userId = req.user._id;

        // ❌ If payment failed
        if (paymentFailed) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "failed" },
                { new: true }
            );

            return res.status(400).json({
                success: false,
                message: "Payment failed",
                order,
            });
        }

        // ✅ Verify signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");

        // ✅ If signature matched
        if (expectedSignature === razorpay_signature) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    status: "paid",
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                },
                { new: true }
            );

            // 🛒 Clear cart after successful payment
            await Cart.findOneAndUpdate(
                { userId },
                { $set: { items: [], totalPrice: 0 } }
            );

            return res.json({
                success: true,
                message: "Payment Successful",
                order,
            });

        } else {
            // ❌ Invalid signature
            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "failed" },
                { new: true }
            );

            return res.status(400).json({
                success: false,
                message: "Invalid Signature",
            });
        }

    } catch (error) {
        console.error("❌ Error in verify Payment:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getMyOrder = async (req, res) => {
    try {

        const userId = req.id;

        const orders = await Order.find({ user: userId })
            .populate({
                path: "products.productId",
                select: "productName productPrice productImg"
            })
            .populate("user", "firstName lastName email");

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });

    } catch (error) {

        console.error("Error fetching user orders:", error);

        res.status(500).json({
            message: error.message
        });

    }
}

// Admin Onlyyy

export const getUserOrders = async (req, res) => {

    try {
        ///console.log(req.params)

        const { userId } = req.params; // userId will come from URL

        const orders = await Order.find({ user: userId })

            .populate({
                path: "products.productId",
                select: "productName productPrice productImg"
            }) // fetch product details

            .populate(
                "user",
                "firstName lastName email"
            ); // fetch user info

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        console.log("Error fetching user order: ", error);

        res.status(500).json({
            message: error.message
        });
    }
}


export const getAllOrdersAdmin = async (req, res) => {

    try {

        const orders = await Order.find()

            .sort({ createdAt: -1 })

            .populate(
                "user",
                "name email"
            ) // populate user info

            .populate(
                "products.productId",
                "productName productPrice"
            ) // populate product info

        res.json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch all orders",
            error: error.message
        });

    }

}


export const getSalesData = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments({});
        const totalProducts = await Product.countDocuments({});
        const totalOrders = await Order.countDocuments({
            status: "paid"
        });

        // Total sales amount
        const totalSaleAgg = await Order.aggregate([

            {
                $match: {
                    status: "paid"
                }
            },

            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount"
                    }
                }
            }

        ]);

        const totalSales = totalSaleAgg[0]?.total || 0;

        // Sales grouped by date (last 30 days)

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const salesByDate = await Order.aggregate([

            {
                $match: {
                    status: "paid",
                    createdAt: {
                        $gte: thirtyDaysAgo
                    }
                }
            },

            {
                $group: {

                    _id: {

                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }

                    },

                    amount: {
                        $sum: "$amount"
                    }

                }

            },

            {
                $sort: {
                    _id: 1
                }
            }

        ]);

        console.log(salesByDate);

        const formattedSales = salesByDate.map((item) => ({

            date: item._id,
            amount: item.amount

        }));

        console.log(formattedSales);

        res.json({

            success: true,
            totalUsers,
            totalProducts,
            totalOrders,
            totalSales,
            sales: formattedSales

        });

    } catch (error) {

        console.error("Error fetching sales data:", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}