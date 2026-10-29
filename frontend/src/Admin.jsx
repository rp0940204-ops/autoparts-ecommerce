import { useState } from "react";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  brand: "",
  stock: "",
};

function Admin({ products, onChanged, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
  }

  function startEdit(p) {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description || "",
      price: String(p.price),
      category: p.category,
      brand: p.brand || "",
      stock: String(p.stock),
    });
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.category) {
      setError("Name, price and category are required");
      return;
    }

    setBusy(true);
    try {
      const url = editingId ? "/api/products/" + editingId : "/api/products";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong");
      } else {
        cancelEdit();
        onChanged();
      }
    } catch {
      setError("Could not reach the server");
    }
    setBusy(false);
  }

  async function handleDelete(p) {
    if (!window.confirm("Delete " + p.name + "?")) return;
    setError("");
    try {
      const res = await fetch("/api/products/" + p._id, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Could not delete");
      } else {
        onChanged();
      }
    } catch {
      setError("Could not reach the server");
    }
  }

  return (
    <div className="modal-back">
      <div className="modal admin-modal">
        <button className="modal-close" onClick={onClose}>
          x
        </button>
        <h2>Admin: Manage products</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit product" : "Add a new product"}</h3>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
          <input
            placeholder="Category (e.g. Brakes)"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          />
          <input
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => update("brand", e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => update("stock", e.target.value)}
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <div className="admin-actions">
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "Saving..." : editingId ? "Save changes" : "Add product"}
            </button>
            {editingId && (
              <button type="button" className="btn-light" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <h3 className="admin-list-title">All products ({products.length})</h3>
        <div className="admin-list">
          {products.map((p) => (
            <div className="admin-row" key={p._id}>
              <div className="admin-row-info">
                <strong>{p.name}</strong>
                <span>
                  ₹{p.price} | {p.category} | stock {p.stock}
                </span>
              </div>
              <div className="admin-row-buttons">
                <button className="btn-light" onClick={() => startEdit(p)}>
                  Edit
                </button>
                <button className="btn-danger" onClick={() => handleDelete(p)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;