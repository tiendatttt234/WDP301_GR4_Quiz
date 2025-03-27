"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Dropdown, Menu, Space } from "antd"
import { DownOutlined } from "@ant-design/icons"
import "./Dashboard.css" // Giả sử bạn đã có file CSS tương ứng

export default function RevenueChart() {
  const [revenueData, setRevenueData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("daily")

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:9999/admin/revenue")
        setRevenueData(response.data)
      } catch (err) {
        console.error("Error fetching revenue data:", err)
        setError("Failed to load revenue data")
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueData()
  }, [])

  if (loading) {
    return <div className="chart-loading">Loading...</div>
  }

  if (error) {
    return <div className="chart-error">{error}</div>
  }

  if (!revenueData) {
    return <div className="chart-no-data">No revenue data available</div>
  }

  // Format daily data for the chart
  const formattedDailyData = revenueData.dailyData.map((item) => ({
    date: `${item.day}/${revenueData.month}`,
    revenue: item.revenue,
    transactions: item.transactions,
  }))

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #ccc" }}>
          <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>{label}</p>
          <p style={{ margin: "2px 0", color: "#8884d8" }}>Doanh Thu: {payload[0].value}</p>
          <p style={{ margin: "2px 0", color: "#82ca9d" }}>Giao Dịch: {payload[1].value}</p>
        </div>
      )
    }
    return null
  }

  // Menu cho Dropdown
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

  // Custom legend renderer
  const renderLegend = () => {
    return (
      <div className="chart-legend">
        <LegendItem color="#8884d8" label="Doanh Thu" />
        <LegendItem color="#82ca9d" label="Giao Dịch" />
      </div>
    )
  }

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

      {renderLegend()}

      <div className="chart-wrapper">
        {viewMode === "daily" && (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={formattedDailyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
                name="Doanh Thu"
              />
              <Area
                type="monotone"
                dataKey="transactions"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
                name="Giao Dịch"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {viewMode === "weekly" && (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData.weeklyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
                name="Doanh Thu"
              />
              <Area
                type="monotone"
                dataKey="transactions"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
                name="Giao Dịch"
              />
            </AreaChart>
          </ResponsiveContainer>
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