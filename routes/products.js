const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { ensureAuthenticated } = require("../middleware/auth");

router.get("/", ensureAuthenticated, productController.listProducts);

router.get("/new", ensureAuthenticated, productController.showCreateForm);
router.post("/", ensureAuthenticated, productController.createProduct);

router.get("/:id/edit", ensureAuthenticated, productController.showEditForm);
router.put("/:id", ensureAuthenticated, productController.updateProduct);

router.delete("/:id", ensureAuthenticated, productController.deleteProduct);

module.exports = router;
