import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/category/get-categories'); // Adjust API endpoint as needed
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const resetMenu = () => {
    setIsMenuOpen(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  return (
    
      <div className="">
        <button
          onClick={() => setIsMenuOpen(true)}
          className=" text-white rounded-lg cursor-pointer hover:text-blue-700"
        >
          Explore Categories
        </button>

        {isMenuOpen && (
          <div
            className="absolute z-50 left-0 top-full mt-2 flex w-full bg-white shadow-2xl rounded-lg overflow-hidden"
            onMouseLeave={resetMenu}
          >
            <div className="w-1/3 bg-gray-100 border-r">
              <h2 className="text-lg font-semibold p-4 border-b bg-gray-200">Categories</h2>
              <ul>
                {categories.map((category) => (
                  <li
                    key={category._id}
                    onMouseEnter={() => {
                      setSelectedCategory(category);
                      setSelectedSubcategory(null);
                    }}
                    className={`p-4 cursor-pointer hover:bg-gray-200 transition-colors duration-200 ${
                      selectedCategory?._id === category._id ? 'bg-gray-200 text-blue-600' : ''
                    }`}
                  >
                    {category.name}
                    <span className="float-right text-gray-500">→</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedCategory && (
              <div className="w-1/3 bg-white border-r">
                <h2 className="text-lg font-semibold p-4 border-b bg-gray-50">{selectedCategory.name}</h2>
                <ul>
                  {selectedCategory.subcategories.map((subcategory) => (
                    <li
                      key={subcategory._id}
                      onMouseEnter={() => setSelectedSubcategory(subcategory)}
                      className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${
                        selectedSubcategory?._id === subcategory._id ? 'bg-gray-100 text-blue-600' : ''
                      }`}
                    >
                      {subcategory.name}
                      <span className="float-right text-gray-500">→</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedSubcategory && (
              <div className="w-1/3 bg-gray-50">
                <h2 className="text-lg font-semibold p-4 border-b bg-white">{selectedSubcategory.name}</h2>
                <ul>
                  {selectedSubcategory.topics.map((topic) => (
                    <li key={topic._id} className="p-4 cursor-pointer hover:bg-white transition-colors duration-200">
                      {topic.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

  );
};

export default CategoryMenu;
