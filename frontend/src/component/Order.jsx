import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/transaction/get-order-history`,
          { withCredentials: true }
        );
        setOrders(response.data.data);
      } catch (err) {
        toast.error(
          err?.response?.data.message || "Error fetching order history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-semibold mb-4">Order History</h2>
      {orders.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border bg-gray-800 rounded p-4 shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm text-gray-400 mb-2">
                <span className="font-semibold">Transaction ID:</span>{" "}
                {order._id}
              </p>
              <p className="text-xs text-gray-400">
                <span className="font-semibold">Payment ID:</span>{" "}
                {order.razorpay?.paymentId || "N/A"}
              </p>
              <p className="text-xs text-gray-400 mb-2">
                <span className="font-semibold">Date:</span>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <div className="space-y-2">
                {order.courses.map((course) => (
                  <div key={course._id} className="flex items-center space-x-4">
                    <img
                      src={course.thumbnail?.url}
                      alt={course.title}
                      className="w-36 h-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-lg font-medium">{course.title}</h3>
                      <p className="text-sm text-gray-400">
                        ₹{course.finalPrice || course.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right">
                <p className="text-lg font-bold">
                  Total Paid: ₹{order.amount} ({order.status})
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
