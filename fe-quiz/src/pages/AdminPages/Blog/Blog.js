"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import CreateBlogModal from "./createBlog"
import EditBlogModal from "./editBlog" // Import the new EditBlogModal
import "./blog.css"

const BlogList = () => {
  const [blogs, setBlogs] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [blogsPerPage] = useState(8)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:9999/admin/blogs")
        setBlogs(response.data.data || [])
      } catch (error) {
        console.error("Error fetching blogs:", error)
      }
    }
    fetchBlogs()
  }, [])

  const filteredBlogs = blogs.filter((blog) => 
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastBlog = currentPage * blogsPerPage
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleCreateBlog = async (formData) => {
    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('content', formData.content)
      if (formData.image) data.append('image', formData.image)

      const response = await axios.post("http://localhost:9999/admin/blogs", data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setBlogs([...blogs, response.data.data])
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error("Error creating blog:", error)
    }
  }

  const handleEditBlog = async (formData) => {
    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('content', formData.content)
      if (formData.image) data.append('image', formData.image)

      const response = await axios.put(`http://localhost:9999/admin/blogs/${selectedBlog._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setBlogs(blogs.map(blog => 
        blog._id === selectedBlog._id ? response.data.data : blog
      ))
      setIsEditModalOpen(false)
      setSelectedBlog(null)
    } catch (error) {
      console.error("Error updating blog:", error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`http://localhost:9999/admin/blogs/${id}`)
        setBlogs(blogs.filter(blog => blog._id !== id))
      } catch (error) {
        console.error("Error deleting blog:", error)
      }
    }
  }

  const openCreateModal = () => setIsCreateModalOpen(true)
  const closeCreateModal = () => setIsCreateModalOpen(false)

  const openEditModal = (blog) => {
    setSelectedBlog(blog)
    setIsEditModalOpen(true)
  }
  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedBlog(null)
  }

  return (
    <div className="container">
      <div className="header-actions">
        <button className="add-blog-btn" onClick={openCreateModal}>
          ADD BLOG <span>+</span>
        </button>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <div className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </div>

      <CreateBlogModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreateBlog}
      />

      <EditBlogModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleEditBlog}
        blog={selectedBlog}
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Creation Day</th>
            <th>View</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentBlogs.map((blog, index) => (
            <tr key={blog._id}>
              <td>{indexOfFirstBlog + index + 1}</td>
              <td>{blog.title}</td>
              <td>{new Date(blog.createDate).toLocaleDateString()}</td>
              <td>{blog.view}</td>
              <td>
                <div className="action-buttons">
                  <button className="action-btn edit-btn" onClick={() => openEditModal(blog)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(blog._id)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6l-1 16H6l-1-16"></path>
                      <path d="M10 11v6"></path>
                      <path d="M14 11v6"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <span className="pagination-info">
          Showing data {indexOfFirstBlog + 1} to {Math.min(indexOfLastBlog, filteredBlogs.length)}
        </span>
        <div className="pagination-buttons">
          <button 
            className="page-btn prev-btn" 
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >           
          </button>
          {Array.from({ length: Math.ceil(filteredBlogs.length / blogsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button 
            className="page-btn next-btn"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredBlogs.length / blogsPerPage)}
          >          
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlogList