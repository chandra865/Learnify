import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/category/get-categories"
        );
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubcategoryClick = () => {
    //console.log("Subcategory clicked:", selectedSubcategory);
    navigate(`/search?query=${encodeURIComponent(selectedSubcategory.name)}`);
  };

  const resetMenu = () => {
    setIsMenuOpen(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsMenuOpen(true)}
        className="text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
      >
        Explore
      </button>

      {isMenuOpen && (
        <div
          className="absolute left-0 top-full mt-2 flex bg-gray-900 text-white rounded-lg shadow-xl z-50"
          onMouseLeave={resetMenu}
        >
          {/* Column 1: Categories */}
          <div className="w-56 border-r border-gray-700">
            <h2 className="text-base font-semibold px-4 py-2 bg-gray-800 border-b border-gray-700">
              Categories
            </h2>
            <ul>
              {categories.map((category) => (
                <li
                  key={category._id}
                  onMouseEnter={() => {
                    setSelectedCategory(category);
                    setSelectedSubcategory(null);
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                    selectedCategory?._id === category._id
                      ? "bg-gray-700 text-blue-400"
                      : ""
                  }`}
                >
                  {category.name}
                  <span className="float-right text-sm">→</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Subcategories */}
          {selectedCategory && (
            <div className="w-56 border-r border-gray-700">
              <h2 className="text-base font-semibold px-4 py-2 bg-gray-800 border-b border-gray-700">
                {selectedCategory.name}
              </h2>
              <ul>
                {selectedCategory.subcategories.map((subcategory) => (
                  <li
                    key={subcategory._id}
                    onMouseEnter={() => setSelectedSubcategory(subcategory)}
                    onClick={handleSubcategoryClick}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                      selectedSubcategory?._id === subcategory._id
                        ? "bg-gray-700 text-blue-400"
                        : ""
                    }`}
                  >
                    {subcategory.name}
                    {/* <span className="float-right text-sm">→</span> */}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Column 3: Topics */}
          {/* {selectedSubcategory && (
            <div className="w-56">
              <h2 className="text-base font-semibold px-4 py-2 bg-gray-800 border-b border-gray-700">
                {selectedSubcategory.name}
              </h2>
              <ul>
                {selectedSubcategory.topics.map((topic) => (
                  <li
                    key={topic._id}
                    className="px-4 py-2 text-white cursor-pointer hover:bg-gray-700"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
