import React, { useState, useEffect } from 'react';
import { Avatar, Dropdown, Menu, Switch } from 'antd';
import { UserOutlined, BellOutlined, SunOutlined, MoonOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const AdminHeader = ({ onToggleSidebar }) => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('header-theme') === 'dark';
    });

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
        const header = document.querySelector('.header');
        if (darkMode) {
            header.classList.add('dark-header');
            localStorage.setItem('header-theme', 'dark');
        } else {
            header.classList.remove('dark-header');
            localStorage.setItem('header-theme', 'light');
        }
    }, [darkMode]);

    const handleToggleTheme = () => {
        setDarkMode(prev => !prev);
    };

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
        <div className="header">
            <div className="header-title">
                <MenuOutlined className="header-icon" onClick={onToggleSidebar} />
                Admin Dashboard
            </div>
            <div className="header-actions">
                <BellOutlined className="header-icon" />
                <div className="theme-switch">
                    <Switch
                        checked={darkMode}
                        onChange={handleToggleTheme}
                        checkedChildren={<MoonOutlined />}
                        unCheckedChildren={<SunOutlined />}
                    />
                </div>
                <Dropdown overlay={menu} placement="bottomRight" arrow>
                    <Avatar className="header-avatar" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </div>
    );
};

export default AdminHeader;
