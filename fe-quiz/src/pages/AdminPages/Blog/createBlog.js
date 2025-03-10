import { useState } from "react"
import "./blog.css"

const CreateBlogModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ title: "", content: "", image: null })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Blog</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-layout">
            <div className="form-left">
              <div className="form-group">
                <label>TITLE</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Title....."
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>CONTENT</label>
                <textarea
                  name="content"
                  placeholder="Content....."
                  value={formData.content}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-right">
              <div className="image-upload">
                {formData.image ? (
                  <img
                    src={URL.createObjectURL(formData.image) || "/placeholder.svg"}
                    alt="Preview"
                    className="image-preview"
                  />
                ) : (
                  <div className="image-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
                <input
                  type="file"
                  id="image-input"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="image-input" className="choose-image-btn">
                  Choose image
                </label>
              </div>
            </div>
          </div>

          <div className="modal-divider"></div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="enter-btn">
              Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBlogModal

