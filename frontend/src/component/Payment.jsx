import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import StarRating from "./StarRating";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Payment = () => {
  const { userId, courseId } = useParams();

  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);

  const navigate = useNavigate();
  const fetchCourse = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/course/fetchcourse/${courseId}`,
        { withCredentials: true }
      );
      setCourse(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data.message || "Error fetching course data");
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create Razorpay Order
      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/v1/transaction/create-order`,
        { amount: course.price === course.finalPrice ? course.price : course.finalPrice },
        { withCredentials: true }
      );

      const data = orderResponse.data.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from env
        amount: data.amount,
        currency: "INR",
        name: "LMS Payment",
        description: "Course Payment",
        order_id: data.id,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          // 2. Verify Payment
          const res = await axios.post(
            `${API_BASE_URL}/api/v1/transaction/verify-payment`,
            {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
              userId,
              courseId,
              type: "single",
              amount: course.price === course.finalPrice ? course.price : course.finalPrice,
              discountCode: null, // Add discount code if applicable
              paymentMethod: "Razorpay",
            },
            { withCredentials: true }
          );

          alert("Payment successful! Course access granted.");
          navigate(`/course/enroll/${courseId}`); // Redirect to My Courses page
        },
        prefill: {
          name: "Student",
          email: "student@example.com",
        },
        theme: {
          color: "#6366f1",
        },
      };
      console.log(options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(
        err?.response?.data.message || "Error processing payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full  min-h-screen bg-gray-900 p-10 flex flex-row text-white justify-evenly">
      <div className="h-[130px] flex my-2 p-2 border-b-2 hover:bg-gray-700 transform transition duration-300 hover:scale-102">
        {/* Course Image */}
        <div className="w-35 h-20 flex-shrink-0">
          <img
            src={course?.thumbnail.url}
            alt={course?.title}
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* Course Details */}
        <div className="flex flex-row w-full justify-between">
          <div className="w-full px-4">
            <h1 className="text-xl font-bold">{course?.title}</h1>

            <div>
              {/* <p className="text-white text-sm">{course.description}</p> */}
              <p className="text-white-500 text-sm my-1">
                {course?.instructor?.name || "Unknown Instructor"}
              </p>

              {/* Rating */}
              <StarRating rating={course?.averageRating || 0} />

              {/* Course Meta Info */}
              <p className="text-white-500 text-sm my-1">
                {course?.lecture?.length || 0} Lectures
              </p>
            </div>
          </div>
          <p className="px-4 text-xl font-extrabold ">₹{course?.price === course?.finalPrice ? course?.price : course?.finalPrice}</p>
          
        </div>
      </div>

      <div className="p-4 w-1/5">
            <p className="text-2xl font-bold">Total:</p>
            <p className="text-3xl font-extrabold my-2">₹{course?.price === course?.finalPrice ? course?.price : course?.finalPrice}</p>    
            <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full px-6 py-3 text-lg font-bold mt-2 rounded-[5px] text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
              >
                 {loading ? "Processing..." : "Pay Now"}
              </button>
      </div>
      
    </div>
  );
};

export default Payment;
