import React, { useState, useEffect } from "react";
import { Table, Button, Container, Modal, Form, Badge } from "react-bootstrap";
import { useForm } from "react-hook-form";
import API from "../../api/api.helper"; 
import jsPDF from "jspdf";

export default function AdminOrderPage() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [orders, setOrders] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");
      setOrders(data.items || data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const generateRandomOrderId = (mongoId) => {
    return "ORD-" + mongoId.slice(-6).toUpperCase();
  };

  const onEditSubmit = async (formData) => {
    if (editIndex === null) return;

    const orderId = orders[editIndex]._id;
    try {
      await API.put(`/orders/${orderId}`, {
        paymentStatus: formData.paymentStatus,
        orderStatus: formData.orderStatus,
      });

      setOrders((prev) =>
        prev.map((order, idx) =>
          idx === editIndex ? { ...order, ...formData } : order
        )
      );

      setShowEditModal(false);
      reset();
      setEditIndex(null);
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const handleEdit = (index) => {
    const order = orders[index];
    if (!order) return;
    setValue("paymentStatus", order.paymentStatus || "pending");
    setValue("orderStatus", order.orderStatus || "pending");
    setEditIndex(index);
    setShowEditModal(true);
  };

  const generateInvoicePDF = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${generateRandomOrderId(order._id)}`, 14, 30);
    doc.text(`Customer: ${order.user?.name}`, 14, 36);
    doc.text(`Email: ${order.user?.email}`, 14, 42);
    doc.text(
      `Address: ${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.zipCode}`,
      14,
      48
    );

    doc.text("Products:", 14, 60);
    let y = 70;
    order.products.forEach((p, index) => {
        console.log(p)
      doc.text(
        `${index + 1}. ${p.product.name} x ${p.quantity} - ₹${p.price}`,
        14,
        y
      );
      y += 6;
    });

    doc.text(`Total Amount: ₹${order.totalAmount}`, 14, y + 10);

    doc.setFontSize(10);
    doc.text("Thank you for your purchase!", 14, y + 20);

    doc.save(`Invoice_${generateRandomOrderId(order._id)}.pdf`);
  };

  return (
    <Container className="mt-4">
      <h2>Admin Orders</h2>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Products</th>
            <th>Total Amount</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Shipping</th>
            <th>Invoice</th>
            <th>Tracking ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order._id}>
                <td>{generateRandomOrderId(order._id)}</td>
                <td>
                  <strong>{order.user?.name}</strong>
                  <br />
                  <small>{order.user?.email}</small>
                </td>
                <td>
                  {order.products.map((p, i) => (
                    <div key={i}>
                      {p.name} × {p.quantity} — ₹{p.price}
                    </div>
                  ))}
                </td>
                <td>₹{order.totalAmount}</td>
                <td>
                  {order.paymentMethod?.toUpperCase()} <br />
                  <Badge
                    bg={
                      order.paymentStatus === "paid"
                        ? "success"
                        : order.paymentStatus === "pending"
                        ? "warning"
                        : "danger"
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
                </td>
                <td>
                  <Badge
                    bg={
                      order.orderStatus === "delivered"
                        ? "success"
                        : order.orderStatus === "shipped"
                        ? "info"
                        : order.orderStatus === "cancelled"
                        ? "danger"
                        : "secondary"
                    }
                  >
                    {order.orderStatus}
                  </Badge>
                </td>
                <td>
                  {order.shippingAddress?.street}, {order.shippingAddress?.city}
                  <br />
                  {order.shippingAddress?.state},{" "}
                  {order.shippingAddress?.zipCode}
                </td>
                <td>
                  {order.orderStatus === "delivered" ? (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => generateInvoicePDF(order)}
                    >
                      Download Invoice
                    </Button>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{order.trackingId || "N/A"}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Order</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onEditSubmit)}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Payment Status</Form.Label>
              <Form.Select {...register("paymentStatus")}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Order Status</Form.Label>
              <Form.Select {...register("orderStatus")}>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
