// Git Commands
// To change specific files in git
// git add file1.js file2.html
// git commit -m "Updated files"
// git push

// To change all files in git
// git add .        # Adds all changed files
// git status       # Check what is staged
// git commit -m "Your commit message"
// git push
//hCtEKmVu0nO6pOFo
// MongoDB Commands
// db.blogs.deleteMany({})         // delete all documents
// db.blogs.drop()                 // delete collection
// db.blogs.deleteOne({ _id: ObjectId("64f5e1234567890abcdef123") })

// In MongoDB Compass or mongo shell to update a user's role to ADMIN
// db.users.updateOne(
//   { email: "john2@gmail.com" },
//   { $set: { role: "ADMIN" } }
// )

// --------------------------- Server Code ---------------------------
require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
// const PORT = 8000;
const PORT = process.env.PORT || 8000;

// ✅ MongoDB Connection
// mongoose
//   .connect("mongodb://localhost:27017/blogify3")
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// ✅ View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// ✅ Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// ✅ Middleware to pass user & isAdmin to EJS
app.use((req, res, next) => {
  res.locals.isAdmin = req.cookies.isAdmin === "true"; // available in all EJS templates
  res.locals.user = req.user; // pass user info if available
  next();
});

// ✅ Routes
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", { blogs: allBlogs });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
