// import React, { useState } from 'react'
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"

// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
//     DialogTrigger,
//     DialogFooter,
//     DialogClose,
// } from "@/components/ui/dialog"
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import ImageUpload from '@/components/ui/ImageUpload'
// import { Button } from '@/components/ui/button'
// import { useSelector, useDispatch } from 'react-redux'
// import { Card } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
// import { Edit, Search, Trash2 } from 'lucide-react'
// import axios from 'axios'
// import { toast } from 'sonner'
// import { setProducts } from '@/redux/productSlice'



// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"




// const AdminProduct = () => {
//     const { products } = useSelector((store) => store.product);
//     const [editProduct, setEditProduct] = useState(null);
//     const [open, setOpen] = useState(false)
//     const [searchTerm, setSearchTerm] = useState("");
//     const [sortOrder, setSortOrder] = useState("");
//     const dispatch = useDispatch();
//     const accessToken = localStorage.getItem("accessToken");


//     let filteredProducts = products.filter((product) => 
//         product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             product.category.toLowerCase().includes(searchTerm.toLowerCase())
//     )

//     if(sortOrder === "lowToHigh"){
//         filteredProducts = [...filteredProducts].sort((a, b) => a.productPrice - b.productPrice)
//     }
//     if(sortOrder === "highToLow"){
//         filteredProducts = [...filteredProducts].sort((a, b) => b.productPrice - a.productPrice)
//     }

//     const handelChange = (e) => {
//         const { name, value } = e.target;
//         setEditProduct((prev) => ({
//             ...prev,
//             [name]: value,
//         }))
//     }

//     const handelSave = async (e) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append("productName", editProduct.productName);
//         formData.append("productDesc", editProduct.productDesc);
//         formData.append("productPrice", editProduct.productPrice);
//         formData.append("brand", editProduct.brand);
//         formData.append("category", editProduct.category);

//         // add exixting images public_ids
//         const exisitingImages = editProduct.productImg
//             .filter(img => !(img instanceof File) && img.public_id)
//             .map((img) => img.public_id);
//         formData.append("existingImages", JSON.stringify(exisitingImages));

//         // add new images
//         editProduct.productImg
//             .filter(img => img instanceof File)
//             .forEach((file) => {
//                 formData.append("files", file);
//             });

//         try {
//             const res = await axios.put(`${import.meta.env.VITE_URL}/api/v1/product/update/${editProduct._id}`, formData, {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`
//                 }
//             })
//             if (res.data.success) {
//                 toast.success("Product updated successfully");
//                 const updatedProducts = products.map((p) => p._id === editProduct._id ? res.data.product : p);
//                 dispatch(setProducts(updatedProducts));
//                 setOpen(false);
//                 //setEditProduct(null);
//             }

//         } catch (error) {
//             console.log(error)

//         }
//     }


//     const deleteProductHandeler = async (productId) => {
//         try {
//             const remainingProducts = products.filter((product) => product._id !== productId)
//             const res = await axios.delete(`${import.meta.env.VITE_URL}/api/v1/product/delete/${productId}`, {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`
//                 }
//             })
//             if (res.data.success) {
//                 toast.success(res.data.message)
//                 dispatch(setProducts(remainingProducts))
//             }
//         } catch (error) {
//             console.log(error)

//         }
//     }


//     return (
//         <div className="pl-87.5 py-20 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100">
//             <div className="flex justify-between">
//                 <div className="relative bg-white rounded-lg">
//                     <Input
//                         type="text"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         placeholder="Search Product..."
//                         className="w-100 items-center"
//                     />
//                     <Search
//                         className='absolute right-3 top-1.5 text-gray-500' />
//                 </div>
//                 <Select onValueChange={(value) => setSortOrder(value)}>
//                     <SelectTrigger className="w-50 bg-white">
//                         <SelectValue placeholder="Sort by Price" />
//                     </SelectTrigger>

