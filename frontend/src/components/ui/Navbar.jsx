import { ShoppingCart } from 'lucide-react';
import React, { use } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { setUser } from '@/redux/userSlice';

const Navbar = () => {
    //const user = true;
    const { user } = useSelector(store => store.user);

    const cart = useSelector(store => store.product?.cart);

    const accessToken = localStorage.getItem("accessToken") ;

    // to show dashborad option

    const admin = user?.role === 'admin' ? true : false ;

    const dispatch = useDispatch() ;

    const navigate = useNavigate() ;

    const logoutHandler = async() => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/user/logout`, {},{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if(res.data.success){
                dispatch(setUser(null));
                // localStorage.removeItem("accessToken");
                // localStorage.removeItem("refreshToken");
                toast.success(res.data.message);
                navigate('/login');
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

  return (
    <header className='bg-pink-100 fixed w-full z-20 border-b border-pink-200'>
        <div className='max-w-7xl mx-auto flex justify-between items-center py-3'>
            {/* logo section */}
            <div>
                <img src="/navbarlogo.png" alt="Logo" className='w-15 h-13' />
            </div>
            {/* Nav Section */}
            <nav className='flex gap-10 justify-between items-center'>
                <ul className='flex gap-7 items-center text-xl font-semibold'>
                    <Link to={'/'}><li>Home</li></Link>
                    <Link to={'/products'}><li>Products</li></Link>
                    {
                        user && <Link to={`/profile/${user._id}`}><li>Hi, {user.firstName}</li></Link>
                    }
                    {
                        admin && <Link to={`/dashboard/sales`}><li>Dashboard</li></Link>
                    }
                </ul>
                <Link to={'/cart'} className='relative' >
                <ShoppingCart/>
                <span className='bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2 '>{cart.items.length || 0}</span>
                </Link>
                {
                    user ? <Button onClick={logoutHandler} className='bg-pink-500 hover:bg-pink-600 text-white cursor-pointer'>Logout</Button> : <Button onClick={() => navigate('/login')} className=' bg-linear-to-tl from-blue-600 to-purple-600 hover:bg-purple-600 text-white'>Login</Button>
                }
            </nav>
        </div>
    </header>
  )
}

export default Navbar