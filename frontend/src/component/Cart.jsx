import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cartBaseUrl, transactionBaseUrl } from "../utils/endpoints";
import Loading from "./Loading";
import { getErrorMessage } from "../utils/errorUtils";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import { useDispatch } from "react-redux";
import { setCart as setGlobalCart } from "../store/slice/cartSlice";

const Cart = () => {
  const { userData } = useSelector((state) => state.user);
  const userId = userData?._id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `${cartBaseUrl}/${userId}`,
          { withCredentials: true }
        );
        const cartData = response.data.data;
        setCart(cartData);
        dispatch(setGlobalCart(cartData));
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to fetch cart"));
      } finally {
        setLoading(false);
      }
    };

    if (!userId) {
      setLoading(false);
      return;
    }
    fetchCart();
  }, [userId, dispatch]);

  const handleRemoveFromCart = async (courseId) => {
    try {
      const response = await axios.patch(
        `${cartBaseUrl}/${userId}/${courseId}`,
        {},
        {
          withCredentials: true,
        }
      );
      const cartData = response.data.data;
      setCart(cartData);
      dispatch(setGlobalCart(cartData));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to remove item"));
    }
  };

  const handleCartPayment = async () => {
    if (!userId || !cart || cart.courses.length === 0) return;

    try {
      // 1. Create Razorpay Order
      const orderResponse = await axios.post(
        `${transactionBaseUrl}/order`,
        {
          amount: cart.totalAmount,
          type: "cart",
          courseId: null,
        },
        { withCredentials: true }
      );

      const data = orderResponse.data.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Learnify Cart Payment",
        description: "Payment for courses in cart",
        order_id: data.id,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          // 2. Verify Payment
          await axios.post(
            `${transactionBaseUrl}/payment`,
            {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
              userId,
              type: "cart", //  Tells backend to process payment for cart
              amount: cart.totalAmount,
              paymentMethod: "Razorpay",
            },
            { withCredentials: true }
          );

          toast.success("Cart payment successful! You're now enrolled in all courses.");
          navigate("/dashboard/enrolled"); // or your route
        },
        prefill: {
          name: userData?.name || "Student",
          email: userData?.email || "student@example.com",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(getErrorMessage(error, "Error processing cart payment"));
    }
  };

  return (
    <div className="bg-gray-800 p-8 min-h-screen">
      {loading ? (
        <Loading small />
      ) : !cart || cart.courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-white py-20">
          <p className="text-2xl font-bold mb-4">Your cart is empty</p>
          <Link 
            to="/search" 
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-md font-bold transition"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div>
          <h1 className="text-4xl font-extrabold text-white my-4">Your Cart</h1>

          <div className="flex flex-row bg-800 p-4 gap-4 rounded shadow-md text-white">
            <div className="p-4 w-4/5">
              <p className="text-xl font-bold my-1 border-b-1">
                {cart.courses.length} {cart.courses.length === 1 ? "course" : "courses"} in cart
              </p>
              {cart.courses.map((course) => (
                <div 
                  key={course._id}
                  className="flex my-2 p-2 border-b-2 hover:bg-gray-700 transform transition duration-300 hover:scale-102"
                >
                  {/* Course Image */}
                  <div className="w-35 h-20 flex-shrink-0">
                    <img
                      src={course?.thumbnail?.url}
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
                        {/* <p className="text-white-500 text-sm my-1">
                          {course?.instructor?.name || "Unknown Instructor"}
                        </p> */}

                        {/* Rating */}
                        <StarRating rating={course.averageRating || 0} />

                        {/* Course Meta Info
                        <p className="text-white-500 text-sm my-1">
                          {course.lecture?.length || 0} Lectures
                        </p> */}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(course._id)}
                      className="flex items-start px-4 text-sm text-[16px] cursor-pointer text-blue-500 "
                    >
                      Remove
                    </button>
                    <div>
                      {course.price === course.finalPrice ? (
                        <p className="px-4 text-xl font-extrabold ">
                          ₹{course.price}
                        </p>
                      ) : (
                        <div className="flex flex-col items-start">
                          <p className="px-4 text-xl font-extrabold line-through text-gray-500">
                            ₹{course.price}
                          </p>
                          <p className="px-4 text-xl font-extrabold ">
                            ₹{course.finalPrice}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 w-2/5">
              <p className="text-2xl font-bold">Total:</p>
              <p className="text-3xl font-extrabold my-2">
                ₹{cart.totalAmount}
              </p>
              <button 
              onClick={handleCartPayment}
              className="w-full px-6 py-3 text-lg font-bold mt-2 rounded-[5px] text-white bg-blue-500 hover:bg-blue-600 cursor-pointer">
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
