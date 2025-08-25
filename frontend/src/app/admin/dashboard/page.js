"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import api from "utils/api";
import { FiBox, FiShoppingCart, FiTruck, FiCheckCircle, FiClock } from "react-icons/fi";
import Loader from "@/components/Loader";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    salesData: [],
  });

  const [filter, setFilter] = useState("daily");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      let query = `/dashboard/stats?filter=${filter}`;
      if (filter === "custom" && fromDate && toDate) {
        query += `&fromDate=${fromDate}&toDate=${toDate}`;
      }

      const res = await api.get(query);
      const data = res.data;

      setStats({
        totalOrders: data.totalOrders ?? 0,
        totalSales: parseFloat(data.totalSales || 0).toFixed(2),
        shippedOrders: data.shippedOrders ?? 0,
        deliveredOrders: data.deliveredOrders ?? 0,
        cancelledOrders: data.cancelledOrders ?? 0,
        salesData: Array.isArray(data.salesData) ? data.salesData : [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 800); // Smooth delay
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/admin/login");
    fetchStats();
  }, []);

  const chartOptions = {
    chart: { type: "bar" },
    xaxis: { categories: stats.salesData.map((d) => d.month || "") },
    colors: ["#AF191B"],
  };

  const chartSeries = [
    { name: "Sales", data: stats.salesData.map((d) => Number(d.amount).toFixed(2)) },
  ];

  const cards = [
    { title: "Total Orders", value: stats.totalOrders, icon: <FiShoppingCart />, color: "#2563eb" },
    { title: "Total Sales", value: `Rs. ${stats.totalSales}`, icon: <FiBox />, color: "#16a34a" },
    { title: "Shipped Orders", value: stats.shippedOrders, icon: <FiTruck />, color: "#f97316" },
    { title: "Delivered Orders", value: stats.deliveredOrders, icon: <FiCheckCircle />, color: "#10b981" },
    { title: "Pending Orders", value: stats.cancelledOrders, icon: <FiClock />, color: "#dc2626" },
  ];

  if (loading) return <Loader text="Loading Admin Dashboard..." />;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-actions">
          <button onClick={() => router.push("/admin/products")} className="btn-red">
            Manage Products
          </button>
          <button onClick={() => router.push("/admin/orders")} className="btn-dark">
            View Orders
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="custom">Custom</option>
        </select>

        {filter === "custom" && (
          <>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </>
        )}

        <button className="btn-red" onClick={fetchStats}>Apply Filter</button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {cards.map((card, i) => (
          <div key={i} className="stat-card">
            <div className="icon-box" style={{ background: card.color + "20", color: card.color }}>
              {card.icon}
            </div>
            <div>
              <h3>{card.title}</h3>
              <p>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="chart-section">
        {stats.salesData.length > 0 ? (
          <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
        ) : (
          <p style={{ textAlign: "center" }}>📉 No sales data found</p>
        )}
      </div>

      <style jsx>{`
        .dashboard-container {
          padding: 40px;
          max-width: 1200px;
          margin: auto;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .dashboard-header h1 {
          font-size: 26px;
          font-weight: 600;
        }
        .dashboard-actions {
          display: flex;
          gap: 8px;
        }
        .btn-red,
        .btn-dark {
          padding: 8px 14px;
          font-size: 13px;
          border: none;
          height:35px;
          border-radius: 5px;
          cursor: pointer;
        }
        .btn-red {
          background: #af191b;
          color: white;
        }
        .btn-dark {
          background: #040507;
          color: white;
        }
        .btn-red:hover,
        .btn-dark:hover {
          opacity: 0.9;
        }
        .filter-section {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        select,
        input[type="date"] {
          padding: 8px;
          font-size: 13px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 25px;
        }
        .stat-card {
          background: white;
          padding: 16px;
          border-radius: 10px;
          display: flex;
          gap: 10px;
          align-items: center;
          box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.08);
          transition: 0.3s;
        }
        .stat-card:hover {
          transform: translateY(-3px);
        }
        .icon-box {
          font-size: 26px;
          padding: 8px;
          border-radius: 10px;
          flex-shrink: 0;
        }
        .chart-section {
          background: white;
          padding: 18px;
          border-radius: 10px;
          box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
}