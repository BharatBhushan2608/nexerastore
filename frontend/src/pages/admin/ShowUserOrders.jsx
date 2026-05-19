import OrderCard from '@/components/ui/OrderCard'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ShowUserOrders = () => {

  const [userOrder, setUserOrder] = useState(null);

  const params = useParams();
  // console.log(params)

  const getUserOrders = async () => {

    const accessToken = localStorage.getItem("accessToken");

    try {

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/user-order/${params.userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        setUserOrder(res.data.orders);
      }

    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    getUserOrders();
  }, []);

  return (
    <div className="pl-87.5 py-20">
      <OrderCard userOrder={userOrder} />
    </div>
  );

};

export default ShowUserOrders;