import React from 'react';
import { Avatar, Button } from 'antd';
import { UserOutlined, BellOutlined, SunOutlined, MenuOutlined } from '@ant-design/icons';
import './Header.css';

const AdminHeader = ({ onToggleSidebar }) => { // Nhận prop để gọi toggleCollapsed
    return (
        <div className="header">

            <div className="header-title">   
            <MenuOutlined className="header-icon" onClick={onToggleSidebar} />
                CoreUI React.js  
            </div>
            <div className="header-actions">
                <BellOutlined className="header-icon" />
                <SunOutlined className="header-icon" />
                <Avatar className="header-avatar" icon={<UserOutlined />} />
                <Button type="text" className="header-logout">
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default AdminHeader;