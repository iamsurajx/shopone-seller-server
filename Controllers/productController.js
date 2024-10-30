import Product from '../Models/productModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Create Product
export const createProduct = async (req, res) => {
  const { 
    product_name, 
    product_description, 
    category, 
    seller_id, 
    product_type, 
    original_price, 
    sale_price 
  } = req.body;
  const file = req.file;

  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(file.path);

    // Create product in MongoDB
    const product = new Product({
      product_name,
      product_description,
      category,
      seller_id,
      product_type,
      original_price,
      sale_price,
      imageUrl: result.secure_url,
    });
    await product.save();

    // Delete local file after uploading to Cloudinary
    await fs.promises.unlink(file.path);

    res.status(201).json(product);
  } catch (error) {
    // Delete local file in case of error
    if (file) await fs.promises.unlink(file.path);
    res.status(500).json({ error: "Failed to create product", details: error.message });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
};

//get product by id
// Get Single Product
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve product", details: error.message });
  }
};


// Update Product
export const updateProduct = async (req, res) => {
  const { id } = req.params; // Ensure this matches with route param
  const updates = req.body;
  const file = req.file;

  try {
    // Find the existing product
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // If a new image is provided, upload it to Cloudinary and update the imageUrl
    if (file) {
      // Delete the old image from Cloudinary
      const publicId = product.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);

      // Upload the new image
      const result = await cloudinary.uploader.upload(file.path);
      updates.imageUrl = result.secure_url;

      // Delete the local file after upload
      await fs.promises.unlink(file.path);
    }

    // Update the product fields
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    if (file) await fs.promises.unlink(file.path);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
};


// Delete Product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the product
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Delete the image from Cloudinary
    const publicId = product.imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId);

    // Delete the product from MongoDB
    await Product.findByIdAndDelete(id); // Corrected deletion method
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
};

