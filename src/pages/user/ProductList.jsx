import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import ProductCard from "./ProductCard";
import Filters from "./Filter";
import API from "../../api/api.helper";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await API.get("/products");
        setProducts(response.data.items);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

const handleAddToCart = async (product) => {
  try {
    const response = await API.post("/cart", {
      product: product._id, 
      quantity: 1, 
    });

    if (response.data.status) {
      toast.success(`${product.name} added to cart`);
    } else {
      toast.error(response.data.message || "Failed to add to cart");
    }
  } catch (err) {
    console.error(err);
    toast.error("Error adding product to cart");
  }
};

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
        <ToastContainer/>
      <h2>Products</h2>
      <Filters search={search} setSearch={setSearch} />
      <Row>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Col key={product._id} md={4} className="mb-4">
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info">No products found</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}
