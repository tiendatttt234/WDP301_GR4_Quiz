import { Layout, Row, Col, Typography, Space, Divider, Button } from "antd"
import { Link } from "react-router-dom"
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  TeamOutlined,
} from "@ant-design/icons"
import "./Footer.css"

const { Footer } = Layout
const { Title, Text } = Typography

const UserFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Footer className="custom-footer">
      <div className="footer-content">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={8} lg={8}>
            <div className="footer-section">
              <Title level={5} className="footer-title">
                Quiz 
              </Title>
              <Text className="footer-description">
                Nền tảng học tập trực tuyến hàng đầu với hàng nghìn câu hỏi trắc nghiệm.
              </Text>
              <Space className="social-icons" size="small">
                <Button type="text" icon={<FacebookOutlined />} className="social-button" />
                <Button type="text" icon={<TwitterOutlined />} className="social-button" />
                <Button type="text" icon={<InstagramOutlined />} className="social-button" />
                <Button type="text" icon={<YoutubeOutlined />} className="social-button" />
              </Space>
            </div>
          </Col>

          <Col xs={24} sm={12} md={8} lg={8}>
            <div className="footer-section">
              <Title level={5} className="footer-title">
                Liên kết nhanh
              </Title>
              <ul className="footer-links">
                <li>
                  <Link to="/">
                    <HomeOutlined /> Trang chủ
                  </Link>
                </li>
                <li>
                  <Link to="*">
                    <BookOutlined /> Blog
                  </Link>
                </li>
                <li>
                  <Link to="*">
                    <QuestionCircleOutlined /> Thư viện câu hỏi
                  </Link>
                </li>
                <li>
                  <Link to="*">
                    <TeamOutlined /> Lịch sử làm bài
                  </Link>
                </li>
              </ul>
            </div>
          </Col>

          <Col xs={24} sm={12} md={8} lg={8}>
            <div className="footer-section">
              <Title level={5} className="footer-title">
                Liên hệ
              </Title>
              <ul className="contact-info">
                <li>
                  <MailOutlined /> support@quizmaster.com
                </li>
                <li>
                  <PhoneOutlined /> +84 123 456 789
                </li>
                <li>
                  <HomeOutlined /> Hòa Lạc, Thạch Thất, Hà Nội
                </li>
              </ul>
            </div>
          </Col>
        </Row>

        <Divider className="footer-divider" />

        <div className="footer-bottom">
          <Text className="copyright">© {currentYear} Quiz . Tất cả các quyền được bảo lưu.</Text>
          <Space className="footer-bottom-links" split={<Divider type="vertical" />}>
            <Link to="/terms">Điều khoản</Link>
            <Link to="/privacy">Bảo mật</Link>
            <Link to="/help">Trợ giúp</Link>
          </Space>
        </div>
      </div>
    </Footer>
  )
}

export default UserFooter

