import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css"; 

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: { count: 0, change: "0%" },
    newUsers: { count: 0, change: "0%" },
    totalQuizzes: { count: 0, change: "0%" },
    premiumUsers: { count: 0, change: "0%" },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:9999/admin/dashboard");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <StatCard title="Total Account" value={stats.totalUsers.count} change={stats.totalUsers.change} />
        <StatCard title="New Account" value={stats.newUsers.count} change={stats.newUsers.change} negative />
        <StatCard title="Account Premium" value={stats.premiumUsers.count} change={stats.premiumUsers.change} />
        <StatCard title="Total Flashcard" value={stats.totalQuizzes.count} change={stats.totalQuizzes.change} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change }) => {
  const isNegative = change.includes("-");
  return (
    <div className="stat-card">
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}</p>
      <span className={`stat-change ${isNegative ? "negative" : "positive"}`}>
        <span className="change-icon">{isNegative ? "↓" : "↑"}</span> {change}
      </span>
    </div>
  );
};

export default Dashboard;
