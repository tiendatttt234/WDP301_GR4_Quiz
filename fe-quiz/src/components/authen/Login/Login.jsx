import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setMessage({ text: 'Email và mật khẩu là bắt buộc', type: 'error' });
            return;
        }

        try {
            const response = await fetch('http://localhost:9999/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!data.success) {
                setMessage({ text: data.message || 'Email hoặc mật khẩu không chính xác', type: 'error' });
                return;
            }

            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('userName', data.data.userName);

            setMessage({ text: 'Đăng nhập thành công!', type: 'success' });

            const userRoles = data.data.roles.map(role => role.name);
            setTimeout(() => {
                if (userRoles.includes('admin')) {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }, 1000);
        } catch (err) {
            setMessage({ text: 'Lỗi kết nối đến server', type: 'error' });
        }
    };

    return (
        <div className="container">
            <div className="image-section">
                <img
                    src="https://storage.googleapis.com/a1aa/image/Afv_9_ppkeR2-6MQ381HvzwlbIdgFvurbY-M-d0g6Ms.jpg"
                    alt="Hình ảnh minh họa một người đang viết trên sổ trước màn hình máy tính"
                    width="400"
                    height="300"
                />
            </div>
            <div className="form-section">
                <h2>Đăng nhập với</h2>
                <div className="social-login">
                    <a className="facebook" href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
                    <a className="twitter" href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                    <a className="linkedin" href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                </div>
                <div className="divider"><span>Hoặc</span></div>

                {message.text && (
                    <p className={`message ${message.type}`} style={{ color: message.type === 'error' ? 'red' : 'green' }}>
                        {message.text}
                    </p>
                )}

                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Địa chỉ email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label><input type="checkbox" /> Ghi nhớ đăng nhập</label>
                    <a href="#">Quên mật khẩu?</a>
                </div>
                <button className="login-btn" onClick={handleLogin}>ĐĂNG NHẬP</button>
                <div className="register-link">Bạn chưa có tài khoản? <a href="register">Đăng ký</a></div>
            </div>
        </div>
    );
};

export default Login;
