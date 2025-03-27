import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AllResultsTab from '../../components/SearchComponents/AllResultsTab';
import QuestionFilesTab from '../../components/SearchComponents/QuestionFilesTab';
import UsersTab from '../../components/SearchComponents/UsersTab';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchedTabs, setFetchedTabs] = useState({ all: false, questionFiles: false, users: false });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab') || 'all';
    const urlKeyword = queryParams.get('keyword');

    setActiveTab(tab);
    if (urlKeyword) {
      const decodedKeyword = decodeURIComponent(urlKeyword);
      setKeyword(decodedKeyword);
      if (decodedKeyword.trim().length >= 2 && !fetchedTabs.all) {
        fetchSearchResults(decodedKeyword, 'all');
      }
    } else {
      setSearchResults(null);
    }
  }, [location]);

  const fetchSearchResults = async (searchKeyword, tab) => {
    if (!searchKeyword || searchKeyword.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    setLoading(true);
    try {
      let endpoint;
      if (tab === 'all') {
        endpoint = 'http://localhost:9999/search/all';
      } else if (tab === 'questionFiles') {
        endpoint = 'http://localhost:9999/search/question-files';
      } else if (tab === 'users') {
        endpoint = 'http://localhost:9999/search/users';
      }

      const response = await axios.get(endpoint, {
        params: { keyword: searchKeyword },
      });

      if (response.data.success) {
        if (tab === 'all') {
          setSearchResults(response.data);
        } else if (tab === 'questionFiles') {
          setSearchResults(prev => ({
            ...prev,
            results: {
              ...prev.results,
              questionFiles: response.data.questionFiles || [],
            },
          }));
        } else if (tab === 'users') {
          setSearchResults(prev => ({
            ...prev,
            results: {
              ...prev.results,
              users: response.data.users || [],
            },
          }));
        }
        setFetchedTabs(prev => ({ ...prev, [tab]: true }));
      } else {
        toast.error(response.data.message || 'Không thể tìm kiếm!', {
          position: 'top-right',
          autoClose: 2000,
        });
        setSearchResults(null);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      toast.error('Đã xảy ra lỗi khi tìm kiếm!', {
        position: 'top-right',
        autoClose: 2000,
      });
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (!fetchedTabs[tab]) {
      fetchSearchResults(keyword, tab);
    }
    navigate(`/search?keyword=${encodeURIComponent(keyword)}&tab=${tab}`);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        width: '100%'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f4f6',
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

  if (!keyword || !searchResults || !searchResults.results || (searchResults.results.questionFiles.length === 0 && searchResults.results.users.length === 0)) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
      }}>
        <div style={{
          marginBottom: '40px',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '20px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#111827',
            margin: '0'
          }}>Kết quả cho "<span style={{ color: '#4f46e5' }}>{keyword || 'Không có từ khóa'}</span>"</h1>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 0',
          textAlign: 'center',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '20px'
          }}>🔍</div>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            margin: '0 0 10px 0'
          }}>Không tìm thấy kết quả</p>
          <p style={{
            fontSize: '16px',
            color: '#9ca3af',
            maxWidth: '500px',
            margin: '0'
          }}>Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc của bạn</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    }}>
      <div style={{
        marginBottom: '30px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '20px'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#111827',
          margin: '0'
        }}>Kết quả cho "<span style={{ color: '#4f46e5' }}>{keyword || 'Không có từ khóa'}</span>"</h1>
      </div>

      <div style={{
        marginBottom: '30px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '2px'
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          <button
            style={{
              padding: '12px 20px',
              fontSize: '15px',
              fontWeight: '500',
              color: activeTab === 'all' ? '#4f46e5' : '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'all' ? '3px solid #4f46e5' : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onClick={() => handleTabChange('all')}
          >
            Tất cả kết quả
          </button>
          {searchResults.results.questionFiles.length > 0 && (
            <button
              style={{
                padding: '12px 20px',
                fontSize: '15px',
                fontWeight: '500',
                color: activeTab === 'questionFiles' ? '#4f46e5' : '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'questionFiles' ? '3px solid #4f46e5' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onClick={() => handleTabChange('questionFiles')}
            >
              Học phần
            </button>
          )}
          {searchResults.results.users.length > 0 && (
            <button
              style={{
                padding: '12px 20px',
                fontSize: '15px',
                fontWeight: '500',
                color: activeTab === 'users' ? '#4f46e5' : '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'users' ? '3px solid #4f46e5' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onClick={() => handleTabChange('users')}
            >
              Người dùng
            </button>
          )}
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        {activeTab === 'all' && <AllResultsTab searchResults={searchResults} />}
        {activeTab === 'questionFiles' && <QuestionFilesTab searchResults={searchResults} />}
        {activeTab === 'users' && <UsersTab searchResults={searchResults} />}
      </div>
    </div>
  );
};

export default SearchPage;