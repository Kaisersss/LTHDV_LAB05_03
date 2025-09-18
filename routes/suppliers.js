const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const { ensureAuthenticated } = require("../middleware/auth");

router.get("/", ensureAuthenticated, supplierController.listSuppliers);

router.get("/new", ensureAuthenticated, supplierController.showCreateForm);
router.post("/", ensureAuthenticated, supplierController.createSupplier);

router.get("/:id/edit", ensureAuthenticated, supplierController.showEditForm);
router.put("/:id", ensureAuthenticated, supplierController.updateSupplier);

router.delete("/:id", ensureAuthenticated, supplierController.deleteSupplier);

module.exports = router;
