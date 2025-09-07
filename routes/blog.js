// const { Router } = require("express");
// const multer = require("multer");
// const path = require("path");

// const Blog = require("../models/blog");
// const Comment = require("../models/comment");

// const router = Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.resolve(`./public/uploads/`));
//   },
//   filename: function (req, file, cb) {
//     const fileName = `${Date.now()}-${file.originalname}`;
//     cb(null, fileName);
//   },
// });

// const upload = multer({ storage: storage });

// // ✅ Admin Middleware - Add this function
// function requireAdmin(req, res, next) {
//   if (!req.user) {
//     return res.status(401).render("signin", {
//       error: "Please login to access this page"
//     });
//   }
  
//   if (req.user.role !== "ADMIN") {
//     return res.status(403).render("error", {
//       user: req.user,
//       message: "Access Denied: Admin privileges required to create blogs"
//     });
//   }
  
//   next();
// }

// // ✅ Protected route - Only admins can access blog creation form
// router.get("/add-new", requireAdmin, (req, res) => {
//   return res.render("addBlog", {
//     user: req.user,
//   });
// });

// // ✅ Protected route - Only admins can create blogs
// router.post("/", requireAdmin, upload.single("coverImage"), async (req, res) => {
//   const { title, body } = req.body;
//   const blog = await Blog.create({
//     body,
//     title,
//     createdBy: req.user._id,
//     coverImageURL: `/uploads/${req.file.filename}`,
//   });
//   return res.redirect(`/blog/${blog._id}`);
// });

// // ✅ Public routes - Anyone can view blogs and add comments
// router.get("/:id", async (req, res) => {
//   const blog = await Blog.findById(req.params.id).populate("createdBy");
//   const comments = await Comment.find({ blogId: req.params.id }).populate(
//     "createdBy"
//   );

//   return res.render("blog", {
//     user: req.user,
//     blog,
//     comments,
//   });
// });

// router.post("/comment/:blogId", async (req, res) => {
//   if (!req.user) {
//     return res.redirect("/user/signin");
//   }
  
//   await Comment.create({
//     content: req.body.content,
//     blogId: req.params.blogId,
//     createdBy: req.user._id,
//   });
//   return res.redirect(`/blog/${req.params.blogId}`);
// });

// module.exports = router;

const { Router } = require("express");
const { upload } = require("../config/cloudinary"); // Cloudinary multer
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

// ✅ Admin Middleware
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).render("signin", { error: "Please login to access this page" });
  }
  if (req.user.role !== "ADMIN") {
    return res.status(403).render("error", { user: req.user, message: "Access Denied: Admin privileges required" });
  }
  next();
}

// ✅ Admin - blog creation form
router.get("/add-new", requireAdmin, (req, res) => {
  return res.render("addBlog", { user: req.user });
});

// ✅ Admin - create blog with Cloudinary
router.post("/", requireAdmin, upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;

  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: req.file.path, // Cloudinary URL
  });

  return res.redirect(`/blog/${blog._id}`);
});

// ✅ Public - view single blog
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id)
                         .populate("createdBy", "fullName profileImageURL"); // safer populate

  const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");

  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

// ✅ Add comment
router.post("/comment/:blogId", async (req, res) => {
  if (!req.user) return res.redirect("/user/signin");

  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
