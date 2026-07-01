// import { LayoutDashboard, PackagePlus, PackageSearch, Users } from 'lucide-react'
// import React from 'react'
// import { FaRegEdit } from 'react-icons/fa'
// import { NavLink } from 'react-router-dom'

// const Sidebar = () => {
//     return (
//         <div className='hidden fixed md:block border-r bg-pink-50 border-pink-200 x-10 w-[300px] p-10 space-y-2 h-screen'>

//             <div className='text-center pt-10 px-3 space-y-2 '>

//                 {/* Dashboard */}
//                 <NavLink
//                     to="/dashboard/sales"
//                     className={({ isActive }) =>
//                         `text-xl ${isActive ? "bg-pink-600 text-white" : "text-gray-900 bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
//                     }
//                 >
//                     <LayoutDashboard />
//                     <span>Dashboard</span>
//                 </NavLink>

//                 {/* Add Product */}
//                 <NavLink
//                     to="/dashboard/add-product"
//                     className={({ isActive }) =>
//                         `text-xl ${isActive ? "bg-pink-600 text-white" : "text-gray-900 bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
//                     }
//                 >
//                     <PackagePlus />
//                     <span>Add Product</span>
//                 </NavLink>

//                 {/* Products */}
//                 <NavLink
//                     to="/dashboard/products"
//                     className={({ isActive }) =>
//                         `text-xl ${isActive ? "bg-pink-600 text-white" : "text-gray-900 bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
//                     }
//                 >
//                     <PackageSearch />
//                     <span>Products</span>
//                 </NavLink>

//                 {/* Users */}
//                 <NavLink
//                     to="/dashboard/users"
//                     className={({ isActive }) =>
//                         `text-xl ${isActive ? "bg-pink-600 text-white" : "text-gray-900 bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
//                     }
//                 >
//                     <Users />
//                     <span>Users</span>
//                 </NavLink>

//                 {/* Orders */}
//                 <NavLink
//                     to="/dashboard/orders"
//                     className={({ isActive }) =>
//                         `text-xl ${isActive ? "bg-pink-600 text-white" : "text-gray-900 bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
//                     }
//                 >
//                     <FaRegEdit />
//                     <span>Orders</span>
//                 </NavLink>

//             </div>
//         </div>
//     )
// }

// export default Sidebar


import {
    LayoutDashboard,
    PackagePlus,
    PackageSearch,
    Users,
    Menu,
    X,
} from "lucide-react";
import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const [open, setOpen] = useState(false);

    const menuItems = [
        {
            title: "Dashboard",
            path: "/dashboard/sales",
            icon: <LayoutDashboard size={22} />,
        },
        {
            title: "Add Product",
            path: "/dashboard/add-product",
            icon: <PackagePlus size={22} />,
        },
        {
            title: "Products",
            path: "/dashboard/products",
            icon: <PackageSearch size={22} />,
        },
        {
            title: "Users",
            path: "/dashboard/users",
            icon: <Users size={22} />,
        },
        {
            title: "Orders",
            path: "/dashboard/orders",
            icon: <FaRegEdit size={20} />,
        },
    ];

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b z-40 px-4 py-3 flex justify-between items-center">
                <h2 className="font-bold text-lg">Admin Panel</h2>

                <button onClick={() => setOpen(true)}>
                    <Menu size={28} />
                </button>
            </div>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                            fixed top-16 left-0
                            z-40
                            w-72
                            h-[calc(100vh-64px)]
                            bg-pink-50
                            border-r
                            border-pink-200
                            transition-transform duration-300

                            ${open ? "translate-x-0" : "-translate-x-full"}

                            lg:translate-x-0
                            lg:flex-shrink-0
                        `}
            >
                {/* Close Button */}
                <div className="lg:hidden flex justify-end p-5">
                    <button onClick={() => setOpen(false)}>
                        <X size={28} />
                    </button>
                </div>

                <div className="pt-6 px-6 space-y-3">

                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-4 rounded-xl font-semibold text-lg transition-all ${isActive
                                    ? "bg-pink-600 text-white"
                                    : "hover:bg-pink-100 text-gray-700"
                                }`
                            }
                        >
                            {item.icon}
                            {item.title}
                        </NavLink>
                    ))}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;