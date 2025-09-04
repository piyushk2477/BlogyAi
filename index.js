//to change specific file in git
// git add file1.js file2.html//first go to specific file and then add
// git commit -m "Updated files"
// git push


//to change all files in git
// git add .        # Adds all changed files
// git status       # Check what is staged
// git commit -m "Your commit message"
// git push


//db.blogs.deleteMany({})//delete all documents
//db.blogs.drop()//delete collection
//db.blogs.deleteOne({ _id: ObjectId("64f5e1234567890abcdef123") })

// In MongoDB compass or mongo shell to update a user's role to ADMIN
// db.users.updateOne(
//   { email: "your-admin-email@example.com" }, 
//   { $set: { role: "ADMIN" } }
// )
require('dotenv').config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.use((req, res, next) => {
  res.locals.isAdmin = req.cookies.isAdmin === "true";
  res.locals.user = req.user;
  next();
});

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", { blogs: allBlogs });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
