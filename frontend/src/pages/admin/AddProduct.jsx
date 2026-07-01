// import React, { useState } from 'react'
// import { toast } from 'sonner'
// import axios from 'axios'
// import { useDispatch, useSelector } from 'react-redux'
// import { Label } from '@/components/ui/label'
// import ImageUpload from '@/components/ui/ImageUpload'
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Textarea } from '@/components/ui/textarea'
// import { setProducts } from '@/redux/productSlice'
// import { Loader2 } from 'lucide-react'
// import { Input } from '@/components/ui/input'

// const AddProduct = () => {

//     const accessToken = localStorage.getItem("accessToken");
//     const dispatch = useDispatch();
//     const products = useSelector((store) => store.product);
//     const [loading, setLoading] = useState(false);
//     const [productData, setProductData] = useState({
//         productName: "",
//         productDesc: "",
//         productPrice: 0,
//         productImg: [],
//         brand: "",
//         category: "",
//     })
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setProductData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     }

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append("productName", productData.productName);
//         formData.append("productDesc", productData.productDesc);
//         formData.append("productPrice", productData.productPrice);
//         formData.append("brand", productData.brand);
//         formData.append("category", productData.category);

//         if (productData.productImg.length === 0) {
//             toast.error("Please select at least one image");
//             return;
//         }
//         productData.productImg.forEach((img) => {
//             formData.append("files", img);
//         });
//         try {
//             setLoading(true);
//             const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/product/add`, formData, {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`
//                 }
//             })
//             if (res.data.success) {
//                 dispatch(setProducts([...(products.products || []), res.data.product]))
//                 toast.success(res.data.message)

//             }
//         } catch (error) {
//             console.log(error)
//         }
//         finally {
//             setLoading(false)
//         }
//     }

    

//     return (
//         <div className='pl-87.5 py-10 pr-20 mx-auto px-4 bg-gray-100'>

//             <Card className='w-full my-20'>
//                 <CardHeader>
//                     <CardTitle>Add Product</CardTitle>
//                     <CardDescription>
//                         Enter Product details below
//                     </CardDescription>
//                 </CardHeader>

//                 <CardContent>
//                     <div className='flex flex-col gap-2'>

//                         {/* Product Name */}
//                         <div className='grid gap-2'>
//                             <Label>Product Name</Label>
//                             <Input
//                                 type='text'
//                                 name='productName'
//                                 value={productData.productName}
//                                 onChange={handleChange}
//                                 placeholder='Ex-Iphone'
//                                 required
//                             />
//                         </div>

//                         {/* Price */}
//                         <div className='grid gap-2'>
//                             <Label>Price</Label>
//                             <Input
//                                 type='number'
//                                 name='productPrice'
//                                 value={productData.productPrice}
//                                 onChange={handleChange}
//                                 placeholder=''
//                                 required
//                             />
//                         </div>

//                         {/* Brand & Category */}
//                         <div className='grid grid-cols-2 gap-4'>

//                             <div className='grid gap-2'>
//                                 <Label>Brand</Label>
//                                 <Input
//                                     type='text'
//                                     name='brand'
//                                     value={productData.brand}
//                                     onChange={handleChange}
//                                     placeholder='Ex-apple'
//                                     required
//                                 />
//                             </div>

//                             <div className='grid gap-2'>
//                                 <Label>Category</Label>
//                                 <Input
//                                     type='text'
//                                     name='category'
//                                     value={productData.category}
//                                     onChange={handleChange}
//                                     placeholder='Ex-mobile'
//                                     required
//                                 />
//                             </div>

//                         </div>

//                         {/* Description */}
//                         <div className='grid gap-2'>
//                             <div className='flex items-center'>
//                                 <Label>Description</Label>
//                             </div>

//                             <Textarea
//                                 name='productDesc'
//                                 placeholder='Enter brief description of product'
//                                 className='border p-2 rounded-md'
//                                 value={productData.productDesc}
//                                 onChange={handleChange}
//                             />
//                         </div>
//                         {/* Image Upload */}
//                         <ImageUpload productData={productData} setProductData={setProductData} />
//                     </div>

