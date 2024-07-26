// app.js
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
dotenv.config();
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
// Define the blog schema
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  expert: String,
  meta_title: String,
  meta_description: String,
  featured_image: String,
  author: String,
  categories: String,
  meta_keywords: Array,
  createdAt: String,
  status: String,
  slug: String
});

// Create a model from the schema
const Blog = mongoose.model("Blog", blogSchema);

// Middleware to parse JSON bodies
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// POST request to create a new blog
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "listing.html"));
});
app.get("/create", (req, res) => {
  res.sendFile(path.join(__dirname, "createBlog.html"));
});
app.post("/blogs", (req, res) => {
  const blog = new Blog({ ...req.body });
  blog
    .save()
    .then((doc) => {
      return res.json({ message: "Blog Created Successfully" });
    })
    .catch((err) => {
      console.error(err); // error
    });
});

// GET request to retrieve a blog by ID
app.get("/blogs/:slug", (req, res) => {
  const slug = req.params.slug;
  Blog.findOne({ slug })
    .then((blog) => {
      res.send(blog);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

app.get("/blogs/:slug/edit", (req, res) => {
  const slug = req.params.slug;
  Blog.findOne({ slug })
    .then((blog) => {
      res.send(blog);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

// GET request to retrieve all blogs
app.get("/blogs", (req, res) => {
  Blog.find({})
    .then((blogs) => res.send(blogs))
    .catch((err) => res.status(500).send(err));
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
