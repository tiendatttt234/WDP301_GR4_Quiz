import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import UserHeader from '../components/Header/Header';

const { Header, Content, Footer } = Layout;

const UserDefaultPage = () => {
  const location = useLocation();
  const isStudyPage = location.pathname.includes('/study/');
  const [searchResults, setSearchResults] = useState(null);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isStudyPage && (
        <Header
          style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 1000,
            background: '#fff',
            padding: '0 20px',
          }}
        >
          <UserHeader onSearchResults={handleSearchResults} />
        </Header>
      )}

      <Content
        style={{
          marginTop: isStudyPage ? 0 : '64px',
          padding: '20px',
          background: '#f0f2f5',
          flex: 1,
        }}
      >
        <Outlet context={{ searchResults }} />
      </Content>

      {!isStudyPage && (
        <Footer
          style={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            background: '#fff',
            textAlign: 'center',
            padding: '10px 0',
          }}
        >
          {/* Footer content */}
        </Footer>
      )}
    </Layout>
  );
};

export default UserDefaultPage;