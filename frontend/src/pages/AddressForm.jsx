import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { addAddress, deleteAddress, setCart, setSelectedAddress } from '@/redux/productSlice'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const AddressForm = () => {


  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  })

  const { cart, addresses, selectedAddress } = useSelector((store) => store.product)

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [showForm, setShowForm] = useState(
    addresses?.length > 0 ? false : true
  )

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }


  const handelSave = () => {
    dispatch(addAddress(formData))
    setShowForm(false);
  }

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;

  const handlePayment = async () => {
    const accessToken = localStorage.getItem("accessToken");

    // ✅ Validate Razorpay Key
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey || razorpayKey === "" || razorpayKey.includes("your_razorpay")) {
      toast.error("❌ Razorpay key not configured. Please check your .env.local file");
      console.error("❌ VITE_RAZORPAY_KEY_ID is not properly configured");
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/orders/create-order`,
        {
          products: cart?.items?.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.price

          })),
          tax,
          shipping,
          amount: total,
          currency: "INR",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!data.success) {
        return toast.error("Something went wrong");
      }

      console.log("Razorpay data:", data);
      console.log("✅ Using Razorpay Key:", razorpayKey.substring(0, 10) + "...");

      const options = {
        key: razorpayKey,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id, // Order ID from backend
        name: "Bharat-Online-Shopping",
        description: "Order Payment",

        handler: async function (response) {
          //console.log(response)
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
              response,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            // // both are same  suggested code 
            // const verifyRes = await axios.post(
            //   `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
            //   {
            //     razorpay_order_id: response.razorpay_order_id,
            //     razorpay_payment_id: response.razorpay_payment_id,
            //     razorpay_signature: response.razorpay_signature,
            //   },
            //   {
            //     headers: {
            //       Authorization: `Bearer ${accessToken}`,
            //     },
            //   }
            // );

            if (verifyRes.data.success) {
              toast.success("✅ Payment Successfull!");

              dispatch(
                setCart({
                  items: [],
                  totalPrice: 0,
                })
              );

              navigate("/order-success");

            } else {
              toast.error("❌ Payment Verification Failed");
            }

          } catch (error) {
            console.log("Checking verify: ", error)
            toast.error("Error verifying payment");
          }
        },
        modal: {
          ondismiss: async function () {

            // Handle user closing the popup
            await axios.post(
              `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
              {
                razorpay_order_id: data.order.id,
                paymentFailed: true,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            toast.error("Payment Cancelled or Failed");
          },
        },

        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: "#F47286" }
      };

      const rzp = new window.Razorpay(options)


      // Listen for payment failures 
      rzp.on("payment.failed", async function (response) {
        await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`, {
          razorpay_order_id: data.order.id,
          paymentFailed: true,
        }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        toast.error("Payment Failed. please try again")
      })

      rzp.open()

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while processing payment")
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-6">

        {/* Left Section */}
        <div className="space-y-4 p-4 sm:p-6 bg-white rounded-lg shadow-sm w-full">

          {
            showForm ? (
              <>

                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName">
                    Full Name
                  </Label>

                  <Input
                    id="fullName"
                    name="fullName"
                    required
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">
                    Phone Number
                  </Label>

                  <Input
                    id="phone"
                    name="phone"
                    required
                    placeholder="+91 987654321"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">
                    Email
                  </Label>

                  <Input
                    id="email"
                    name="email"
                    required
                    placeholder="john@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="address">
                    Address
                  </Label>

                  <Input
                    id="address"
                    name="address"
                    required
                    placeholder="Enter Address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                {/* City */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor="city">
                      City
                    </Label>

                    <Input
                      id="city"
                      name="city"
                      required
                      placeholder="Enter City"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>

                  {/* State */}
                  <div>
                    <Label htmlFor="state">
                      State
                    </Label>

                    <Input
                      id="state"
                      name="state"
                      required
                      placeholder="Enter State"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Zip */}
                  <div>
                    <Label htmlFor="zip">
                      Zip Code
                    </Label>

                    <Input
                      id="zip"
                      name="zip"
                      required
                      placeholder="Zip Code"
                      value={formData.zip}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <Label htmlFor="country">
                      Country
                    </Label>

                    <Input
                      id="country"
                      name="country"
                      required
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <Button onClick={handelSave} className='w-full'>Save & Continue </Button>

              </>
            ) : (
              <div className="space-y-4 w-full">
                <h2 className='text-lg font-semibold'>Saved Addresses</h2>

                {
                  addresses.map((addr, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => dispatch(setSelectedAddress(index))}
                        className={`border p-4 rounded-lg cursor-pointer relative transition-all duration-200 ${selectedAddress === index
                          ? "border-pink-600 bg-pink-50"
                          : "border-gray-300"
                          }`}
                      >
                        <p className='font-medium'>{addr.fullName}</p>
                        <p>{addr.phone}</p>
                        <p>{addr.email}</p>
                        <p className="text-sm text-gray-600 break-words">
                          {addr.address}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
                        </p>

                        <button
                          onClick={(e) => dispatch(deleteAddress(index))}
                          className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )
                  })
                }
                <Button
                  variant='outline'
                  className="w-full py-5"
                  onClick={() => setShowForm(true)}
                >
                  + Add New Address
                </Button>
                <Button
                  className="w-full py-5 bg-pink-600 hover:bg-pink-700"
                  disabled={selectedAddress === null}
                  onClick={handlePayment}
                >
                  Proceed To Checkout
                </Button>
              </div>
            )
          }

        </div>

        {/* Right Side Order Summary */}
        <div className="w-full">
          <Card className="w-full lg:max-w-md lg:sticky lg:top-24 shadow-md">

            <CardHeader>
              <CardTitle className="text-xl">
                Order Summary
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="flex justify-between items-center text-sm sm:text-base">
                <span>
                  Subtotal ({cart.items.length}) items
                </span>

                <span>
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm sm:text-base">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>

              <div className="flex justify-between items-center text-sm sm:text-base">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center font-bold text-lg sm:text-xl">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <div className="text-xs sm:text-sm text-muted-foreground pt-4 space-y-2">
                <p>• Free shipping on orders over ₹299</p>
                <p>• 30-days return policy</p>
                <p>• Secure checkout with SSL encryption</p>
              </div>

            </CardContent>

          </Card>
        </div>

      </div>

    </div>


  )
}



export default AddressForm