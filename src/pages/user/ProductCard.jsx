import React from "react";
import { Card, Button } from "react-bootstrap";

export default function ProductCard({ product, onAddToCart }) {
  const imageUrl = product.images?.[0]
    ? `http://localhost:8000${product.images[0].replace(/\\/g, "/")}`
    : "/images/placeholder.png"; 

  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={imageUrl}
        alt={product.name}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>₹{product.price}</Card.Text>
        <Card.Text>{product.category}</Card.Text>
        <Button
          variant="primary"
          onClick={() => onAddToCart(product)}
          className="mt-auto"
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
}
