const User = require("../models/User");

exports.registerGet = (req, res) => {
  res.render("register");
};

exports.registerPost = async (req, res) => {
  const { username, email, phone, password, password2 } = req.body;
  let errors = [];

  if (!username || !email || !phone || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    return res.render("register", {
      errors,
      username,
      email,
      phone,
      password,
      password2,
    });
  }

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      errors.push({ msg: "Username already exists" });
      return res.render("register", {
        errors,
        username,
        email,
        phone,
        password,
        password2,
      });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      errors.push({ msg: "Email already registered" });
      return res.render("register", {
        errors,
        username,
        email,
        phone,
        password,
        password2,
      });
    }

    const newUser = new User({
      username,
      email,
      phone,
      password,
    });

    await newUser.save();
    req.flash("success_msg", "You are now registered and can log in");
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.render("register", {
      errors: [{ msg: "Server error" }],
      username,
      email,
      phone,
      password,
      password2,
    });
  }
};

exports.loginGet = (req, res) => {
  res.render("login");
};

exports.loginPost = async (req, res) => {
  const { username, password } = req.body;
  let errors = [];

  if (!username || !password) {
    errors.push({ msg: "Please enter all fields" });
    return res.render("login", { errors, username, password });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      errors.push({ msg: "Invalid username or password" });
      return res.render("login", { errors, username, password });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      errors.push({ msg: "Invalid username or password" });
      return res.render("login", { errors, username, password });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
    };
    req.flash("success_msg", "You are now logged in");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("login", {
      errors: [{ msg: "Server error" }],
      username,
      password,
    });
  }
};

exports.logout = (req, res) => {
  // Only clear the cookie and redirect to home page without destroying session
  try {
    res.clearCookie("connect.sid");
    req.flash("success_msg", "You are logged out");
    res.redirect("/");
  } catch (error) {
    console.error("Logout error:", error);
    res.redirect("/");
  }
};

exports.forgotGet = (req, res) => {
  res.render("forgot");
};

// For simplicity, forgot password functionality will just render a page.
// Implementing email reset flow is beyond this scope.
