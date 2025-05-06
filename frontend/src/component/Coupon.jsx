import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Coupon = () => {
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    expiresAt: "",
    courseId: "",
  });

  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = useSelector((state) => state.user.userData._id);
  const courseId = useSelector((state) => state.course.selectedCourse._id);

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/coupon/get-coupon/${courseId}`,
        {
          withCredentials: true,
        }
      );
      setCoupons(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [courseId]);

  // Toggle coupon status
  const handleToggleStatus = async (couponId) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/v1/coupon/toggle-coupon/${couponId}`,
        {},
        { withCredentials: true }
      );
      fetchCoupons(); // refresh list
    } catch (error) {
      console.log(error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.toUpperCase() });
  };

  // Handle create coupon
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationMessage("");

    const { code, discountPercentage, expiresAt } = formData;

    const couponCodeValid = /^[A-Z][A-Z0-9]*[0-9]$/.test(code);
    if (!couponCodeValid) {
      setValidationMessage(
        "Coupon code must start with a capital letter and end with a number."
      );
      setIsValid(false);
      setLoading(false);
      return;
    }

    const discount = parseFloat(discountPercentage);
    if (isNaN(discount) || discount <= 0 || discount > 100) {
      setValidationMessage(
        "Discount must be a positive number not exceeding 100%."
      );
      setIsValid(false);
      setLoading(false);
      return;
    }

    const today = new Date();
    const expiry = new Date(expiresAt);
    if (expiry <= today) {
      setValidationMessage("Expiry date must be in the future.");
      setIsValid(false);
      setLoading(false);
      return;
    }

    const payload = { ...formData, courseId };

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/coupon/create-coupon",
        payload,
        { withCredentials: true }
      );
      console.log(res);

      setValidationMessage("Coupon created successfully");
      setIsValid(true);
      setFormData({
        code: "",
        discountPercentage: "",
        expiresAt: "",
        courseId: "",
      });
      fetchCoupons(); // refresh coupons
      setShowForm(false); // close form
    } catch (err) {
      console.log(err);
      setValidationMessage(err.response?.data?.message || "Error occurred");
      setIsValid(false);
    } finally {
      setLoading(false);
    }
  };

  // Delete coupon
  const handleDelete = async (couponId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/coupon/delete-coupon/${couponId}`,
        {
          withCredentials: true,
        }
      );
      fetchCoupons(); // refresh after delete
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <p className="text-sm text-green-500 text-center mb-2 bg-gray-700 rounded-xl p-2">"From your created coupons, the active one with the highest discount will be automatically applied to the course."</p>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Coupons</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          {showForm ? "Cancel" : "Add New Coupon"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <input
            type="text"
            name="code"
            maxLength={12}
            placeholder="COUPON2025"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            name="discountPercentage"
            placeholder="Discount % (e.g. 20)"
            value={formData.discountPercentage}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded "
          />

          <input
            type="date"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded "
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Coupon"}
          </button>
        </form>
      )}

      {/* Validation Message */}
      {validationMessage && (
        <p
          className={`mb-6 ${
            isValid ? "text-green-400" : "text-amber-400"
          } font-medium`}
        >
          {validationMessage}
        </p>
      )}

      {/* Coupons List */}
      <div className="space-y-4">
        {coupons.length === 0 ? (
          <p className="text-center text-gray-400">No coupons yet.</p>
        ) : (
          coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="flex justify-between items-center p-4 bg-gray-700 rounded"
            >
              <div>
                <p className="font-bold">
                  {coupon.code}{" "}
                  <span
                    className={`text-xs ml-2 px-2 py-1 rounded-full ${
                      coupon.status === "active"
                        ? "bg-green-600 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {coupon.status}
                  </span>
                </p>
                <p className="text-sm">
                  {coupon.discountPercentage}% off - expires on{" "}
                  {new Date(coupon.expiresAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleStatus(coupon._id)}
                  className="text-blue-400 hover:underline"
                >
                  Toggle Status
                </button>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Coupon;
