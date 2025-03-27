"use client"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
        margin: "30px 0",
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      }}
    >
      <button
        style={{
          padding: "10px 16px",
          backgroundColor: currentPage === 1 ? "#f3f4f6" : "#4f46e5",
          color: currentPage === 1 ? "#9ca3af" : "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          transition: "background-color 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        onMouseOver={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = "#4338ca"
          }
        }}
        onMouseOut={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = "#4f46e5"
          }
        }}
      >
        <span style={{ fontSize: "18px", lineHeight: "1" }}>←</span> Trước
      </button>
      <div
        style={{
          fontSize: "15px",
          color: "#4b5563",
          fontWeight: "500",
        }}
      >
        Trang <span style={{ fontWeight: "600", color: "#111827" }}>{currentPage}</span> / {totalPages}
      </div>
      <button
        style={{
          padding: "10px 16px",
          backgroundColor: currentPage === totalPages ? "#f3f4f6" : "#4f46e5",
          color: currentPage === totalPages ? "#9ca3af" : "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          transition: "background-color 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        onMouseOver={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.backgroundColor = "#4338ca"
          }
        }}
        onMouseOut={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.backgroundColor = "#4f46e5"
          }
        }}
      >
        Tiếp <span style={{ fontSize: "18px", lineHeight: "1" }}>→</span>
      </button>
    </div>
  )
}

export default Pagination