//                     <CardFooter className='flex-col gap-2'>
//                         <Button
//                             onClick={submitHandler}
//                             className='w-full bg-pink-600 cursor-pointer'
//                             type='submit'
//                             disabled={loading}
//                         >
//                             {
//                                 loading ? <span className='flex gap-1 items-center'><Loader2 className='animate-spin' />Please Wait </span> : "Add Product"
//                             }
//                         </Button>
//                     </CardFooter>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }

// export default AddProduct




import React, { useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { Label } from '@/components/ui/label'
import ImageUpload from '@/components/ui/ImageUpload'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { setProducts } from '@/redux/productSlice'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

const AddProduct = () => {

    const accessToken = localStorage.getItem("accessToken");
    const dispatch = useDispatch();
    const products = useSelector((store) => store.product);

    const [loading, setLoading] = useState(false);

    const [productData, setProductData] = useState({
        productName: "",
        productDesc: "",
        productPrice: 0,
        productImg: [],
        brand: "",
        category: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("productName", productData.productName);
        formData.append("productDesc", productData.productDesc);
        formData.append("productPrice", productData.productPrice);
        formData.append("brand", productData.brand);
        formData.append("category", productData.category);

        if (productData.productImg.length === 0) {
            toast.error("Please select at least one image");
            return;
        }

        productData.productImg.forEach((img) => {
            formData.append("files", img);
        });

        try {
            setLoading(true);

            const res = await axios.post(
                `${import.meta.env.VITE_URL}/api/v1/product/add`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (res.data.success) {
                dispatch(
                    setProducts([
                        ...(products.products || []),
                        res.data.product,
                    ])
                );

                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="w-full bg-gray-100 min-h-screen p-1 sm:p-6 lg:p-8">

            <Card className="w-full max-w-5xl mx-auto mt-16 lg:mt-10 shadow-lg">

                <CardHeader>
                    <CardTitle className="text-2xl">
                        Add Product
                    </CardTitle>

                    <CardDescription>
                        Enter Product details below
                    </CardDescription>
                </CardHeader>

                <CardContent>

                    <div className="flex flex-col gap-5">

                        {/* Product Name */}

                        <div className="grid gap-2">
                            <Label>Product Name</Label>

                            <Input
                                type="text"
                                name="productName"
                                value={productData.productName}
                                onChange={handleChange}
                                placeholder="Ex-Iphone"
                                required
                            />
                        </div>

                        {/* Price */}

                        <div className="grid gap-2">
                            <Label>Price</Label>

                            <Input
                                type="number"
                                name="productPrice"
                                value={productData.productPrice}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Brand + Category */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="grid gap-2">
                                <Label>Brand</Label>

                                <Input
                                    type="text"
                                    name="brand"
                                    value={productData.brand}
                                    onChange={handleChange}
                                    placeholder="Ex-Apple"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Category</Label>

                                <Input
                                    type="text"
                                    name="category"
                                    value={productData.category}
                                    onChange={handleChange}
                                    placeholder="Ex-Mobile"
                                    required
                                />
                            </div>

                        </div>

                        {/* Description */}

                        <div className="grid gap-2">

                            <Label>Description</Label>

                            <Textarea
                                name="productDesc"
                                value={productData.productDesc}
                                onChange={handleChange}
                                placeholder="Enter brief description of product"
                                className="min-h-[120px]"
                            />

                        </div>

                        {/* Images */}

                        <ImageUpload
                            productData={productData}
                            setProductData={setProductData}
                        />

                    </div>

                </CardContent>

                <CardFooter>

                    <Button
                        className="w-full bg-pink-600 hover:bg-pink-700"
                        onClick={submitHandler}
                        disabled={loading}
                    >
                        {
                            loading
                                ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        Please Wait...
                                    </span>
                                )
                                : "Add Product"
                        }

                    </Button>

                </CardFooter>

            </Card>

        </div>
    );
};

export default AddProduct;