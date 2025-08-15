import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Table, Button, Form, Container, Modal } from "react-bootstrap";
import API from "../../api/api.helper";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductForm({ onFileChange, register, errors, previewImage }) {
  return (
    <>
      <Form.Group className="mb-2">
        <Form.Label>Name</Form.Label>
        <Form.Control {...register("name", { required: "Name is required" })} />
        {errors.name && <small className="text-danger">{errors.name.message}</small>}
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Brand</Form.Label>
        <Form.Control {...register("brand")} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={3} {...register("description")} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Category</Form.Label>
        <Form.Control {...register("category")} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Price</Form.Label>
        <Form.Control type="number" {...register("price", { valueAsNumber: true })} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Stock</Form.Label>
        <Form.Control type="number" {...register("stock", { valueAsNumber: true })} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Image</Form.Label>
        <Form.Control type="file" accept="image/*" onChange={onFileChange} />
      </Form.Group>

      {previewImage && (
        <div className="mb-2">
          <img
            src={previewImage}
            alt="Preview"
            width="100"
            height="100"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
    </>
  );
}

export default function AdminProductPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.items);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    reset({});
    setSelectedFile(null);
    setPreviewImage(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (index) => {
    const product = products[index];
    reset(product);
    setSelectedFile(null);
    setCurrentIndex(index);
    setIsEditing(true);

    // Show existing image as preview
    if (product.images && product.images.length > 0) {
      setPreviewImage(`http://localhost:8000${product.images[0].replace(/\\/g, '/')}`);
    } else {
      setPreviewImage(null);
    }

    setShowModal(true);
  };

  const closeModal = () => {
    reset({});
    setSelectedFile(null);
    setPreviewImage(null);
    setShowModal(false);
    setCurrentIndex(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("brand", data.brand || "");
      formData.append("description", data.description || "");
      formData.append("category", data.category || "");
      formData.append("price", data.price || 0);
      formData.append("stock", data.stock || 0);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (isEditing && currentIndex !== null && products[currentIndex]?._id) {
        const productId = products[currentIndex]._id;
        const res = await API.put(`/products/${productId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const updated = [...products];
        updated[currentIndex] = res.data;
        setProducts(updated);
        await fetchProducts();

        toast.success("Product updated successfully");
      } else {
        await API.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        await fetchProducts();
        toast.success("Product added successfully");
      }

      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (index) => {
    try {
      const productId = products[index]._id;
      
      await API.delete(`/products/${productId}`);
      setProducts(products.filter((_, i) => i !== index));

      toast.success("Product deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  return (
    <Container className="mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Admin Product Management</h2>
      <Button variant="primary" onClick={openAddModal}>
        Add Product
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p, index) => (
              <tr key={index}>
                <td>{p.name}</td>
                <td>{p.brand}</td>
                <td>{p.category}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  {p.images && p.images.length > 0 && (
                    <img
                      src={`http://localhost:8000${p.images[0].replace(/\\/g, '/')}`} 
                      alt={p.name}
                      width="50"
                      height="50"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => openEditModal(index)}>
                    Edit
                  </Button>{" "}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(index)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No products added yet
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Product" : "Add Product"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <ProductForm
              register={register}
              errors={errors}
              onFileChange={handleFileChange}
              previewImage={previewImage}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? "Update Product" : "Add Product"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
