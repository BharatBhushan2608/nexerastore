import { ShoppingCart } from "lucide-react";
import React from "react"; 
import { Button } from "@/components/ui/button";
import { Skeleton } from "./skeleton";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setCart } from "@/redux/productSlice";
import { Navigate, useNavigate } from "react-router-dom";


const ProductCard = ({ product , loading }) => {

  const { productImg, productPrice, productName } = product;
  const accessToken = localStorage.getItem('accessToken');
  const dispatch = useDispatch()
  const navigate = useNavigate() ;

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/cart/add`,{productId},{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
       })
        if(res.data.success) { 
          toast.success('Product added to cart')
          dispatch(setCart(res.data.cart))
        }
    } catch (error) {
      console.log(error)
      
    } 
  }

  return (
    <div className="shadow-lg rounded-lg overflow-hidden h-max">

      {/* Product Image */}
      <div className="w-full h-full aspect-square overflow-hidden">

        {
          loading ? <Skeleton className="w-full h-full rounded-lg" />:<img
          onClick={()=>navigate(`/products/${product._id}`)}
          src={productImg?.[0]?.url}
          alt={productName}
          className="w-full h-full transition-transform duration-300 hover:scale-105 cursor-pointer object-cover"
        />
        }

        
      </div>

      {/* Product Info */}

        {
          loading ? <div className="px-2 space-y-2 my-2">
            <Skeleton className='w-50 h-4' /> 
            <Skeleton className='w-25 h-4' /> 
            <Skeleton className='w-37.5 h-8' />
          </div> : <div className="px-2 space-y-1">
        <h1 className="font-semibold h-12 line-clamp-2">
          {productName}
        </h1>
        <h2 className="font-bold text-lg">
          ₹{productPrice}
        </h2>

        <Button onClick={() => (addToCart(product._id))} className="bg-pink-600 mb-3 w-full flex items-center justify-center gap-2">
          <ShoppingCart size={18} />
          Add to Cart
        </Button>
      </div>

        }

    </div>
  );
};



export default ProductCard