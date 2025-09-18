const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/supplier_product_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secretkey123",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Set locals for flash messages and user session
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.session.user || null;
  next();
});

// Routes
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const supplierRoutes = require("./routes/suppliers");
const productRoutes = require("./routes/products");

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/products", productRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
