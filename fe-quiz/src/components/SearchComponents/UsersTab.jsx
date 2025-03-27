import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UsersTab = ({ searchResults }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchResults || !searchResults.results || !searchResults.results.users) {
      setData([]);
      return;
    }

    setLoading(true);
    try {
      setData(searchResults.results.users || []);
    } catch (error) {
      console.error("Error processing users:", error);
      toast.error("Đã xảy ra lỗi khi xử lý người dùng!", {
        position: "top-right",
        autoClose: 2000,
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [searchResults]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f4f6',
          borderTopColor: '#4f46e5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    }}>
      <h2 style={{
        fontSize: '22px',
        fontWeight: '600',
        color: '#111827',
        marginTop: '0',
        marginBottom: '25px',
        paddingBottom: '15px',
        borderBottom: '1px solid #e5e7eb'
      }}>Người dùng</h2>

      {data.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '25px'
        }}>
          {data.map((user) => (
            <div 
              key={user._id} 
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                padding: '25px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                border: '1px solid #e5e7eb'
              }}
              onClick={() => navigate(`/users/${user._id}`)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
              }}
            >
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                overflow: 'hidden',
                marginBottom: '20px',
                backgroundColor: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #f3f4f6'
              }}>
                {user.avatar ? (
                  <img 
                    src={user.avatar || "/placeholder.svg"} 
                    alt={user.userName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.svg?height=90&width=90";
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    fontSize: '36px',
                    fontWeight: 'bold'
                  }}>
                    {user.userName ? user.userName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 15px 0'
              }}>{user.userName}</h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f3f4f6',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                color: '#4b5563',
                fontWeight: '500'
              }}>
                <span style={{ marginRight: '8px' }}>📚</span>
                <span>{user.questionFileCount || 0} học phần</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 0',
          textAlign: 'center',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '20px'
          }}>👤</div>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            margin: '0'
          }}>Không tìm thấy người dùng</p>
        </div>
      )}
    </div>
  );
};

export default UsersTab;