"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../utils/api";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="admin-products-container" style={{ height: '100vh' }}>
      <div className="admin-header">
        <h2>Manage Products</h2>
        <button
          className="add-product-btn"
          onClick={() => router.push("/admin/products/add")}
        >
          <FiPlus style={{ marginRight: 6 }} /> Add New Product
        </button>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                {p.images?.length > 0 ? (
                  <img
                    src={`${UPLOADS_URL}/${p.images[0]}`}
                    alt={p.name}
                    className="product-thumb"
                  />
                ) : (
                  <span className="no-image">No Image</span>
                )}
              </td>
              <td>{p.name}</td>
              <td>Rs. {p.price}</td>
              <td>{p.quantity}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => router.push(`/admin/products/edit/${p.id}`)}
                >
                  <FiEdit /> Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteProduct(p.id)}
                >
                  <FiTrash2 /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .admin-products-container {
          padding: 40px;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .add-product-btn {
          background: #af191b;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          display: flex;
          align-items: center;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }

        .add-product-btn:hover {
          background: #8c1416;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          overflow: hidden;
        }

        .products-table th {
          background: #040507;
          color: white;
          padding: 12px;
          text-align: left;
        }

        .products-table td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }

        .product-thumb {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #ccc;
        }

        .no-image {
          color: #999;
          font-size: 14px;
        }

        .edit-btn,
        .delete-btn {
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          margin-right: 8px;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          font-size: 14px;
          gap: 4px;
        }

        .edit-btn {
          background: #af191b;
          color: white;
        }

        .edit-btn:hover {
          background: #8c1416;
        }

        .delete-btn {
          background: #040507;
          color: white;
        }

        .delete-btn:hover {
          background: #1a1b1c;
        }
      `}</style>
    </div>
  );
}