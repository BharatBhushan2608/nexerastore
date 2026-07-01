// import Sidebar from '@/components/ui/Sidebar'
// import React from 'react'
// import { Outlet } from 'react-router-dom'

// const Dashboard = () => {
//   return (
//     <div className='flex'>
//         <Sidebar />
//         <div className='flex-1'>
//             <Outlet />
//         </div>
//     </div>
//   )
// }

// export default Dashboard


// import Sidebar from '@/components/ui/Sidebar'
// import React from 'react'
// import { Outlet } from 'react-router-dom'

// const Dashboard = () => {
//   return (
//     <div className="flex min-h-screen bg-gray-100 pt-16">

//       <Sidebar />

//       <main className="flex-1 overflow-x-hidden p-4 lg:p-8">
//         <Outlet />
//       </main>

//     </div>
//   )
// }

// export default Dashboard


import Sidebar from "@/components/ui/Sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    //<div className="pt-16 bg-gray-100 min-h-screen mt-10 ">
    <div className="bg-gray-100 min-h-screen pt-16 mt-10 sm:mt-0">

      <Sidebar />

      <main className="lg:ml-72 p-4 lg:p-8">
        <Outlet />
      </main>

    </div>
  );
};

export default Dashboard;