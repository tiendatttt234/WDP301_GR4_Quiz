"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Loader2, ChevronDown } from "lucide-react"

export default function RevenueChart() {
  const [revenueData, setRevenueData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeView, setActiveView] = useState("daily")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
        <Loader2 style={{ height: "32px", width: "32px", animation: "spin 1s linear infinite" }} />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
        <p style={{ color: "#ef4444" }}>{error}</p>
      </div>
    )
  }

  if (!revenueData) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
        <p style={{ color: "#6b7280" }}>No revenue data available</p>
      </div>
    )
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
        <div
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>{label}</p>
          <p style={{ margin: "2px 0", color: "#8884d8", display: "flex", alignItems: "center" }}>
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                backgroundColor: "#8884d8",
                marginRight: "5px",
                borderRadius: "50%",
              }}
            ></span>
            Revenue: {payload[0].value}
          </p>
          <p style={{ margin: "2px 0", color: "#82ca9d", display: "flex", alignItems: "center" }}>
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                backgroundColor: "#82ca9d",
                marginRight: "5px",
                borderRadius: "50%",
              }}
            ></span>
            Transactions: {payload[1].value}
          </p>
        </div>
      )
    }
    return null
  }

  // Custom legend renderer
  const renderLegend = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              backgroundColor: "#8884d8",
              marginRight: "5px",
              borderRadius: "50%",
            }}
          ></span>
          <span>Revenue</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              backgroundColor: "#82ca9d",
              marginRight: "5px",
              borderRadius: "50%",
            }}
          ></span>
          <span>Transactions</span>
        </div>
      </div>
    )
  }

  return (
    <div className="revenue-chart-container" style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <div className="dropdown-container" style={{ position: "relative" }}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {activeView === "daily" ? "This Month" : "This Week"}
            <ChevronDown size={16} />
          </button>

          {isDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                marginTop: "4px",
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                zIndex: 10,
              }}
            >
              <div
                onClick={() => {
                  setActiveView("daily")
                  setIsDropdownOpen(false)
                }}
                style={{
                  padding: "8px 16px",
                  cursor: "pointer",
                  backgroundColor: activeView === "daily" ? "#f1f5f9" : "transparent",
                  color: activeView === "daily" ? "#3b82f6" : "#1e293b",
                  whiteSpace: "nowrap",
                }}
              >
                Month
              </div>
              <div
                onClick={() => {
                  setActiveView("weekly")
                  setIsDropdownOpen(false)
                }}
                style={{
                  padding: "8px 16px",
                  cursor: "pointer",
                  backgroundColor: activeView === "weekly" ? "#f1f5f9" : "transparent",
                  color: activeView === "weekly" ? "#3b82f6" : "#1e293b",
                  whiteSpace: "nowrap",
                }}
              >
                Weekly
              </div>
            </div>
          )}
        </div>
      </div>

      {renderLegend()}

      <div style={{ height: "300px" }}>
        {activeView === "daily" && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedDailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="transactions"
                stackId="2"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
                name="Transactions"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeView === "weekly" && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData.weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="transactions"
                stackId="2"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
                name="Transactions"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

