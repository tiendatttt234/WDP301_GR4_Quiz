import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    const styles = {
        body: {
            fontFamily: 'Arial, sans-serif',
            margin: 0,
            padding: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5',
        },
        container: {
            display: 'flex',
            backgroundColor: '#fff',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
            maxWidth: '900px',
            width: '100%',
        },
        imageSection: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
        },
        image: {
            maxWidth: '100%',
            height: 'auto',
        },
        formSection: {
            flex: 1,
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        },
        heading: {
            marginBottom: '20px',
            fontSize: '24px',
            color: '#333',
        },
        socialLogin: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
        },
        socialIcon: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '18px',
        },
        facebookIcon: {
            backgroundColor: '#3b5998',
        },
        twitterIcon: {
            backgroundColor: '#1da1f2',
        },
        linkedinIcon: {
            backgroundColor: '#0077b5',
        },
        divider: {
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
        },
        dividerBeforeAfter: {
            content: '""',
            flex: 1,
            height: '1px',
            backgroundColor: '#ddd',
        },
        dividerSpan: {
            margin: '0 10px',
            color: '#666',
        },
        formGroup: {
            marginBottom: '20px',
        },
        input: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
        },
        label: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            color: '#666',
        },
        checkbox: {
            marginRight: '10px',
        },
        link: {
            marginLeft: 'auto',
            fontSize: '14px',
            color: '#007bff',
            textDecoration: 'none',
        },
        linkHover: {
            textDecoration: 'underline',
        },
        loginBtn: {
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
        },
        loginBtnHover: {
            backgroundColor: '#0056b3',
        },
        registerLink: {
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '14px',
        },
        registerLinkA: {
            color: '#ff0000',
            textDecoration: 'none',
        },
        messageError: {
            color: 'red',
        },
        messageSuccess: {
            color: 'green',
        },
    };

    // Media query styles can be handled with conditional rendering or window resize listener
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        styles.container = {
            ...styles.container,
            flexDirection: 'column',
        };
        styles.imageSection = {
            ...styles.imageSection,
            flex: 'none',
            width: '100%',
        };
        styles.formSection = {
            ...styles.formSection,
            flex: 'none',
            width: '100%',
        };
    }

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
            console.log("Dữ liệu từ API:", data);
    
            if (!data.success) {
                setMessage({ text: data.message || 'Email hoặc mật khẩu không chính xác', type: 'error' });
                return;
            }
    
            const { accessToken, userName, id, roles } = data.data;

    
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('userName', userName);
            localStorage.setItem('id', id);
    
            setMessage({ text: 'Đăng nhập thành công!', type: 'success' });
    
            setTimeout(() => {
                if (roles.some(role => role.name === 'admin')) {
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
        <div style={styles.body}>
            <div style={styles.container}>
                <div style={styles.imageSection}>
                    <img
                        src="https://storage.googleapis.com/a1aa/image/Afv_9_ppkeR2-6MQ381HvzwlbIdgFvurbY-M-d0g6Ms.jpg"
                        alt="Hình ảnh minh họa một người đang viết trên sổ trước màn hình máy tính"
                        style={styles.image}
                    />
                </div>
                <div style={styles.formSection}>
                    <h2 style={styles.heading}>Đăng nhập với</h2>
                    <div style={styles.socialLogin}>
                        <a href="#" style={{...styles.socialIcon, ...styles.facebookIcon}}>
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="#" style={{...styles.socialIcon, ...styles.twitterIcon}}>
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a href="#" style={{...styles.socialIcon, ...styles.linkedinIcon}}>
                            <FontAwesomeIcon icon={faLinkedinIn} />
                        </a>
                    </div>
                    <div style={styles.divider}>
                        <div style={styles.dividerBeforeAfter}></div>
                        <span style={styles.dividerSpan}>Hoặc</span>
                        <div style={styles.dividerBeforeAfter}></div>
                    </div>

                    {message.text && (
                        <p style={message.type === 'error' ? styles.messageError : styles.messageSuccess}>
                            {message.text}
                        </p>
                    )}

                    <div style={styles.formGroup}>
                        <input
                            type="email"
                            placeholder="Địa chỉ email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={{...styles.formGroup, display: 'flex', justifyContent: 'space-between'}}>
                        <label style={styles.label}>
                            <input type="checkbox" style={styles.checkbox} /> 
                            Ghi nhớ đăng nhập
                        </label>
                        <a href="/forgot-password" style={styles.link}>Quên mật khẩu?</a>
                    </div>
                    <button 
                        style={styles.loginBtn} 
                        onClick={handleLogin}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                    >
                        ĐĂNG NHẬP
                    </button>
                    <div style={styles.registerLink}>
                        Bạn chưa có tài khoản? <a href="register" style={styles.registerLinkA}>Đăng ký</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;