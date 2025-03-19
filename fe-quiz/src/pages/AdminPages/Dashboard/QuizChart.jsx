"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Dropdown, Menu, Space } from "antd"
import { DownOutlined } from "@ant-design/icons"
import "./Dashboard.css"

export default function QuizChart() {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("daily")

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:9999/admin/quiz-statistics")

        if (response.data.success) {
          const formattedData =
            viewMode === "daily"
              ? response.data.dailyData.map((item) => ({ day: item.day.toString(), quizCreated: item.newQuizzes }))
              : response.data.weeklyData.map((item) => ({ day: item.day, quizCreated: item.newQuizzes }))

          setChartData(formattedData)
        } else {
          throw new Error("Failed to load chart data")
        }
      } catch (err) {
        console.error("Error fetching chart data:", err)
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
          label: "This Month",
          onClick: () => setViewMode("daily"),
        },
        {
          key: "weekly",
          label: "This Week",
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
              {viewMode === "daily" ? "This Month" : "This Week"}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>

      <div className="chart-legend">
        <LegendItem color="#ff7043" label="Quiz" />
      </div>

      <div className="chart-wrapper">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
              <Tooltip formatter={(value) => [`Số lượng: ${value}`]} labelFormatter={(label) => `Ngày ${label}`} />
              <Bar
                dataKey="quizCreated"
                fill="#ff7043"
                radius={[4, 4, 0, 0]}
                barSize={viewMode === "daily" ? 15 : 30}
              />
            </BarChart>
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

