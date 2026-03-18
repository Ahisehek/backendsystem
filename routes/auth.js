const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/authmiddle");
const { redirect } = require("react-router-dom");

const router = express.Router();

// Register
// router.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     user = new User({ name, email, password: hashedPassword, role:"user" });
//     await user.save();

//     res.status(201).json({ message: "User registered" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.post("/create-admin", async (req,res)=>{
//   const{name,email,password,secretKey}= req.body;
//   if(role === 'Admin' && secretKey!==process.env.ADMIN_SECRET_KEY){
//     return res.status(404).json({massage:"unauthorized"});
//   }
//    const hashedPassword = await bcrypt.hash(password, 10);

//     admin = new User({ name, email, password: hashedPassword, role:"admin" });
//     await admin.save();

//     res.json({massage:"admin created successfully"});
// })
// ✅ This unified route handles both users and admins

router.post("/register", async (req, res) => {
  let { name, mobile, email, password, role = "user", secretKey } = req.body;

  // Normalize role
  role = role.toLowerCase();

  try {
    // 1. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. If role is 'admin', validate secret key
    if (role === "admin" && secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Invalid secret key" });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save user or admin
    const newUser = new User({
      name,
      mobile,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: `${role} registered successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role }, // ✅ include role
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "Strict", // 1 day
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user-profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("name role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ name: user.name, role: user.role }); // ✅ MUST include role
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

module.exports = router;
