const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");

router.get("/", async (req, res) => {
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
    res.render("index", {
      products,
      suppliers,
      selectedSupplier: supplierId || "",
      search: search || "",
      currentUser: req.session.user || null,
    });
  } catch (err) {
    req.flash("error_msg", "Error loading home page");
    res.redirect("/auth/login");
  }
});

module.exports = router;
