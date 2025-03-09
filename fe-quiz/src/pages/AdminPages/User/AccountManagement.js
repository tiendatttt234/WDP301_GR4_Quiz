import React, { useState, useEffect } from 'react';
import './Account.css';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(5);

  useEffect(() => {
    fetch('http://localhost:9999/admin/accounts')
      .then(response => response.json())
      .then(data => setAccounts(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Logic phân trang
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = accounts.slice(indexOfFirstAccount, indexOfLastAccount);
  const totalPages = Math.ceil(accounts.length / accountsPerPage);

  // Hàm đổi trạng thái khóa/tách khóa tài khoản
  const toggleLock = (id, isLocked) => {
    const newLockStatus = !isLocked;
    const token = localStorage.getItem("token"); 

    fetch(`http://localhost:9999/admin/accounts/${id}/lock`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ isLocked: newLockStatus }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(updatedAccount => {
      setAccounts(accounts.map(account =>
        account._id === id ? { ...account, isLocked: newLockStatus } : account
      ));
    })
    .catch(error => console.error('Error updating lock status:', error));
};

  
  return (
    <div className="container">
      <div className="header">
        <input type="text" placeholder="Search" className="search-bar" />
        <select className="sort-select">
          <option value="name">Sort by: Name</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên tài khoản</th>
            <th>Email</th>
            <th>Ngày tạo</th>
            <th>Loại tài khoản</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {currentAccounts.map((account, index) => (
            <tr key={account._id}>
              <td>{indexOfFirstAccount + index + 1}</td>
              <td>{account.userName}</td>
              <td>{account.email}</td>
              <td>{new Date(account.createdAt).toLocaleDateString('en-GB')}</td>
              <td>{account.isPrime ? 'Premium' : 'Basic'}</td>
              <td>
                <button
                  className={account.isLocked ? 'status inactive' : 'status active'}
                  onClick={() => toggleLock(account._id, account.isLocked)}
                >
                  {account.isLocked ? 'Inactive' : 'Active'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <p>Showing data {indexOfFirstAccount + 1} to {Math.min(indexOfLastAccount, accounts.length)} of {accounts.length} entries</p>
        <div className="pagination-buttons">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            &laquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
