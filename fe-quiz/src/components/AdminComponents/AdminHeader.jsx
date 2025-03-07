import React, { useState, useEffect } from 'react';
import { Avatar, Dropdown, Menu, Switch } from 'antd';
import { UserOutlined, BellOutlined, SunOutlined, MoonOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const AdminHeader = ({ onToggleSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const menu = (
        <Menu>
            <Menu.Item key="logout" danger onClick={handleLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );
    //thêm thông báo của phía admin vào trong bell
    return (
        <div className="header-admin">
            <div className="header-title">
                <MenuOutlined className="header-icon" onClick={onToggleSidebar} />
                Admin Dashboard
            </div>
            <div className="header-actions">
                <BellOutlined className="header-icon" />
                <Dropdown overlay={menu} placement="bottomRight" arrow>
                    <Avatar className="header-avatar" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </div>
    );
};

export default AdminHeader;
