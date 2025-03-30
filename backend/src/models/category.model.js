import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  subcategories: [
    {
      name: String,
      slug: String,
      topics: [String], // Array of topic names
    },
  ],
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