//                     <SelectContent>
//                         <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
//                         <SelectItem value="highToLow">Price: High to Low</SelectItem>
//                     </SelectContent>
//                 </Select>
//             </div>
//             {
//                 filteredProducts.map((product, index) => {
//                     return <Card key={index} className="px-4">
//                         <div className="flex items-center justify-between">
//                             <div className="flex gap-2 items-center">
//                                 <img
//                                     src={product.productImg[0].url}
//                                     alt=""
//                                     className="w-25 h-25"
//                                 />
//                                 <h1 className="font-bold w-96 text-gray-700">
//                                     {product.productName}
//                                 </h1>
//                             </div>
//                             {/* Price */}
//                             <h1 className="font-semibold text-gray-800">
//                                 ₹{product.productPrice}
//                             </h1>
//                             <div className="flex gap-4">
//                                 <Dialog open={open} onOpenChange={setOpen}>
//                                     <DialogTrigger asChild>
//                                         <Edit
//                                             onClick={() => { setOpen(true), setEditProduct(product) }} className='text-blue-500 cursor-pointer' />
//                                     </DialogTrigger>
//                                     <DialogContent className="sm:max-w-156.25 max-h-185 overflow-y-scroll">
//                                         <DialogHeader>
//                                             <DialogTitle>Edit profile</DialogTitle>
//                                             <DialogDescription>
//                                                 Make changes to your product here. Click save when you&apos;re
//                                                 done.
//                                             </DialogDescription>
//                                         </DialogHeader>
//                                         <div className="flex flex-col gap-2">

//                                             <div className="grid gap-2">
//                                                 <Label htmlFor="name-1">Product Name</Label>
//                                                 <Input
//                                                     type="text"
//                                                     value={editProduct?.productName}
//                                                     onChange={handelChange}
//                                                     name="productName" placeholder="EX-Iphone"
//                                                     required
//                                                 />
//                                             </div>

//                                             <div className="grid gap-2">
//                                                 <Label>Price</Label>
//                                                 <Input
//                                                     type="number"
//                                                     value={editProduct?.productPrice}
//                                                     onChange={handelChange}
//                                                     name="productPrice" required />
//                                             </div>

//                                             <div className="grid grid-cols-2 gap-4">

//                                                 <div className="grid gap-2">
//                                                     <Label>Brand</Label>
//                                                     <Input type="text"
//                                                         value={editProduct?.brand}
//                                                         onChange={handelChange}
//                                                         name="brand" placeholder="Ex-apple" required />
//                                                 </div>

//                                                 <div className="grid gap-2">
//                                                     <Label>Category</Label>
//                                                     <Input type="text"
//                                                         value={editProduct?.category}
//                                                         onChange={handelChange}
//                                                         name="category" placeholder="Ex-mobile" required />
//                                                 </div>
//                                             </div>
//                                             <div className="grid gap-2">
//                                                 <div className="flex items-center">
//                                                     <Label>Description</Label>
//                                                 </div>

//                                                 <Textarea
//                                                     name="productDesc"
//                                                     value={editProduct?.productDesc}
//                                                     onChange={handelChange}
//                                                     placeholder="Enter brief description of product"
//                                                     className="border p-2 rounded-md"
//                                                 />
//                                             </div>

//                                             {/* Image Upload */}
//                                             <ImageUpload productData={editProduct}
//                                                 setProductData={setEditProduct} />

//                                         </div>
//                                         <DialogFooter>
//                                             <DialogClose asChild>
//                                                 <Button variant="outline">Cancel</Button>
//                                             </DialogClose>
//                                             <Button
//                                                 onClick={handelSave}
//                                                 type="submit">Save changes</Button>
//                                         </DialogFooter>
//                                     </DialogContent>

//                                 </Dialog>

//                                 <AlertDialog>
//                                     <AlertDialogTrigger  >
//                                         <Trash2 className='text-red-500 cursor-pointer' />
//                                     </AlertDialogTrigger>
//                                     <AlertDialogContent>
//                                         <AlertDialogHeader>
//                                             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                                             <AlertDialogDescription>
//                                                 This action cannot be undone. This will permanently delete your account
//                                                 from our servers.
//                                             </AlertDialogDescription>
//                                         </AlertDialogHeader>
//                                         <AlertDialogFooter>
//                                             <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                             <AlertDialogAction onClick={() => deleteProductHandeler(product._id)}>Continue</AlertDialogAction>
//                                         </AlertDialogFooter>
//                                     </AlertDialogContent>
//                                 </AlertDialog>


