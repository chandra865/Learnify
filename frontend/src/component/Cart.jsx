import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import StarRating from "./StarRating";

const Cart = () => {
  const userId = useSelector((state) => state.user.userData?._id);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/cart/get-cart/${userId}`,

        {
          withCredentials: true,
        }
      );

      // console.log(response.data.data);
      setCart(response.data.data);
      setLoading(true);
    } catch (error) {
      console.log(response.data.error || "cart not fetched");
    }
  };

  useEffect(() => {
      if (!userId) return; 
      fetchCart();
  }, [userId]);

  const handleRemoveFromCart = async (courseId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/cart/remove-from-cart/${userId}/${courseId}`,
        {
          withCredentials: true,
        }
      );
      //console.log(response.data.data);
      setCart(response.data.data);
    } catch (error) {
      console.log(response?.data.error || "cart not fetched");
    }
  }


  return (
    <div className="bg-gray-800 p-8 min-h-screen">
      {!loading ? (
        <div>
          <p>loading......</p>
        </div>
      ) : (
        <div>
        <h1 className="text-4xl font-extrabold text-white my-4">Your Cart</h1>
        
        <div className="flex flex-row bg-800 p-4 gap-4 rounded shadow-md text-white">
          
          <div className="p-4 w-4/5">
            <p className="text-xl font-bold my-1 border-b-1">{cart.courses.length} course in cart</p>
            {cart.courses.map((course) => (
              <div className="flex my-2 p-2 border-b-2 hover:bg-gray-700 transform transition duration-300 hover:scale-102">
                {/* Course Image */}
                <div className="w-35 h-20 flex-shrink-0">
                  <img
                    src={course.thumbnail.url}
                    alt={course.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Course Details */}
                <div className="flex flex-row w-full justify-between">
                  <div className="w-full px-4">
                    <h1 className="text-xl font-bold">{course.title}</h1>

                    <div>
                      {/* <p className="text-white text-sm">{course.description}</p> */}
                      <p className="text-white-500 text-sm my-1">
                        {course?.instructor?.name || "Unknown Instructor"}
                      </p>

                      {/* Rating */}
                      <StarRating rating={course.averageRating || 0} />

                      {/* Course Meta Info */}
                      <p className="text-white-500 text-sm my-1">
                        {course.lecture?.length || 0} Lectures
                      </p>
                    </div>
                  </div>
                  <button 
                  onClick={()=>handleRemoveFromCart(course._id)}
                  className="flex items-start px-4 text-sm text-[16px] cursor-pointer text-blue-500 ">
                    Remove
                  </button>
                  <p className="px-4 text-xl font-extrabold ">
                    ₹{course.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 w-2/5">
            <p className="text-2xl font-bold">Total:</p>
            <p className="text-3xl font-extrabold my-2">₹{cart.totalAmount}</p>
            <button
                className="w-full px-6 py-3 text-lg font-bold mt-2 rounded-[5px] text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
              >
                {"Proceed to Checkout"}
              </button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
