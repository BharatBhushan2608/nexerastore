// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// const AdminSales = () => {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalProducts: 0,
//     totalOrders: 0,
//     totalSales: 0,
//     salesByDate: []
//   });

//   const fetchStats = async () => {

//     try {

//       const accessToken = localStorage.getItem("accessToken");

//       const res = await axios.get(
//         `${import.meta.env.VITE_URL}/api/v1/orders/sales`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       );

//       if (res.data.success) {
//         setStats(res.data);
//       }

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchStats()
//   }, [])


//   return (
//     <div className="pl-87.5 bg-gray-100 py-20 pr-20 mx-auto px-4">
//       <div className="p-6 grid gap-6 lg:grid-cols-4">
//         {/* stats card */}
//         <Card className="bg-pink-500 text-white shadow">
//           <CardHeader>
//             <CardTitle>Total Users</CardTitle>
//           </CardHeader>
//           <CardContent className="text-2xl font-bold">
//             {stats.totalUsers}
//           </CardContent>
//         </Card>
//         <Card className="bg-pink-500 text-white shadow">
//           <CardHeader>
//             <CardTitle>Total Products</CardTitle>
//           </CardHeader>
//           <CardContent className="text-2xl font-bold">
//             {stats.totalProducts}
//           </CardContent>
//         </Card>
//         <Card className="bg-pink-500 text-white shadow">
//           <CardHeader>
//             <CardTitle>Total Orders</CardTitle>
//           </CardHeader>
//           <CardContent className="text-2xl font-bold">
//             {stats.totalOrders}
//           </CardContent>
//         </Card>
//         <Card className="bg-pink-500 text-white shadow">
//           <CardHeader>
//             <CardTitle>Total Sales</CardTitle>
//           </CardHeader>
//           <CardContent className="text-2xl font-bold">
//             {stats.totalSales}
//           </CardContent>
//         </Card>

//         {/* sales chart */}
//         <Card className="lg:col-span-4">

//           <CardHeader>
//             <CardTitle>Sales (Last 30 Days)</CardTitle>
//           </CardHeader>

//           <CardContent style={{ height: 300 }}>

//             <ResponsiveContainer width="100%" height="100%">

//               <AreaChart data={stats.sales}>
//                 {/* we use Xaxis from rechart */}
//                 <XAxis dataKey="date" /> 
//                 <YAxis />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="amount"
//                   stroke="#f472b6"
//                   fill="#f472b6"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default AdminSales







import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const AdminSales = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    salesByDate: [],
  });

  const fetchStats = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/sales`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="w-full bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <Card className="bg-pink-500 text-white shadow-md rounded-xl">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {stats.totalUsers}
          </CardContent>
        </Card>

        <Card className="bg-pink-500 text-white shadow-md rounded-xl">
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {stats.totalProducts}
          </CardContent>
        </Card>

        <Card className="bg-pink-500 text-white shadow-md rounded-xl">
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {stats.totalOrders}
          </CardContent>
        </Card>

        <Card className="bg-pink-500 text-white shadow-md rounded-xl">
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            ₹{stats.totalSales}
          </CardContent>
        </Card>

      </div>

      {/* Sales Chart */}

      <Card className="mt-8 shadow-md rounded-xl">

        <CardHeader>
          <CardTitle>Sales (Last 30 Days)</CardTitle>
        </CardHeader>

        <CardContent className="h-[250px] sm:h-[350px]">

          <ResponsiveContainer width="100%" height="100%">

            <AreaChart data={stats.sales}>

              <XAxis
                dataKey="date"
                fontSize={12}
                tickMargin={10}
              />

              <YAxis fontSize={12} />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="#ec4899"
                fill="#f9a8d4"
              />

            </AreaChart>

          </ResponsiveContainer>

        </CardContent>

      </Card>

    </div>
  );
};

export default AdminSales;