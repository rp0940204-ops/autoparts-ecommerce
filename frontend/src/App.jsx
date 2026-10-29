import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load products");
        setLoading(false);
      });
  }, []);

  function addToCart(product) {
    setCart((current) => {
      const found = current.find((item) => item._id === product._id);
      if (found) {
        if (found.qty >= product.stock) return current;
        return current.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...current, { ...product, qty: 1 }];
    });
  }

  function changeQty(id, amount) {
    setCart((current) =>
      current
        .map((item) =>
          item._id === id
            ? { ...item, qty: Math.min(item.qty + amount, item.stock) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function removeItem(id) {
    setCart((current) => current.filter((item) => item._id !== id));
  }

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  if (loading) return <p className="message">Loading...</p>;
  if (error) return <p className="message">{error}</p>;

  return (
    <div className="page">
      <header className="header">
        <h1>AutoParts Store</h1>
        <p>Quality parts for your vehicle</p>
        <div className="cart-badge">Cart: {totalItems} items</div>
      </header>

      <div className="layout">
        <div className="grid">
          {products.map((p) => (
            <div className="card" key={p._id}>
              <span className="category">{p.category}</span>
              <h3>{p.name}</h3>
              <p className="brand">{p.brand}</p>
              <p className="description">{p.description}</p>
              <div className="bottom">
                <span className="price">₹{p.price}</span>
                <span className="stock">
                  {p.stock > 0 ? p.stock + " in stock" : "Out of stock"}
                </span>
              </div>
              <button
                className="btn"
                disabled={p.stock === 0}
                onClick={() => addToCart(p)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <aside className="cart">
          <h2>Your Cart</h2>
          {cart.length === 0 && <p className="empty">Your cart is empty.</p>}
          {cart.map((item) => (
            <div className="cart-item" key={item._id}>
              <div className="cart-info">
                <strong>{item.name}</strong>
                <span>₹{item.price} each</span>
              </div>
              <div className="cart-controls">
                <button onClick={() => changeQty(item._id, -1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => changeQty(item._id, 1)}>+</button>
                <button className="remove" onClick={() => removeItem(item._id)}>
                  x
                </button>
              </div>
            </div>
          ))}
          {cart.length > 0 && (
            <div className="total">Total: ₹{totalPrice}</div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default App;