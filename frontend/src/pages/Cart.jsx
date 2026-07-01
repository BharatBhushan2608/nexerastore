import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Trash2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import userlogo from '../assets/userlogo.jpg'
import axios from 'axios'
import { setCart } from '@/redux/productSlice'
import { toast } from 'sonner'

const Cart = () => {

    const { cart } = useSelector(store => store.product)
    console.log(cart)

    const subtotal = cart?.totalPrice
    const shipping = subtotal > 299 ? 0 : 10
    const tax = subtotal * 0.05 // 5% tax
    const total = subtotal + shipping + tax

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const API = `${import.meta.env.VITE_URL}/api/v1/cart`
    const accessToken = localStorage.getItem('accessToken');

    const handelUpdateQuantity = async (productId, type) => {
        try {
            const res = await axios.put(`${API}/update`, { productId, type }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res?.data?.success) {
                dispatch(setCart(res.data.cart))
            }

        } catch (error) {
            console.log(error)

            if (error.response) {
                console.log("Backend Error:", error.response.data);
            } else {
                console.log("Server not reachable");
            }

        }
    }

    const handelRemove = async (productId) => {
        try {
            const res = await axios.delete(`${API}/remove`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                data: { productId }
            })
            if (res?.data?.success) {
                dispatch(setCart(res.data.cart))
                toast.success('Product removed from cart')
            }
        } catch (error) {
            console.log(error)

        }
    }

    const loadCart = async () => {
        try {
            const res = await axios.get(API, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res.data.success) {
                dispatch(setCart(res.data.cart))
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadCart();
    }, [dispatch]);

    return (
        <div className="w-full min-h-screen bg-gray-50 pt-20">
            {cart?.items?.length > 0 ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-7">
                        Shopping Cart
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-7">
                        {/* LEFT SIDE */}
                        <div className="flex flex-col gap-5 flex-1 w-full">
                            {cart?.items?.map((product, index) => {
                                return (
                                    <Card key={index} className="w-full">
                                        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 p-4">
                                            {/* PRODUCT INFO */}
                                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-[360px]">
                                                <img
                                                    src={
                                                        product?.productId?.productImg?.[0]?.url ||
                                                        userlogo
                                                    }
                                                    alt=""
                                                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg"
                                                />

                                                <div className="w-full text-center sm:text-left">
                                                    <h1 className="font-semibold truncate">
                                                        {product?.productId?.productName}
                                                    </h1>
                                                    <p>
                                                        ₹{product?.productId?.productPrice}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* QUANTITY */}
                                            <div className="flex justify-center items-center gap-4 w-full lg:w-auto">
                                                <Button onClick={() => handelUpdateQuantity(product?.productId?._id, 'decrease')} variant="outline">-</Button>
                                                <span>{product?.quantity}</span>
                                                <Button onClick={() => handelUpdateQuantity(product?.productId?._id, 'increase')} variant="outline">+</Button>
                                            </div>

                                            {/* PRICE + REMOVE */}
                                            <div className="text-center lg:text-right">
                                                <p>
                                                    ₹
                                                    {product?.productId?.productPrice *
                                                        product?.quantity}
                                                </p>

                                                <p className="flex justify-center lg:justify-end text-red-500 items-center gap-1 cursor-pointer mt-2" onClick={() => handelRemove(product?.productId?._id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                    Remove
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* RIGHT SIDE (SUMMARY) */}
                        <div className="w-full lg:w-[420px]">
                            <Card className="w-full lg:w-[420px] lg:sticky lg:top-24">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center text-sm sm:text-base">
                                        <span>
                                            Subtotal ({cart?.items?.length} items)
                                        </span>
                                        <span>
                                            ₹{cart?.totalPrice?.toLocaleString("en-IN")}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>₹{shipping}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Tax (5%)</span>
                                        <span>₹{tax}</span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between items-center font-bold text-lg sm:text-xl">
                                        <span>Total</span>
                                        <span>₹{total}</span>
                                    </div>

                                    {/* PROMO */}
                                    <div className="space-y-3 pt-4">
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Input placeholder="Promo Code" />
                                            <Button 
                                                variant="outline"
                                                className="w-full sm:w-auto"
                                            >
                                                Apply
                                            </Button>
                                        </div>

                                        <Button
                                            onClick={() => navigate('/address')}
                                            className="w-full py-6 bg-pink-600 hover:bg-pink-700"
                                        >
                                            PLACE ORDER
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="w-full py-6  "
                                        >
                                            <Link to="/products">Continue Shopping</Link>
                                        </Button>
                                    </div>

                                    {/* INFO */}
                                    <div className="text-xs sm:text-sm text-muted-foreground pt-4 space-y-1">
                                        <p>• Free shipping on orders over ₹299</p>
                                        <p>• 30-days return policy</p>
                                        <p>• Secure checkout with SSL encryption</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">

                    {/* Icon */}
                    <div className="bg-pink-100 p-6 rounded-full">
                        <ShoppingCart className="w-16 h-16 text-pink-600" />
                    </div>

                    {/* Title */}
                    <h2 className="mt-6 text-2xl font-bold text-gray-800">
                        Your Cart is Empty
                    </h2>

                    {/* Subtitle */}
                    <p className="mt-2 text-gray-600">
                        Looks like you haven't added anything to your cart yet
                    </p>

                    {/* Button */}
                    <Button
                        onClick={() => navigate("/products")}
                        className="mt-6 bg-pink-600 text-white py-3 px-6 cursor-pointer hover:bg-pink-700"
                    >
                        Start Shopping
                    </Button>

                </div>
            )}
        </div>
    )
}

export default Cart