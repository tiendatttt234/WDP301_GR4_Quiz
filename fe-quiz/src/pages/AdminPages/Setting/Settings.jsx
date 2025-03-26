"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./Settings.css"

const SettingsPage = () => {
  const [packages, setPackages] = useState([])
  const [openForm, setOpenForm] = useState(false)
  const [openDetail, setOpenDetail] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    durationDays: "",
    features: [""],
    isActive: true,
  })

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await axios.get("http://localhost:9999/admin/admin/premium-packages", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPackages(response.data)
    } catch (error) {
      console.error("Không thể tải danh sách gói", error)
      alert("Không thể tải danh sách gói. Vui lòng thử lại.")
    }
  }

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      await axios.delete(`http://localhost:9999/admin/admin/premium-packages/${selectedPackage?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert("Xóa gói thành công")
      fetchPackages()
      setOpenConfirm(false)
    } catch (error) {
      alert("Không thể xóa gói")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }))
  }

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData((prev) => ({ ...prev, features: newFeatures }))
  }

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }))
  }

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, features: newFeatures }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("accessToken")
      const url = selectedPackage
        ? `http://localhost:9999/admin/admin/premium-packages/${selectedPackage._id}`
        : "http://localhost:9999/admin/admin/premium-packages"
      const method = selectedPackage ? "put" : "post"

      const payload = {
        ...formData,
        price: Number(formData.price),
        durationDays: Number(formData.durationDays),
      }

      await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert(selectedPackage ? "Cập nhật gói thành công" : "Tạo gói thành công")
      fetchPackages()
      setOpenForm(false)
      setFormData({ name: "", description: "", price: "", durationDays: "", features: [""], isActive: true })
    } catch (error) {
      alert("Không thể lưu gói")
    }
  }

  const filteredPackages = packages.filter((pkg) => pkg.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Hàm định dạng giá
  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN");
  };

  return (
    <div className="settings__container">
      <div className="settings__header">
        <h1 className="settings__title">Cài đặt</h1>
        <p className="settings__description">Cấu hình các gói Cao cấp</p>
      </div>

      <div className="settings__divider"></div>

      <div className="settings__section">
        <div className="settings__section-header">
          <h2 className="settings__section-title">Gói Cao cấp</h2>
          <button
            className="settings__btn settings__btn--primary"
            onClick={() => {
              setSelectedPackage(null)
              setFormData({ name: "", description: "", price: "", durationDays: "", features: [""], isActive: true })
              setOpenForm(true)
            }}
          >
            <span className="settings__btn-icon">+</span>
            Thêm Gói Mới
          </button>
        </div>

        <div className="settings__search">
          <input
            type="search"
            placeholder="Tìm kiếm gói..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="settings__search-input"
          />
          <span className="settings__search-icon">🔍</span>
        </div>

        <div className="settings__table-wrapper">
          <table className="settings__table">
            <thead className="settings__table-head">
              <tr>
                <th className="settings__th">Tên</th>
                <th className="settings__th">Giá</th>
                <th className="settings__th">Thời hạn</th>
                <th className="settings__th">Trạng thái</th>
                <th className="settings__th">Ngày tạo</th>
                <th className="settings__th settings__th--actions">Hành động</th>
              </tr>
            </thead>
            <tbody className="settings__table-body">
              {filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan="6" className="settings__empty-state">
                    Không tìm thấy gói nào
                  </td>
                </tr>
              ) : (
                filteredPackages.map((pkg) => (
                  <tr key={pkg._id} className="settings__tr">
                    <td className="settings__td settings__td--name">{pkg.name}</td>
                    <td className="settings__td">{formatPrice(pkg.price)} VND</td>
                    <td className="settings__td">{pkg.durationDays} ngày</td>
                    <td className="settings__td">
                      <span
                        className={`settings__status ${pkg.isActive ? "settings__status--active" : "settings__status--inactive"}`}
                      >
                        {pkg.isActive ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="settings__td">{new Date(pkg.createdAt).toLocaleDateString("vi-VN")}</td>
                    <td className="settings__td settings__td--actions">
                      <div className="settings__actions">
                        <button
                          className="settings__action-btn settings__action-btn--view"
                          onClick={() => {
                            setSelectedPackage(pkg)
                            setOpenDetail(true)
                          }}
                          title="Xem chi tiết"
                        >
                          <span className="settings__action-icon">👁️</span>
                        </button>
                        <button
                          className="settings__action-btn settings__action-btn--edit"
                          onClick={() => {
                            setSelectedPackage(pkg)
                            setFormData({
                              name: pkg.name,
                              description: pkg.description,
                              price: String(pkg.price),
                              durationDays: String(pkg.durationDays),
                              features: pkg.features,
                              isActive: pkg.isActive,
                            })
                            setOpenForm(true)
                          }}
                          title="Chỉnh sửa gói"
                        >
                          <span className="settings__action-icon">✏️</span>
                        </button>
                        <button
                          className="settings__action-btn settings__action-btn--delete"
                          onClick={() => {
                            setSelectedPackage(pkg)
                            setOpenConfirm(true)
                          }}
                          title="Xóa gói"
                        >
                          <span className="settings__action-icon">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {openForm && (
        <div className="settings__modal-overlay" onClick={() => setOpenForm(false)}>
          <div className="settings__modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings__modal-header">
              <h2 className="settings__modal-title">{selectedPackage ? "Chỉnh sửa Gói" : "Thêm Gói Mới"}</h2>
              <p className="settings__modal-description">
                {selectedPackage
                  ? "Cập nhật thông tin chi tiết của gói cao cấp này."
                  : "Tạo một gói cao cấp mới cho người dùng của bạn."}
              </p>
              <button className="settings__modal-close" onClick={() => setOpenForm(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="settings__form">
              <div className="settings__form-content">
                <div className="settings__form-group">
                  <label className="settings__form-label" htmlFor="name">
                    Tên
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="settings__form-input"
                  />
                </div>

                <div className="settings__form-group">
                  <label className="settings__form-label" htmlFor="description">
                    Mô tả
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="settings__form-textarea"
                  ></textarea>
                </div>

                <div className="settings__form-row">
                  <div className="settings__form-group">
                    <label className="settings__form-label" htmlFor="price">
                      Giá (VND)
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="settings__form-input"
                    />
                  </div>
                  <div className="settings__form-group">
                    <label className="settings__form-label" htmlFor="durationDays">
                      Thời hạn (ngày)
                    </label>
                    <input
                      id="durationDays"
                      name="durationDays"
                      type="number"
                      value={formData.durationDays}
                      onChange={handleChange}
                      required
                      min="1"
                      className="settings__form-input"
                    />
                  </div>
                </div>

                <div className="settings__form-group">
                  <div className="settings__features-header">
                    <label className="settings__form-label">Tính năng</label>
                    <button
                      type="button"
                      className="settings__btn settings__btn--small settings__btn--outline"
                      onClick={addFeature}
                    >
                      <span className="settings__btn-icon settings__btn-icon--small">+</span>
                      Thêm Tính năng
                    </button>
                  </div>
                  <div className="settings__features-list">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="settings__feature-item">
                        <input
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          placeholder={`Tính năng ${index + 1}`}
                          required
                          className="settings__form-input"
                        />
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            className="settings__feature-remove"
                            onClick={() => removeFeature(index)}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="settings__form-checkbox">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                    className="settings__checkbox"
                  />
                  <label className="settings__checkbox-label" htmlFor="isActive">
                    Hoạt động
                  </label>
                </div>
              </div>
              <div className="settings__modal-footer">
                <button
                  type="button"
                  className="settings__btn settings__btn--outline"
                  onClick={() => setOpenForm(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="settings__btn settings__btn--primary">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {openDetail && selectedPackage && (
        <div className="settings__modal-overlay" onClick={() => setOpenDetail(false)}>
          <div className="settings__modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings__modal-header">
              <h2 className="settings__modal-title">Chi tiết Gói</h2>
              <button className="settings__modal-close" onClick={() => setOpenDetail(false)}>
                ×
              </button>
            </div>
            <div className="settings__detail-content">
              <div className="settings__detail-row">
                <div className="settings__detail-item">
                  <h4 className="settings__detail-label">Tên</h4>
                  <p className="settings__detail-value">{selectedPackage.name}</p>
                </div>
                <div className="settings__detail-item">
                  <h4 className="settings__detail-label">Trạng thái</h4>
                  <span
                    className={`settings__status ${selectedPackage.isActive ? "settings__status--active" : "settings__status--inactive"}`}
                  >
                    {selectedPackage.isActive ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </div>
              </div>

              <div className="settings__detail-item settings__detail-item--full">
                <h4 className="settings__detail-label">Mô tả</h4>
                <p className="settings__detail-value">{selectedPackage.description}</p>
              </div>

              <div className="settings__detail-row">
                <div className="settings__detail-item">
                  <h4 className="settings__detail-label">Giá</h4>
                  <p className="settings__detail-value">{formatPrice(selectedPackage.price)} VND</p>
                </div>
                <div className="settings__detail-item">
                  <h4 className="settings__detail-label">Thời hạn</h4>
                  <p className="settings__detail-value">{selectedPackage.durationDays} ngày</p>
                </div>
              </div>

              <div className="settings__detail-item settings__detail-item--full">
                <h4 className="settings__detail-label">Tính năng</h4>
                <ul className="settings__features-detail">
                  {selectedPackage.features.map((feature, index) => (
                    <li key={index} className="settings__feature-detail-item">
                      <span className="settings__feature-bullet">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="settings__detail-row">
                <div className="settings__detail-item">
                  <h4 className="settings__detail-label">Ngày tạo</h4>
                  <p className="settings__detail-value">{new Date(selectedPackage.createdAt).toLocaleDateString("vi-VN")}</p>
                </div>
                <div className="settings__detail-item">
                  <h4 className="settings__detail-label">Người tạo</h4>
                  <p className="settings__detail-value">{selectedPackage.createdBy?.userName || "Không xác định"}</p>
                </div>
              </div>
            </div>
            <div className="settings__modal-footer">
              <button className="settings__btn settings__btn--outline" onClick={() => setOpenDetail(false)}>
                Đóng
              </button>
              <button
                className="settings__btn settings__btn--primary"
                onClick={() => {
                  setOpenDetail(false)
                  setFormData({
                    name: selectedPackage.name,
                    description: selectedPackage.description,
                    price: String(selectedPackage.price),
                    durationDays: String(selectedPackage.durationDays),
                    features: selectedPackage.features,
                    isActive: selectedPackage.isActive,
                  })
                  setOpenForm(true)
                }}
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {openConfirm && (
        <div className="settings__modal-overlay" onClick={() => setOpenConfirm(false)}>
          <div className="settings__modal settings__modal--confirm" onClick={(e) => e.stopPropagation()}>
            <div className="settings__modal-header">
              <h2 className="settings__modal-title">Xóa Gói</h2>
              <button className="settings__modal-close" onClick={() => setOpenConfirm(false)}>
                ×
              </button>
            </div>
            <div className="settings__confirm-content">
              <p className="settings__confirm-message">
                Bạn có chắc chắn muốn xóa gói này không? Hành động này không thể hoàn tác.
              </p>
              <div className="settings__package-preview">
                <strong>{selectedPackage?.name}</strong> - {formatPrice(selectedPackage?.price)} VND cho {selectedPackage?.durationDays}{" "}
                ngày
              </div>
            </div>
            <div className="settings__modal-footer">
              <button className="settings__btn settings__btn--outline" onClick={() => setOpenConfirm(false)}>
                Hủy
              </button>
              <button className="settings__btn settings__btn--danger" onClick={handleDelete}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsPage