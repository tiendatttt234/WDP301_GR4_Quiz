import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [questionFiles, setQuestionFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 6;

  useEffect(() => {
    fetch("http://localhost:9999/questionFile/getAll")
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);
        if (Array.isArray(data.questionFileRespone)) {
          setQuestionFiles(data.questionFileRespone);
          setFilteredFiles(data.questionFileRespone);
        } else {
          console.error("Invalid data format");
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Tìm kiếm khi nhấn nút
  const handleSearch = () => {
    setSearchQuery(tempSearchQuery);
  };

  // Lọc danh sách khi searchQuery thay đổi
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFiles(questionFiles);
    } else {
      const filtered = questionFiles.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, questionFiles]);

  // Phân trang
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);
  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #6366f1, #a855f7)", color: "white", fontFamily: "Arial, sans-serif", paddingBottom: "40px" }}>
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "80px 20px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "24px" }}>Nền tảng học tập trực tuyến</h1>
          <p style={{ maxWidth: "700px", margin: "0 auto 32px", lineHeight: "1.6", fontSize: "16px" }}>
            Bạn thường cảm thấy lạc lõng trong lớp học? Bạn muốn đi trước các bạn cùng lớp và bắt đầu học về các môn học trước? 
            Bạn cảm thấy mình cần luyện tập nhiều hơn? Hãy bắt đầu ngay bây giờ!
          </p>

          <div style={{ position: "relative", maxWidth: "500px", margin: "0 auto" }}>
            <input
              type="text"
              placeholder="Tìm kiếm bộ câu hỏi..."
              value={tempSearchQuery}
              onChange={(e) => setTempSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "none", fontSize: "16px", color: "#333", outline: "none" }}
            />
            <button onClick={handleSearch} style={{ position: "absolute", right: "4px", top: "4px", backgroundColor: "#f97316", color: "white", padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
              <Search size={20} />
            </button>
          </div>

          <button style={{ backgroundColor: "#f97316", color: "white", fontWeight: "500", padding: "12px 32px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "16px", marginTop: "32px" }}>
            Khám phá các môn học
          </button>
        </div>

        {filteredFiles.length > 0 ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", marginTop: "48px" }}>
              {currentFiles.map((file) => (
                <div key={file._id} style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", textAlign: "left", color: "#4b5563", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", transition: "transform 0.2s ease, box-shadow 0.2s ease", cursor: "pointer" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6", marginBottom: "8px" }}>{file.name}</h3>
                  <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px", minHeight: "60px" }}>{file.description || "Không có mô tả"}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#9ca3af", borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
                    <span>{file.arrayQuestion?.length || 0} câu hỏi</span>
                    <span>Tạo bởi: {file.createdBy?.userName || "Không xác định"}</span>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "40px", gap: "8px" }}>
                <button onClick={prevPage} disabled={currentPage === 1} style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", color: "white", border: "none", borderRadius: "4px", padding: "8px 12px", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1 }}>
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => paginate(i + 1)} style={currentPage === i + 1 ? { backgroundColor: "#f97316", color: "white", border: "none", borderRadius: "4px", padding: "8px 12px", cursor: "pointer" } : { backgroundColor: "rgba(255, 255, 255, 0.2)", color: "white", border: "none", borderRadius: "4px", padding: "8px 12px", cursor: "pointer" }}>
                    {i + 1}
                  </button>
                ))}

                <button onClick={nextPage} disabled={currentPage === totalPages} style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", color: "white", border: "none", borderRadius: "4px", padding: "8px 12px", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1 }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px", backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "8px", color: "#4b5563", marginTop: "20px" }}>
            <h3>Không tìm thấy bộ câu hỏi nào</h3>
            <p>Vui lòng thử tìm kiếm với từ khóa khác</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
