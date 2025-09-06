const mongoose = require("mongoose");

(async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/blogify2", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("❌ Cannot connect:", err);
    process.exit(1);
  }
})();
