const Product = require("../models/Product");
const Supplier = require("../models/Supplier");

exports.listProducts = async (req, res) => {
  try {
    const { supplierId, search } = req.query;
    let filter = {};

    if (supplierId) {
      filter.supplier = supplierId;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter).populate("supplier");
    const suppliers = await Supplier.find({});
    res.render("products/index", {
      products,
      suppliers,
      selectedSupplier: supplierId || "",
      search: search || "",
    });
  } catch (err) {
    req.flash("error_msg", "Error fetching products");
    res.redirect("/");
  }
};

exports.showCreateForm = async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.render("products/form", {
      product: {},
      suppliers,
      formAction: "/products",
      formMethod: "POST",
    });
  } catch (err) {
    req.flash("error_msg", "Error loading form");
    res.redirect("/products");
  }
};

exports.createProduct = async (req, res) => {
  const { name, price, quantity, supplier } = req.body;
  try {
    const newProduct = new Product({ name, price, quantity, supplier });
    await newProduct.save();
    req.flash("success_msg", "Product created successfully");
    res.redirect("/products");
  } catch (err) {
    req.flash("error_msg", "Error creating product");
    res.redirect("/products");
  }
};

exports.showEditForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash("error_msg", "Product not found");
      return res.redirect("/products");
    }
    const suppliers = await Supplier.find({});
    res.render("products/form", {
      product,
      suppliers,
      formAction: `/products/${product._id}?_method=PUT`,
      formMethod: "POST",
    });
  } catch (err) {
    req.flash("error_msg", "Error fetching product");
    res.redirect("/products");
  }
};

exports.updateProduct = async (req, res) => {
  const { name, price, quantity, supplier } = req.body;
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      name,
      price,
      quantity,
      supplier,
    });
    req.flash("success_msg", "Product updated successfully");
    res.redirect("/products");
  } catch (err) {
    req.flash("error_msg", "Error updating product");
    res.redirect("/products");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Product deleted successfully");
    res.redirect("/products");
  } catch (err) {
    req.flash("error_msg", "Error deleting product");
    res.redirect("/products");
  }
};
