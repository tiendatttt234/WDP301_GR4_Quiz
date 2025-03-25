"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Dropdown, Menu, Space } from "antd"
import { DownOutlined } from "@ant-design/icons"
import "./Dashboard.css"

export default function Chart() {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("daily")

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:9999/admin/statistics")
        if (response.data.success) {
          setChartData(viewMode === "daily" ? response.data.dailyData : response.data.weeklyData)
        } else {
          throw new Error("Không thể tải dữ liệu biểu đồ")
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu biểu đồ:", err)
        setError("Không thể tải dữ liệu biểu đồ")
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [viewMode])

  const menu = (
    <Menu
      items={[
        {
          key: "daily",
          label: "Tháng",
          onClick: () => setViewMode("daily"),
        },
        {
          key: "weekly",
          label: "Tuần",
          onClick: () => setViewMode("weekly"),
        },
      ]}
    />
  )

  if (loading) return <div className="chart-loading">Đang tải...</div>
  if (error) return <div className="chart-error">{error}</div>

  return (
    <div className="chart-container">
      <div className="chart-header">
        <Dropdown overlay={menu}>
          <a onClick={(e) => e.preventDefault()} className="period-selector">
            <Space>
              {viewMode === "daily" ? "Tháng " : "Tuần"}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>

      <div className="chart-legend">
        <LegendItem color="#8884d8" label="Tài khoản mới" />
        <LegendItem color="#4ecdc4" label="Tài khoản trả phí" />
      </div>

      <div className="chart-wrapper">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip formatter={(value) => [`Số lượng: ${value}`]} labelFormatter={(label) => `Ngày ${label}`} />
              <Line type="monotone" dataKey="newUsers" stroke="#8884d8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="newPremiumUsers" stroke="#4ecdc4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-no-data">Không có dữ liệu</div>
        )}
      </div>
    </div>
  )
}

const LegendItem = ({ color, label }) => (
  <div className="legend-item">
    <div className="legend-color" style={{ backgroundColor: color }} />
    <span>{label}</span>
  </div>
)