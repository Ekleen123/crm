const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Step 1: Start Google Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Handle Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login", session: false }),
  (req, res) => {
    console.log(" Google callback triggered, req.user = ", req.user);

    if (!req.user || !req.user.token) {
      console.error(" No token from passport");
      return res.redirect("http://localhost:5173/login");
    }

    //  Redirect to frontend with token
    res.redirect(`http://localhost:5173/auth/success?token=${req.user.token}`);
  }
);

// DEMO LOGIN 
router.get("/demo", (req, res) => {
  const demoUser = {
    id: "demo-user-123",
    name: "Demo User",
    email: "demo@example.com",
  };

  const token = jwt.sign(demoUser, JWT_SECRET, { expiresIn: "1h" });

  console.log("Demo login issued token:", token);

  res.redirect(`http://localhost:5173/auth/success?token=${token}`);
});

module.exports = router;
