
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';

// const AdminOrders = () => {

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const accessToken = localStorage.getItem("accessToken");

//   console.log("orders", orders);

//   useEffect(() => {

//     const fetchOrders = async () => {

//       try {

//         const { data } = await axios.get(
//           `${import.meta.env.VITE_URL}/api/v1/orders/all`,
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );

//         if (data.success) {
//           setOrders(data.orders);
//         }

//       } catch (error) {

//         console.error("❌ Failed to fetch admin orders:", error);

//       } finally {

//         setLoading(false);

//       }

//     };

//     fetchOrders();

//   }, [accessToken]);

//   if (loading) {
//     return (
//       <div className="text-center py-20 text-gray-500">
//         Loading all orders...
//       </div>
//     );
//   }

//   return (

//     <div className="pl-87.5 py-20 pr-20 mx-auto px-4">

//       <h1 className="text-3xl font-bold mb-6">
//         Admin - All Orders
//       </h1>

//       {

//         orders.length === 0 ? (

//           <p className="text-gray-500">
//             No orders found.
//           </p>

//         ) : (

//           <div className="overflow-x-auto">

//             <table className="w-full border border-gray-200 text-left text-sm">

//               <thead className="bg-gray-100">

//                 <tr>

//                   <th className="px-4 py-2 border">
//                     Order ID
//                   </th>

//                   <th className="px-4 py-2 border">
//                     User
//                   </th>

//                   <th className="px-4 py-2 border">
//                     Products
//                   </th>

//                   <th className="px-4 py-2 border">
//                     Amount
//                   </th>

//                   <th className="px-4 py-2 border">
//                     Status
//                   </th>

//                   <th className="px-4 py-2 border">
//                     Date
//                   </th>

//                 </tr>

//               </thead>

//               <tbody>

//                 {

//                   orders.map((order) => (

//                     <tr
//                       key={order._id}
//                       className="hover:bg-gray-50"
//                     >

//                       <td className="px-4 py-2 border">
//                         {order._id}
//                       </td>

//                       <td className="px-4 py-2 border">

//                         {order.user?.name}
//                         <br />

//                         <span className="text-xs text-gray-500">
//                           {order.user?.email}
//                         </span>

//                       </td>

//                       <td className="px-4 py-2 border">

//                         {

//                           order.products.map((p, idx) => (

//                             <div
//                               key={idx}
//                               className="text-sm"
//                             >

//                               {p.productName} ✖ {p.quantity}

//                             </div>

//                           ))

//                         }

//                       </td>

//                       <td className="px-4 py-2 border font-semibold">

//                         ₹{order.amount.toLocaleString("en-IN")}

//                       </td>

//                       <td className="px-4 py-2 border">

//                         <span
//                           className={`px-2 py-1 rounded text-xs font-medium ${order.status === "paid"
//                               ? "bg-green-100 text-green-700"
//                               : order.status === "pending"
//                                 ? "bg-yellow-100 text-yellow-700"
//                                 : "bg-red-100 text-red-700"
//                             }`}
//                         >

//                           {order.status}

//                         </span>

//                       </td>

//                       <td className="px-4 py-2 border">

//                         {new Date(order.createdAt).toLocaleDateString()}

//                       </td>

//                     </tr>

//                   ))

//                 }

//               </tbody>

//             </table>

//           </div>

//         )

//       }

//     </div>

//   );

// };

// export default AdminOrders;




import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AdminOrders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const { data } = await axios.get(
          `${import.meta.env.VITE_URL}/api/v1/orders/all`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (data.success) {
          setOrders(data.orders);
        }

      } catch (error) {

        console.error("❌ Failed to fetch admin orders:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, [accessToken]);

  if (loading) {

    return (

      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">

        Loading all orders...

      </div>

    );

  }

  return (

    <div className="w-full min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

      {/* Heading */}

      <div className="mb-8">

        <h1 className="text-2xl sm:text-3xl font-bold">

          Admin - All Orders

        </h1>

        <p className="text-gray-500 mt-1">

          Manage all customer orders

        </p>

      </div>

      {

        orders.length === 0 ? (

          <div className="bg-white rounded-xl shadow p-8 text-center">

            <p className="text-gray-500">

              No orders found.

            </p>

          </div>

        ) : (

          <>
          <div className="hidden lg:block bg-white rounded-xl shadow overflow-hidden">

            <div className="overflow-x-auto">

              <table className="min-w-[900px] w-full text-left text-sm">

                <thead className="bg-pink-50">

                  <tr>

                    <th className="px-4 py-3 border-b font-semibold">
                      Order ID
                    </th>

                    <th className="px-4 py-3 border-b font-semibold">
                      User
                    </th>

                    <th className="px-4 py-3 border-b font-semibold">
                      Products
                    </th>

                    <th className="px-4 py-3 border-b font-semibold">
                      Amount
                    </th>

                    <th className="px-4 py-3 border-b font-semibold">
                      Status
                    </th>

                    <th className="px-4 py-3 border-b font-semibold">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {

                    orders.map((order) => (

                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 transition"
                      >

                        {/* Order ID */}

                        <td className="px-4 py-4 border-b whitespace-nowrap text-xs">

                          {order._id}

                        </td>

                        {/* User */}

                        <td className="px-4 py-4 border-b min-w-[220px]">

                          <p className="font-medium">

                            {order.user?.name}

                          </p>

                          <p className="text-xs text-gray-500 break-all">

                            {order.user?.email}

                          </p>

                        </td>

                        {/* Products */}

                        <td className="px-4 py-4 border-b min-w-[220px]">

                          {

                            order.products.map((p, idx) => (

                              <div
                                key={idx}
                                className="text-sm mb-1"
                              >

                                {p.productName} × {p.quantity}

                              </div>

                            ))

                          }

                        </td>

                        {/* Amount */}

                        <td className="px-4 py-4 border-b whitespace-nowrap font-semibold">

                          ₹{order.amount.toLocaleString("en-IN")}

                        </td>

                        {/* Status */}

                        <td className="px-4 py-4 border-b whitespace-nowrap">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >

                            {order.status}

                          </span>

                        </td>

                        {/* Date */}

                        <td className="px-4 py-4 border-b whitespace-nowrap">

                          {new Date(order.createdAt).toLocaleDateString()}

                        </td>

                      </tr>

                    ))

                  }

                </tbody>

              </table>

            </div>

          </div>

          <div className="lg:hidden space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="text-sm break-all">{order._id}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">User</p>
                    <p className="font-semibold">{order.user?.name}</p>
                    <p className="text-sm text-gray-500 break-all">{order.user?.email}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Products</p>
                    {order.products.map((p, idx)=>(
                      <div key={idx} className="text-sm">
                        • {p.productName} × {p.quantity}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Amount</span>
                    <span>₹{order.amount.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Date</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>

        )

      }

    </div>

  );

};

export default AdminOrders;