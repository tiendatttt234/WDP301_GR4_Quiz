import React from 'react';
import './Reports.css';

// Dữ liệu mẫu
const sampleData = [
    {
        key: '1',
        reportType: 'Inappropriate Content',
        username: 'john_doe',
        quizId: 'Q123',
        reportDate: '2025-03-01',
        status: 'Pending',
    },
    {
        key: '2',
        reportType: 'Technical Issue',
        username: 'jane_smith',
        quizId: 'Q124',
        reportDate: '2025-03-02',
        status: 'Resolved',
    },
    {
        key: '3',
        reportType: 'Spam',
        username: 'alice_brown',
        quizId: 'Q125',
        reportDate: '2025-03-03',
        status: 'Under Review',
    },
];

const ReportManagement = () => {
    return (
        <div className="reports-container">
            <h1>Báo cáo</h1>
            <table className="reports-table">
                <thead>
                    <tr>
                        <th>Loại báo cáo</th>
                        <th>UserName người gửi</th>
                        <th>ID của quiz bị báo</th>
                        <th>Ngày báo cáo</th>
                        <th>Trạng thái</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sampleData.map((report) => (
                        <tr key={report.key}>
                            <td>{report.reportType}</td>
                            <td>{report.username}</td>
                            <td>{report.quizId}</td>
                            <td>{report.reportDate}</td>
                            <td>
                                {report.status === 'Pending' && (
                                    <span className="status pending">Pending</span>
                                )}
                                {report.status === 'Resolved' && (
                                    <span className="status resolved">Resolved</span>
                                )}
                                {report.status === 'Under Review' && (
                                    <span className="status under-review">Under Review</span>
                                )}
                            </td>
                            <td>
                                <button className="action-btn view">View</button>
                                <button className="action-btn delete">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportManagement;