const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = 8001;

mongoose
  .connect("mongodb://localhost:27017/blogify2")
  .then(() => console.log("mongodb connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// ✅ Middleware to pass isAdmin to EJS
app.use((req, res, next) => {
  res.locals.isAdmin = req.cookies.isAdmin === "true"; // now available in all EJS templates
  res.locals.user = req.user; // optional: pass user info
  next();
});

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", { blogs: allBlogs });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

