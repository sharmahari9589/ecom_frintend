import React, { useState, useEffect } from "react";
import { Table, Button, Container, Modal, Form, Badge } from "react-bootstrap";
import { useForm } from "react-hook-form";
import API from "../../api/api.helper";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminStockPage() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [stockLogs, setStockLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const fetchStockLogs = async () => {
    try {
      const res = await API.get("/stocks"); 
      setStockLogs(res.data.items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch stock logs");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchStockLogs();
    fetchProducts();
  }, []);

  const onAddSubmit = async (data) => {
    try {
      const payload = {
        product: data.product, 
        changeType: data.changeType,
        quantityChanged: parseInt(data.quantityChanged),
        reason: data.reason
      };

      if (currentEditId) {
        await API.put(`/stocks/${currentEditId}`, payload);
        toast.success("Stock log updated successfully");
      } else {
        await API.post("/stocks", payload);
        toast.success("Stock log added successfully");
      }

      reset();
      setShowAddModal(false);
      setCurrentEditId(null);
      fetchStockLogs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save stock log");
    }
  };

  const handleEdit = async (stockLogId) => {
    
    try {
      const res = await API.get(`/stocks/${stockLogId}`);
      
      const log = res.data.items;

      setValue("product", log.product._id);
      setValue("changeType", log.changeType);
      setValue("quantityChanged", log.quantityChanged);
      setValue("reason", log.reason);

      setCurrentEditId(stockLogId);
      setShowAddModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch stock log info");
    }
  };

  const handleDelete = async (stockLogId) => {
    try {
      await API.delete(`/stocks/${stockLogId}`);
      toast.success("Stock log deleted successfully");
      fetchStockLogs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete stock log");
    }
  };

  return (
    <Container className="mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Stock Management</h2>
      <Button variant="primary" onClick={() => { reset(); setCurrentEditId(null); setShowAddModal(true); }}>
        Add Stock Log
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Product</th>
            <th>Change Type</th>
            <th>Quantity</th>
            <th>Reason</th>
            <th>Updated By</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stockLogs.length > 0 ? (
            stockLogs.map((log) => (
              <tr key={log._id}>
                <td>{log.product?.name}</td>
                <td>
                  <Badge bg={log.changeType === "addition" ? "success" : "danger"}>
                    {log.changeType}
                  </Badge>
                </td>
                <td>{log.quantityChanged}</td>
                <td>{log.reason || "N/A"}</td>
                <td>{log.updatedBy?.name || "Unknown"}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleEdit(log._id)}>
                    Edit
                  </Button>{" "}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(log._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No stock logs found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentEditId ? "Edit Stock Log" : "Add Stock Log"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onAddSubmit)}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Select {...register("product", { required: true })}>
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Change Type</Form.Label>
              <Form.Select {...register("changeType", { required: true })}>
                <option value="">Select type</option>
                <option value="addition">Addition</option>
                <option value="deduction">Deduction</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity Changed</Form.Label>
              <Form.Control
                type="number"
                {...register("quantityChanged", { required: true })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                {...register("reason")}
                placeholder="Reason for stock change"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {currentEditId ? "Update Log" : "Add Log"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
