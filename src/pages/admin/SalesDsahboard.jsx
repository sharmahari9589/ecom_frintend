import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import API from "../../api/api.helper"; 

export default function SalesDashboard() {
  const [loading, setLoading] = useState(true);
  const [totalSalesToday, setTotalSalesToday] = useState(0);
  const [ordersThisMonth, setOrdersThisMonth] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlySales, setMonthlySales] = useState([]);
  const [paymentData, setPaymentData] = useState([]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await API.get("/dashboard"); 
        console.log(res);
        
        if (res.data.status) {
          const data = res.data.items; 

          setTotalSalesToday(data.totalSalesToday || 0);
          setOrdersThisMonth(data.ordersThisMonth || 0);
          setTotalRevenue(data.totalRevenue || 0);

          const monthMap = {};
          (data.salesOverview || []).forEach(item => {
            monthMap[item.month] = item.total;
          });
          const allMonths = monthNames.map(m => ({
            month: m,
            sales: monthMap[m] || 0
          }));
          setMonthlySales(allMonths);

          setPaymentData(
            (data.revenueByPayment || []).map(item => ({
              name: item.method.toUpperCase(),
              value: item.total
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Sales Dashboard</h2>
      <Row className="mb-4">
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h5>Total Sales Today</h5>
            <h3>₹{totalSalesToday.toLocaleString()}</h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h5>Orders This Month</h5>
            <h3>{ordersThisMonth}</h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h5>Total Revenue</h5>
            <h3>₹{totalRevenue.toLocaleString()}</h3>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="p-3 shadow-sm">
            <h5>Sales Overview</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySales}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h5>Revenue by Payment Method</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {paymentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
