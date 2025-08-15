import React from "react";
import { Form, Row, Col } from "react-bootstrap";

export default function Filters({ search, setSearch, category, setCategory }) {
  return (
    <Row className="mb-3">
      <Col md={6}>
        <Form.Control
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Col>
 
    </Row>
  );
}
