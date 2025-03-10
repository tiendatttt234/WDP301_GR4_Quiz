import { useEffect, useState } from "react"
import axios from "axios"
import "./Dashboard.css"
import Chart from "./AccountChart"
import QuizChart from "./QuizChart"
const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {stats ? (
          <>
            <StatCard title="Total Account" value={stats.totalUsers.count} change={stats.totalUsers.change} />
            <StatCard title="New Account" value={stats.newUsers.count} change={stats.newUsers.change} />
            <StatCard title="Account Premium" value={stats.premiumUsers.count} change={stats.premiumUsers.change} />
            <StatCard title="Total Flashcard" value={stats.totalQuizzes.count} change={stats.totalQuizzes.change} />
          </>
        ) : (
          <p>No statistics available</p>
        )}
      </div>

      <div className="charts-row">
        <div className="chart-column">
          <Chart />
        </div>
        <div className="chart-divider"></div>
        <div className="chart-column">
          <QuizChart />
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, change }) => {
  const isNegative = change.includes("-")
  return (
    <div className="stat-card">
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}</p>
      <span className={`stat-change ${isNegative ? "negative" : "positive"}`}>
        <span className="change-icon">{isNegative ? "↓" : "↑"}</span> {change}
      </span>
    </div>
  )
}

export default Dashboard

