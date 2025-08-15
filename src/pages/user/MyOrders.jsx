import React, { useEffect, useState } from "react";
import API from "../../api/api.helper";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    try {
      const { data } = await API.get("/orders/userorder");
      setOrders(data.items || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const getOrderNumber = (id) => {
    if (!id) return "N/A";
    return `ORD-${id.slice(-6).toUpperCase()}`; 
  };

  if (loading) return <p>Loading your orders...</p>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>No data</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>Order ID</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{getOrderNumber(order._id)}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.orderStatus === "Delivered"
                          ? "bg-success"
                          : order.orderStatus === "Pending"
                          ? "bg-warning text-dark"
                          : "bg-danger"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
