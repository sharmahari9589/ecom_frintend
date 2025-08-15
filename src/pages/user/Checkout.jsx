import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/slice/cartSlice"; 

export default function CheckoutPage() {
  const cart = useSelector((state) => state.cart.items); // 
  const dispatch = useDispatch();

  const [form, setForm] = useState({ name: "", address: "", payment: "cod" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order placed:", { form, cart });
    alert("Order placed successfully!");
    dispatch(clearCart()); 
  };

  return (
    <Container className="mt-4">
      <h2>Checkout</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Payment Method</Form.Label>
          <Form.Select
            value={form.payment}
            onChange={(e) => setForm({ ...form, payment: e.target.value })}
          >
            <option value="cod">Cash on Delivery</option>
            <option value="card">Credit/Debit Card</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="primary">
          Place Order
        </Button>
      </Form>
    </Container>
  );
}
