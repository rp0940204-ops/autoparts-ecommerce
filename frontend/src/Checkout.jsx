import { useState } from "react";

function Checkout({ cart, total, onClose, onOrderPlaced }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item._id,
            qty: item.qty,
          })),
          shippingAddress: form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Could not place the order");
      } else {
        onOrderPlaced(data);
      }
    } catch {
      setError("Could not reach the server");
    }

    setBusy(false);
  }

  return (
    <div className="modal-back">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          x
        </button>
        <h2>Checkout</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
          />
          <input
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
          <input
            placeholder="Address"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
          />
          <input
            placeholder="City"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />
          <input
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) => update("pincode", e.target.value)}
          />

          <p className="pay-note">Payment: Cash on Delivery</p>
          <p className="checkout-total">Total: ₹{total}</p>

          {error && <p className="error">{error}</p>}

          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Placing order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;