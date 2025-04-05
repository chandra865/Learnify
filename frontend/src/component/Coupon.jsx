import React, { useState } from "react";
import axios from "axios";

const Coupon = () => {
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    expiresAt: "",
    usageLimit: "",
    courseId: "",
  });

  const [validationMessage, setValidationMessage] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // uppercase + alphanumeric for coupon code
    if (name === "code") {
      const valid = /^[A-Z0-9]*$/.test(value);
      if (!valid && value !== "") return;
    }

    setFormData({ ...formData, [name]: value.toUpperCase() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationMessage("");
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/create-coupon",
        formData,
        {
          withCredentials: true,
        }
      );

      setValidationMessage("Coupon created successfully");
      setIsValid(true);
    } catch (err) {
      setValidationMessage(err.response?.data?.message || "Error occurred");
      setIsValid(false);
    } finally {
      setLoading(false);
    }
  };

  const validateLive = async () => {
    if (!formData.code || !formData.courseId) return;
    try {
      const res = await axios.post("http://localhost:8000/api/v1/create-coupon", {
        code: formData.code,
        courseId: formData.courseId,
        userId: "testUserId", // Replace with actual userId
      });
      setValidationMessage("Coupon is valid 🎉");
      setIsValid(true);
    } catch (err) {
      setValidationMessage(err.response?.data?.message || "Invalid coupon");
      setIsValid(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-gray-700 shadow rounded-lg text-white">
      <h2 className="text-xl font-bold mb-4">Create Coupon</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Coupon Code */}
        <input
          type="text"
          name="code"
          maxLength={12}
          placeholder="COUPON2025"
          value={formData.code}
          onChange={handleChange}
          onBlur={validateLive}
          required
          className="w-full p-2 border rounded"
        />

        {/* Discount */}
        <input
          type="number"
          name="discountPercentage"
          placeholder="Discount % (e.g. 20)"
          value={formData.discountPercentage}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Expiry Date */}
        <input
          type="date"
          name="expiresAt"
          value={formData.expiresAt}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Usage Limit */}
        <input
          type="number"
          name="usageLimit"
          placeholder="Usage limit (e.g. 5)"
          value={formData.usageLimit}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Course ID */}
        {/* <input
          type="text"
          name="courseId"
          placeholder="Course ID"
          value={formData.courseId}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        /> */}

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Coupon"}
        </button>
      </form>

      {/* Message */}
      {validationMessage && (
        <p
          className={`mt-4 ${
            isValid ? "text-green-600" : "text-red-600"
          } font-medium`}
        >
          {validationMessage}
        </p>
      )}
    </div>
  );
};

export default Coupon;
