"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Users, UserPlus, Crown, FileText, TrendingUp, TrendingDown } from "lucide-react"
import "./Dashboard.css"
import Chart from "./AccountChart"
import QuizChart from "./QuizChart"
import RevenueChart from "./RevenusChart"

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("charts")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:9999/admin/dashboard")
        setStats(response.data)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
      </div>

      {error && (
        <div className="error-alert">
          <h4>Error</h4>
          <p>{error}</p>
        </div>
      )}

      <div className="stats-grid">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : stats ? (
          <>
            <StatCard
              title="Total Accounts"
              value={stats.totalUsers.count}
              change={stats.totalUsers.change}
              icon={<Users className="stat-icon" />}
            />
            <StatCard
              title="New Accounts"
              value={stats.newUsers.count}
              change={stats.newUsers.change}
              icon={<UserPlus className="stat-icon" />}
            />
            <StatCard
              title="Premium Accounts"
              value={stats.premiumUsers.count}
              change={stats.premiumUsers.change}
              icon={<Crown className="stat-icon" />}
            />
            <StatCard
              title="Total Flashcards"
              value={stats.totalQuizzes.count}
              change={stats.totalQuizzes.change}
              icon={<FileText className="stat-icon" />}
            />
          </>
        ) : (
          <p className="no-stats-message">No statistics available</p>
        )}
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === "charts" ? "active" : ""}`}
            onClick={() => setActiveTab("charts")}
          >
            Charts
          </button>
          <button
            className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "charts" && (
            <div className="charts-container">
              {/* Two-column layout for Account and Quiz charts */}
              <div className="charts-grid">
                <ChartContainer title="Account Chart" description="shows the number of new and premium accounts">
                  {loading ? <ChartSkeleton /> : <Chart />}
                </ChartContainer>
                <ChartContainer title="Flashcard Chart" description="shows the number of new flashcards created">
                  {loading ? <ChartSkeleton /> : <QuizChart />}
                </ChartContainer>
              </div>

              {/* Full-width container for Revenue chart */}
              <ChartContainer title="Revenue Chart" description="shows revenue and transaction statistics">
                <RevenueChart />
              </ChartContainer>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="analytics-card">
              <div className="card-header">
                <h3>Detailed Analytics</h3>
              </div>
              <div className="card-content">
                <p className="coming-soon-message">Detailed analytics will be available soon</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, change, icon }) => {
  const isNegative = change.includes("-")

  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-info">
          <span className="stat-title">{title}</span>
          <span className="stat-value">{value}</span>
        </div>
        <div className="stat-icon-container">{icon}</div>
      </div>
      <div className="stat-change-container">
        {isNegative ? <TrendingDown className="trend-icon negative" /> : <TrendingUp className="trend-icon positive" />}
        <span className={`stat-change ${isNegative ? "negative" : "positive"}`}>{change}</span>
      </div>
    </div>
  )
}

const StatCardSkeleton = () => {
  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-info">
          <div className="skeleton-line small"></div>
          <div className="skeleton-line large"></div>
        </div>
        <div className="skeleton-circle"></div>
      </div>
      <div className="stat-change-container">
        <div className="skeleton-line small"></div>
      </div>
    </div>
  )
}

const ChartContainer = ({ title, description, children }) => {
  return (
    <div className="chart-card">
      <div className="card-header">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="card-content">{children}</div>
    </div>
  )
}

const ChartSkeleton = () => {
  return (
    <div className="chart-skeleton">
      <div className="skeleton-chart"></div>
    </div>
  )
}

export default Dashboard

