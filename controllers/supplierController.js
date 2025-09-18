const Supplier = require("../models/Supplier");

exports.listSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.render("suppliers/index", { suppliers });
  } catch (err) {
    req.flash("error_msg", "Error fetching suppliers");
    res.redirect("/");
  }
};

exports.showCreateForm = (req, res) => {
  res.render("suppliers/form", {
    supplier: {},
    formAction: "/suppliers",
    formMethod: "POST",
  });
};

exports.createSupplier = async (req, res) => {
  const { name, address, phone } = req.body;
  try {
    const newSupplier = new Supplier({ name, address, phone });
    await newSupplier.save();
    req.flash("success_msg", "Supplier created successfully");
    res.redirect("/suppliers");
  } catch (err) {
    req.flash("error_msg", "Error creating supplier");
    res.redirect("/suppliers");
  }
};

exports.showEditForm = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      req.flash("error_msg", "Supplier not found");
      return res.redirect("/suppliers");
    }
    res.render("suppliers/form", {
      supplier,
      formAction: `/suppliers/${supplier._id}?_method=PUT`,
      formMethod: "POST",
    });
  } catch (err) {
    req.flash("error_msg", "Error fetching supplier");
    res.redirect("/suppliers");
  }
};

exports.updateSupplier = async (req, res) => {
  const { name, address, phone } = req.body;
  try {
    await Supplier.findByIdAndUpdate(req.params.id, { name, address, phone });
    req.flash("success_msg", "Supplier updated successfully");
    res.redirect("/suppliers");
  } catch (err) {
    req.flash("error_msg", "Error updating supplier");
    res.redirect("/suppliers");
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Supplier deleted successfully");
    res.redirect("/suppliers");
  } catch (err) {
    req.flash("error_msg", "Error deleting supplier");
    res.redirect("/suppliers");
  }
};
