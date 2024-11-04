import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sku: "",
    basePrice: "",
    discountPrice: "",
    colors: [],
    variants: [],
    images: [],
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:5000/api/products?sellerId=${userId}`
        );
        setProducts(response.data.products);
      } catch (error) {
        setError("Failed to fetch products");
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchSellerProducts();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploadingImages(true);
    setError("");

    try {
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          "http://localhost:5000/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.url) {
          uploadedUrls.push(response.data.url);
        }
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (error) {
      setError("Failed to upload images. Please try again.");
      console.error("Error uploading images:", error);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleColorAdd = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, ""],
    }));
  };

  const handleColorChange = (index, value) => {
    const newColors = [...formData.colors];
    newColors[index] = value;
    setFormData((prev) => ({
      ...prev,
      colors: newColors,
    }));
  };

  const handleDeleteImage = (indexToDelete) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToDelete),
    }));
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      setProducts(products.filter((product) => product.id !== productId));
      setSuccessMessage("Product deleted successfully!");
    } catch (error) {
      setError("Failed to delete product");
      console.error("Error deleting product:", error);
    }
  };

  const handleEditProduct = async (product) => {
    setEditMode(true);
    setEditingProductId(product.id);
    setFormData({
      title: product.title,
      description: product.description,
      sku: product.sku,
      basePrice: product.basePrice,
      discountPrice: product.discountPrice || "",
      colors: product.colors || [],
      variants: product.variants || [],
      images: product.images || [],
      categoryId: product.categoryId,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const userId = localStorage.getItem("userId");
      const productData = {
        ...formData,
        ownerId: parseInt(userId),
        basePrice: parseFloat(formData.basePrice),
        discountPrice: formData.discountPrice
          ? parseFloat(formData.discountPrice)
          : null,
        colors: formData.colors.filter((color) => color.trim() !== ""),
        variants: formData.variants,
        categoryId: parseInt(formData.categoryId),
        sku: formData.sku.toString(),
      };

      if (editMode && editingProductId) {
        await axios.put(
          `http://localhost:5000/api/products/${editingProductId}`,
          productData
        );
        setSuccessMessage("Product updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/products", productData);
        setSuccessMessage("Product added successfully!");
      }

      setFormData({
        title: "",
        description: "",
        sku: "",
        basePrice: "",
        discountPrice: "",
        colors: [],
        variants: [],
        images: [],
        categoryId: "",
      });
      setEditMode(false);
      setEditingProductId(null);

      const response = await axios.get(
        `http://localhost:5000/api/products?sellerId=${userId}`
      );
      setProducts(response.data.products);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-[#EBBE43] mb-6">
            Seller Dashboard
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Price (Optional)
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43]"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43]"
                accept="image/*"
                disabled={uploadingImages}
              />
              <div className="mt-2 flex gap-2 flex-wrap">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {uploadingImages && (
                <div className="text-sm text-gray-500 mt-2">
                  Uploading images...
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colors
              </label>
              {formData.colors.map((color, index) => (
                <input
                  key={index}
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBBE43] mb-2"
                  placeholder="Enter color name"
                />
              ))}
              <button
                type="button"
                onClick={handleColorAdd}
                className="text-[#EBBE43] hover:text-[#d4a93c]"
              >
                + Add Color
              </button>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}
            {successMessage && (
              <div className="text-green-500 text-sm">{successMessage}</div>
            )}

            <button
              type="submit"
              disabled={isLoading || uploadingImages}
              className="w-full py-2.5 bg-[#EBBE43] text-white rounded-lg hover:bg-[#d4a93c] transition-colors disabled:opacity-50"
            >
              {isLoading
                ? "Saving Product..."
                : editMode
                ? "Update Product"
                : "Add Product"}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white border rounded-lg p-4">
              <img
                src={product.images[0] || "/placeholder-image.jpg"}
                alt={product.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
              <p className="text-gray-600 mb-2">${product.basePrice}</p>
              <p className="text-sm text-gray-500 mb-4">
                {product.description.substring(0, 100)}...
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="text-[#EBBE43] hover:text-[#d4a93c]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
