import Breadcrums from '@/components/ui/Breadcrums'
import ProductDesc from '@/components/ui/ProductDesc'
import ProductImg from '@/components/ui/ProductImg'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const SingleProduct = () => {

    const { id } = useParams();

    // get products from redux
    const { products } = useSelector((store) => store.product);

    // find current product
    const product = products.find((item) => item._id === id);

    // safety check
    if (!product) {
        return <div className="pt-20 text-center">Product not found</div>;
    }

    return (
        <div className="pt-20 py-10 max-w-7xl mx-auto">

            {/* Breadcrumb */}
            <Breadcrums product={product} />

            {/* Product Layout */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 items-start gap-10">

                {/* Left - Image */}
                <ProductImg  images={product.productImg} />

                {/* Right - Description */}
                <ProductDesc  product={product} />

            </div>
        </div>
    )
}

export default SingleProduct