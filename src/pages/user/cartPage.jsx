import React, { useState, useEffect } from "react";
import { Table, Button, Container, Spinner, Alert } from "react-bootstrap";
import API from "../../api/api.helper";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import "react-toastify/dist/ReactToastify.css";

const stripePromise = loadStripe(
  "pk_test_51RvjjFRwgdlmg51NH7Ic36lTv6Jji9lrlFBVq9RQh74FZrNC5S2Heab5ZeuzS5rmVGXBWCAoTj7np6AgAKQdf4w800SCXWFr0x"
);

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await API.get("/cart");
      if (response.data.status) {
        setCartItems(response.data.items.items || []);
      } else {
        toast.error(response.data.message || "Failed to load cart");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (cartItemId) => {
    try {
      const response = await API.delete(`/cart/${cartItemId}`);
      if (response.data.status) {
        toast.success("Item removed from cart");
        fetchCart();
      } else {
        toast.error(response.data.message || "Failed to remove item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.product.price || 0) * (item.quantity || 0),
    0
  );

  const handleCheckout = async () => {
    try {
      const response = await API.post("/orders", {
        products: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          productName: item.product.name,
        })),
        totalAmount: totalPrice,
        paymentMethod: "card",
        shippingAddress: {}, 
      });

      if (!response.data.status) {
        return toast.error(response.data.message || "Failed to create order");
      }

      const stripe = await stripePromise;
      

      await stripe.redirectToCheckout({ sessionId: response.data.items.stripeSessionId });
    } catch (err) {
      console.error(err);
      toast.error("Checkout failed");
    }
  };

  if (loading) return <Container className="mt-4 text-center"><Spinner animation="border" /></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mt-4">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price (₹)</th>
                <th>Qty</th>
                <th>Total (₹)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.product.name}</td>
                  <td>₹{item.product.price?.toLocaleString("en-IN") || "0"}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      readOnly
                      style={{ width: "70px", textAlign: "center" }}
                    />
                  </td>
                  <td>₹{((item.product.price || 0) * (item.quantity || 0)).toLocaleString("en-IN")}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleRemove(item._id)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h4>Total: ₹{totalPrice.toLocaleString("en-IN")}</h4>
          <Button variant="success" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </>
      )}
    </Container>
  );
}
