"use client"

import React from "react"
import { Link } from "react-router-dom" // Changed from next/link to react-router-dom

const Footer = () => {
  // Define styles as objects (unchanged)
  const styles = {
    footer: {
      backgroundColor: "#f9fafb",
      padding: "3rem 1rem",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "2rem",
    },
    gridDesktop: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "2rem",
    },
    flexCol: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    logo: {
      width: "40px",
      height: "40px",
      color: "#4f46e5",
    },
    contactItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      color: "#4b5563",
    },
    heading: {
      fontSize: "1.125rem",
      fontWeight: "500",
      marginBottom: "1rem",
    },
    linksList: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    },
    link: {
      color: "#4b5563",
      textDecoration: "none",
    },
    linkHover: {
      color: "#111827",
    },
    socialContainer: {
      display: "flex",
      gap: "0.75rem",
    },
    socialIcon: {
      backgroundColor: "#000000",
      borderRadius: "9999px",
      padding: "0.5rem",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    socialIconHover: {
      backgroundColor: "#1f2937",
    },
    srOnly: {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      borderWidth: "0",
    },
    copyright: {
      marginTop: "3rem",
      textAlign: "center",
      color: "#4b5563",
    },
  }

  // Media query handling with useEffect and window.matchMedia (unchanged)
  const [isDesktop, setIsDesktop] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")
    setIsDesktop(mediaQuery.matches)

    const handleResize = (e) => {
      setIsDesktop(e.matches)
    }

    mediaQuery.addEventListener("change", handleResize)
    return () => mediaQuery.removeEventListener("change", handleResize)
  }, [])

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={isDesktop ? styles.gridDesktop : styles.grid}>
          {/* Logo and Contact Info (unchanged) */}
          <div style={styles.flexCol}>
            <div style={styles.logo}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "inherit" }}>
                <path
                  d="M3 6.2C3 4.4 4.4 3 6.2 3H17.8C19.6 3 21 4.4 21 6.2V17.8C21 19.6 19.6 21 17.8 21H6.2C4.4 21 3 19.6 3 17.8V6.2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12L9 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M15 15V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 12V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={styles.contactItem}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>contact@quizpractice.vn</span>
            </div>
            <div style={styles.contactItem}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>0123 456 789</span>
            </div>
          </div>

          {/* Quick Links - Changed to use react-router-dom Link */}
          <div>
            <h3 style={styles.heading}>Liên Kết Nhanh</h3>
            <ul style={styles.linksList}>
              <li>
                <Link
                  to="/"
                  style={styles.link}
                  onMouseOver={(e) => (e.currentTarget.style.color = styles.linkHover.color)}
                  onMouseOut={(e) => (e.currentTarget.style.color = styles.link.color)}
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  style={styles.link}
                  onMouseOver={(e) => (e.currentTarget.style.color = styles.linkHover.color)}
                  onMouseOut={(e) => (e.currentTarget.style.color = styles.link.color)}
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  style={styles.link}
                  onMouseOver={(e) => (e.currentTarget.style.color = styles.linkHover.color)}
                  onMouseOut={(e) => (e.currentTarget.style.color = styles.link.color)}
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  style={styles.link}
                  onMouseOver={(e) => (e.currentTarget.style.color = styles.linkHover.color)}
                  onMouseOut={(e) => (e.currentTarget.style.color = styles.link.color)}
                >
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us (unchanged) */}
          <div>
            <h3 style={styles.heading}>Kết Nối Với Chúng Tôi</h3>
            <div style={styles.socialContainer}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialIcon}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.socialIconHover.backgroundColor)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.socialIcon.backgroundColor)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <span style={styles.srOnly}>Facebook</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialIcon}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.socialIconHover.backgroundColor)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.socialIcon.backgroundColor)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <span style={styles.srOnly}>Twitter</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialIcon}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.socialIconHover.backgroundColor)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.socialIcon.backgroundColor)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span style={styles.srOnly}>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright (unchanged) */}
        <div style={styles.copyright}>
          <p>© SE1764NJ_Group 4_Quiz Practice</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;