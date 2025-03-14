const Blog = require('../../models/Blog');
const cloudinary = require('../../config/cloudinary');
const asyncHandler = require('express-async-handler');

// Create Blog
const createBlog = asyncHandler(async (req, res) => {
    try {
        const { title, content } = req.body;

        // Handle image upload if present
        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        const blog = new Blog({
            title,
            content,
            image: imageUrl,
            createDate: new Date()
        });

        const createdBlog = await blog.save();
        res.status(201).json({
            success: true,
            data: createdBlog
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Get All Blogs
const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const blogs = await Blog.find()
            .sort({ createDate: -1 });
        
        res.status(200).json({
            success: true,
            data: blogs
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Get Single Blog
const getBlogById = asyncHandler(async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
    
        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }
        blog.view += 1;
        await blog.save();
    
        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Update Blog
const updateBlog = asyncHandler(async (req, res) => {
    try {
        const { title, content } = req.body;
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        // Handle image upload if present
        let imageUrl = blog.image;
        if (req.file) {
            // Delete old image from Cloudinary if exists
            if (blog.image) {
                const publicId = blog.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.image = imageUrl;

        const updatedBlog = await blog.save();
        res.status(200).json({
            success: true,
            data: updatedBlog
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Delete Blog
const deleteBlog = asyncHandler(async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        // Xóa ảnh trên Cloudinary nếu có
        if (blog.image) {
            const publicId = blog.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        // Xóa blog khỏi database
        await Blog.deleteOne({ _id: req.params.id });

        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});


module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};