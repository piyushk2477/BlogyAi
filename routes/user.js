const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});
     

router.get("/signup", (req, res) => {
  return res.render("signup");
});


router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    
    // ✅ Get user data to set admin cookie
    const user = await User.findOne({ email });
    const isAdmin = user.role === "ADMIN";
    
    return res
      .cookie("token", token)
      .cookie("isAdmin", isAdmin.toString()) // ✅ Set admin cookie
      .redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});


router.get("/logout", (req, res) => {
  res
    .clearCookie("token")
    .clearCookie("isAdmin") // ✅ Clear admin cookie on logout
    .redirect("/");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

module.exports = router;