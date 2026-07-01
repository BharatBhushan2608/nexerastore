// import { ShoppingCart } from 'lucide-react';
// import React, { use } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { Button } from "@/components/ui/button"
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
// import { toast } from 'sonner';
// import { setUser } from '@/redux/userSlice';

// const Navbar = () => {
//     //const user = true;
//     const { user } = useSelector(store => store.user);

//     const cart = useSelector(store => store.product?.cart);

//     const accessToken = localStorage.getItem("accessToken") ;

//     // to show dashborad option

//     const admin = user?.role === 'admin' ? true : false ;

//     const dispatch = useDispatch() ;

//     const navigate = useNavigate() ;

//     const logoutHandler = async() => {
//         try {
//             const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/user/logout`, {},{
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`
//                 }
//             })
//             if(res.data.success){
//                 dispatch(setUser(null));
//                 // localStorage.removeItem("accessToken");
//                 // localStorage.removeItem("refreshToken");
//                 toast.success(res.data.message);
//                 navigate('/login');
//             }
//         } catch (error) {
//             console.error("Error logging out:", error);
//         }
//     }

//   return (
//     <header className='bg-pink-100 fixed w-full z-20 border-b border-pink-200'>
//         <div className='max-w-7xl mx-auto flex justify-between items-center py-3'>
//             {/* logo section */}
//             <div>
//                 <img src="/navbarlogo.png" alt="Logo" className='w-15 h-13' />
//             </div>
//             {/* Nav Section */}
//             <nav className='flex gap-10 justify-between items-center'>
//                 <ul className='flex gap-7 items-center text-xl font-semibold'>
//                     <Link to={'/'}><li>Home</li></Link>
//                     <Link to={'/products'}><li>Products</li></Link>
//                     {
//                         user && <Link to={`/profile/${user._id}`}><li>Hi, {user.firstName}</li></Link>
//                     }
//                     {
//                         admin && <Link to={`/dashboard/sales`}><li>Dashboard</li></Link>
//                     }
//                 </ul>
//                 <Link to={'/cart'} className='relative' >
//                 <ShoppingCart/>
//                 <span className='bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2 '>{cart.items.length || 0}</span>
//                 </Link>
//                 {
//                     user ? <Button onClick={logoutHandler} className='bg-pink-500 hover:bg-pink-600 text-white cursor-pointer'>Logout</Button> : <Button onClick={() => navigate('/login')} className=' bg-linear-to-tl from-blue-600 to-purple-600 hover:bg-purple-600 text-white'>Login</Button>
//                 }
//             </nav>
//         </div>
//     </header>
//   )
// }

// export default Navbar

//   HERE I MAKE A NEW NAVBAR WITH MOBILE RESPONSIVE DESIGN AND DASHBOARD OPTION FOR ADMIN USER

import { ShoppingCart, Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { setUser } from '@/redux/userSlice';

const Navbar = () => {
const { user } = useSelector(store => store.user);
const cart = useSelector(store => store.product?.cart);


const accessToken = localStorage.getItem("accessToken");

const admin = user?.role === 'admin';

const dispatch = useDispatch();
const navigate = useNavigate();

const [isOpen, setIsOpen] = useState(false);

const logoutHandler = async () => {
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_URL}/api/v1/user/logout`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        if (res.data.success) {
            dispatch(setUser(null));
            toast.success(res.data.message);
            navigate('/login');
        }
    } catch (error) {
        console.error("Error logging out:", error);
    }
};

return (
    <header className="fixed top-0 left-0 w-full h-16 bg-pink-100 border-b border-pink-200 shadow-sm z-50">

        <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-4">

            {/* Logo */}
            <Link to="/">
                <img
                    src="/navbarlogo.png"
                    alt="Logo"
                    className='w-12 h-10 md:w-16 md:h-14 object-contain'
                />
            </Link>

            {/* Desktop Navbar */}
            <nav className='hidden md:flex gap-10 justify-between items-center'>

                <ul className='flex gap-7 items-center text-lg font-semibold'>

                    <Link to='/'>
                        <li className='hover:text-pink-600 transition'>
                            Home
                        </li>
                    </Link>

                    <Link to='/products'>
                        <li className='hover:text-pink-600 transition'>
                            Products
                        </li>
                    </Link>

                    {
                        user &&
                        <Link to={`/profile/${user._id}`}>
                            <li className='hover:text-pink-600 transition'>
                                Hi, {user.firstName}
                            </li>
                        </Link>
                    }

                    {
                        admin &&
                        <Link to='/dashboard/sales'>
                            <li className='hover:text-pink-600 transition'>
                                Dashboard
                            </li>
                        </Link>
                    }

                </ul>

                {/* Cart */}
                <Link to='/cart' className='relative'>
                    <ShoppingCart size={24} />

                    <span className='bg-pink-500 rounded-full absolute text-white text-xs -top-2 -right-3 px-2 min-w-[20px] h-5 flex items-center justify-center'>
                        {cart?.items?.length || 0}
                    </span>
                </Link>

                {/* Login / Logout */}
                {
                    user ? (
                        <Button
                            onClick={logoutHandler}
                            className='bg-pink-500 hover:bg-pink-600 text-white cursor-pointer'
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button
                            onClick={() => navigate('/login')}
                            className='bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white'
                        >
                            Login
                        </Button>
                    )
                }

            </nav>

            {/* Mobile Menu Button */}
            <Button
                className='md:hidden'
                onClick={() => setIsOpen(!isOpen)}
            >
                {
                    isOpen
                        ? <X size={28} />
                        : <Menu size={28} />
                }
            </Button>

        </div>

        {/* Mobile Menu */}
        {
            isOpen && (
                <div className='md:hidden bg-pink-100 border-t border-pink-200'>

                    <ul className='flex flex-col items-center gap-5 py-6 font-semibold'>

                        <Link
                            to='/'
                            onClick={() => setIsOpen(false)}
                        >
                            <li>Home</li>
                        </Link>

                        <Link
                            to='/products'
                            onClick={() => setIsOpen(false)}
                        >
                            <li>Products</li>
                        </Link>

                        {
                            user &&
                            <Link
                                to={`/profile/${user._id}`}
                                onClick={() => setIsOpen(false)}
                            >
                                <li>Hi, {user.firstName}</li>
                            </Link>
                        }

                        {
                            admin &&
                            <Link
                                to='/dashboard/sales'
                                onClick={() => setIsOpen(false)}
                            >
                                <li>Dashboard</li>
                            </Link>
                        }

                        <Link
                            to='/cart'
                            onClick={() => setIsOpen(false)}
                            className='flex items-center gap-2'
                        >
                            <ShoppingCart size={20} />
                            Cart ({cart?.items?.length || 0})
                        </Link>

                        {
                            user ? (
                                <Button
                                    onClick={logoutHandler}
                                    className='bg-pink-500 hover:bg-pink-600'
                                >
                                    Logout
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => navigate('/login')}
                                    className='bg-gradient-to-r from-blue-600 to-purple-600'
                                >
                                    Login
                                </Button>
                            )
                        }

                    </ul>

                </div>
            )
        }

    </header>
);


};

export default Navbar;
