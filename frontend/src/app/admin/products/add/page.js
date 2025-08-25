"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import api from "utils/api";
import { useRouter } from "next/navigation";
import {
  FiTag,
  FiFileText,
  FiDollarSign,
  FiPercent,
  FiPackage,
  FiMaximize,
  FiGrid,
  FiList,
  FiUpload,
} from "react-icons/fi";

export default function AddProduct() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    size: "",
    categoryId: "",
    subCategoryId: "",
    quantity: "",
    discount: "",
    brand: "",
    images: [],
  });
  const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL


  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories/with-subcategories")
      .then((res) => {
        if (res.data?.data) {
          setCategories(res.data.data);
        } else {
          console.error("Unexpected response format:", res.data);
        }
      })
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  useEffect(() => {
    setForm((prev) => ({ ...prev, subCategoryId: "" }));
  }, [form.categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const onDrop = useCallback((acceptedFiles) => {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...acceptedFiles],
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (key !== "images") data.append(key, form[key]);
    });

    form.images.forEach((file) => {
      if (file instanceof File) {
        data.append("images", file);
      }
    });

    try {
      await api.post("/products", data, {
        // headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product Added!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product");
    }
  };

  const subCategories = categories.find(
    (cat) => cat.id.toString() === form.categoryId.toString()
  )?.SubCategories || [];

  return (
    <div className="form-container">
      <h2 className="form-title">Add Product</h2>

      <form onSubmit={handleSubmit} className="styled-form">
        <div className="form-group">
          <label>
            <FiTag style={{ marginRight: 6 }} /> Product Name
          </label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>
            <FiFileText style={{ marginRight: 6 }} /> Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <FiDollarSign style={{ marginRight: 6 }} /> Price (Rs)
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>
              <FiPercent style={{ marginRight: 6 }} /> Discount (%)
            </label>
            <input
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <FiPackage style={{ marginRight: 6 }} /> Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label>
              <FiMaximize style={{ marginRight: 6 }} /> Size
            </label>
            <input name="size" value={form.size} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <FiGrid style={{ marginRight: 6 }} /> Category
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              <FiList style={{ marginRight: 6 }} /> Sub Category
            </label>
            <select
              name="subCategoryId"
              value={form.subCategoryId}
              onChange={handleChange}
              disabled={!subCategories.length}
              required={subCategories.length > 0}
            >
              <option value="">-- Select Sub Category --</option>
              {subCategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dropzone */}
        <div className="form-group">
          <label>
            <FiUpload style={{ marginRight: 6 }} /> Upload Images
          </label>
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>
                <FiUpload style={{ marginRight: 6 }} /> Drop files here...
              </p>
            ) : (
              <p>
                <FiUpload style={{ marginRight: 6 }} /> Drag & Drop or Click to
                Upload
              </p>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="preview-images">
          {form.images.map((img, i) => (
            <img
              key={i}
              src={
                img instanceof File
                  ? URL.createObjectURL(img)
                  : `${UPLOADS_URL}/${img}`
              }
              alt="preview"
              style={{ maxHeight: 100, marginRight: 10 }}
            />
          ))}
        </div>

        <button type="submit" className="form-submit-btn">
          Add Product
        </button>
      </form>
    </div>
  );
}
