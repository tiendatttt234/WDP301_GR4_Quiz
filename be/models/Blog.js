const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title of blog is require"],
      unique: [true, "Title of blog must unique"],
    },
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    createDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: [true, "Status of blog is require"],
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