//                             </div>
//                         </div>
//                     </Card>
//                 })
//             }
//         </div>

//     )
// }

// export default AdminProduct









import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/ui/ImageUpload'
import { Button } from '@/components/ui/button'
import { useSelector, useDispatch } from 'react-redux'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Edit, Search, Trash2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { setProducts } from '@/redux/productSlice'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const AdminProduct = () => {

    const { products } = useSelector((store) => store.product);

    const [editProduct, setEditProduct] = useState(null);
    const [open, setOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    const dispatch = useDispatch();

    const accessToken = localStorage.getItem("accessToken");

    let filteredProducts = products.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOrder === "lowToHigh") {
        filteredProducts = [...filteredProducts].sort(
            (a, b) => a.productPrice - b.productPrice
        );
    }

    if (sortOrder === "highToLow") {
        filteredProducts = [...filteredProducts].sort(
            (a, b) => b.productPrice - a.productPrice
        );
    }

    const handelChange = (e) => {
        const { name, value } = e.target;

        setEditProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handelSave = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("productName", editProduct.productName);
        formData.append("productDesc", editProduct.productDesc);
        formData.append("productPrice", editProduct.productPrice);
        formData.append("brand", editProduct.brand);
        formData.append("category", editProduct.category);

        const exisitingImages = editProduct.productImg
            .filter(img => !(img instanceof File) && img.public_id)
            .map(img => img.public_id);

        formData.append(
            "existingImages",
            JSON.stringify(exisitingImages)
        );

        editProduct.productImg
            .filter(img => img instanceof File)
            .forEach(file => {
                formData.append("files", file);
            });

        try {

            const res = await axios.put(
                `${import.meta.env.VITE_URL}/api/v1/product/update/${editProduct._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            if (res.data.success) {

                toast.success("Product updated successfully");

                const updatedProducts = products.map((p) =>
                    p._id === editProduct._id
                        ? res.data.product
                        : p
                );

                dispatch(setProducts(updatedProducts));

                setOpen(false);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const deleteProductHandeler = async (productId) => {

        try {

            const remainingProducts = products.filter(
                (product) => product._id !== productId
            );

            const res = await axios.delete(
                `${import.meta.env.VITE_URL}/api/v1/product/delete/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            if (res.data.success) {

                toast.success(res.data.message);

                dispatch(setProducts(remainingProducts));

            }

        } catch (error) {
            console.log(error);
        }

    };

    return (

        <div className="w-full bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">

            {/* Search + Sort */}

            <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">

                <div className="relative w-full md:max-w-md">

                    <Input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search Product..."
                        className="bg-white pr-10"
                    />

                    <Search
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                    />

                </div>

                <Select onValueChange={(value) => setSortOrder(value)}>

                    <SelectTrigger className="w-full md:w-56 bg-white">

                        <SelectValue placeholder="Sort by Price" />

                    </SelectTrigger>

                    <SelectContent>

                        <SelectItem value="lowToHigh">
                            Price: Low to High
                        </SelectItem>

                        <SelectItem value="highToLow">
                            Price: High to Low
                        </SelectItem>

                    </SelectContent>

                </Select>

            </div>
            {
                filteredProducts.map((product, index) => {

                    return (

                        <Card
                            key={index}
                            className="p-4 shadow-sm rounded-xl"
                        >

                            <div className="flex flex-col lg:flex-row justify-between gap-6 lg:items-center">

                                {/* Left */}

                                <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">

                                    <img
                                        src={product.productImg[0].url}
                                        alt=""
                                        className="w-28 h-28 rounded-lg object-cover"
                                    />

                                    <div className="flex-1 text-center sm:text-left">

                                        <h1 className="font-bold text-lg break-words">
                                            {product.productName}
                                        </h1>

                                        <p className="text-gray-500 mt-1">
                                            {product.brand}
                                        </p>

                                        <p className="text-sm text-pink-600">
                                            {product.category}
                                        </p>

                                    </div>

                                </div>

                                {/* Price */}

                                <div className="text-center lg:text-right">

                                    <h2 className="font-bold text-xl">
                                        ₹{product.productPrice}
                                    </h2>

                                </div>

                                {/* Actions */}

                                <div className="flex justify-center lg:justify-end gap-4">

                                    <Dialog
                                        open={open}
                                        onOpenChange={setOpen}
                                    >

                                        <DialogTrigger asChild>

                                            <Edit
                                                onClick={() => {
                                                    setOpen(true);
                                                    setEditProduct(product);
                                                }}
                                                className="text-blue-500 cursor-pointer"
                                            />

                                        </DialogTrigger>

                                        <DialogContent className="w-[95%] sm:max-w-3xl max-h-[90vh] overflow-y-auto">

                                            <DialogHeader>

                                                <DialogTitle>
                                                    Edit Product
                                                </DialogTitle>

                                                <DialogDescription>
                                                    Make changes to your product here.
                                                </DialogDescription>

                                            </DialogHeader>

                                            <div className="flex flex-col gap-4">

                                                {/* Product Name */}

                                                <div className="grid gap-2">

                                                    <Label>
                                                        Product Name
                                                    </Label>

                                                    <Input
                                                        type="text"
                                                        value={editProduct?.productName}
                                                        onChange={handelChange}
                                                        name="productName"
                                                    />

                                                </div>

                                                {/* Price */}

                                                <div className="grid gap-2">

                                                    <Label>
                                                        Price
                                                    </Label>

                                                    <Input
                                                        type="number"
                                                        value={editProduct?.productPrice}
                                                        onChange={handelChange}
                                                        name="productPrice"
                                                    />

                                                </div>

                                                {/* Brand + Category */}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                    <div className="grid gap-2">

                                                        <Label>
                                                            Brand
                                                        </Label>

                                                        <Input
                                                            type="text"
                                                            value={editProduct?.brand}
                                                            onChange={handelChange}
                                                            name="brand"
                                                        />

                                                    </div>

                                                    <div className="grid gap-2">

                                                        <Label>
                                                            Category
                                                        </Label>

                                                        <Input
                                                            type="text"
                                                            value={editProduct?.category}
                                                            onChange={handelChange}
                                                            name="category"
                                                        />

                                                    </div>

                                                </div>

                                                {/* Description */}

                                                <div className="grid gap-2">

                                                    <Label>
                                                        Description
                                                    </Label>

                                                    <Textarea
                                                        value={editProduct?.productDesc}
                                                        onChange={handelChange}
                                                        name="productDesc"
                                                        className="min-h-[120px]"
                                                    />

                                                </div>

                                                {/* Images */}

                                                <ImageUpload
                                                    productData={editProduct}
                                                    setProductData={setEditProduct}
                                                />

                                            </div>

                                            <DialogFooter>

                                                <DialogClose asChild>

                                                    <Button variant="outline">
                                                        Cancel
                                                    </Button>

                                                </DialogClose>

                                                <Button
                                                    onClick={handelSave}
                                                >
                                                    Save Changes
                                                </Button>

                                            </DialogFooter>

                                        </DialogContent>

                                    </Dialog>
                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <Trash2 className="text-red-500 cursor-pointer" />
                                        </AlertDialogTrigger>

                                        <AlertDialogContent>

                                            <AlertDialogHeader>

                                                <AlertDialogTitle>
                                                    Are you absolutely sure?
                                                </AlertDialogTitle>

                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently
                                                    delete this product from your store.
                                                </AlertDialogDescription>

                                            </AlertDialogHeader>

                                            <AlertDialogFooter>

                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>

                                                <AlertDialogAction
                                                    onClick={() =>
                                                        deleteProductHandeler(product._id)
                                                    }
                                                >
                                                    Continue
                                                </AlertDialogAction>

                                            </AlertDialogFooter>

                                        </AlertDialogContent>

                                    </AlertDialog>

                                </div>

                            </div>

                        </Card>

                    )

                })
            }

        </div>

    )

}

export default AdminProduct