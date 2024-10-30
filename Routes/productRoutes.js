import express from "express";
import multer from "multer";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../Controllers/productController.js";

const router = express.Router();

// Multer setup to save files to 'uploads' folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post("/add-product", upload.single("image"), createProduct); //create a product
router.get("/products", getAllProducts); // get all the products
router.get("/products/:id", getProductById); // Get a single product by ID
router.put("/products/:id", upload.single("image"), updateProduct); // update a product by id
router.delete("/products/:id", deleteProduct); //delete a product by id

export default router;
