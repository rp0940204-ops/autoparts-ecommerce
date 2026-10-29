import { useEffect, useState } from "react";
import "./App.css";
import AuthForm from "./AuthForm";
import Checkout from "./Checkout";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showAuth, setShowAuth] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  function loadProducts() {
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
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleAuthSuccess(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    setShowAuth(false);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

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

  function startCheckout() {
    if (!user) {
      setShowAuth(true);
    } else {
      setShowCheckout(true);
    }
  }

  function handleOrderPlaced(order) {
    setShowCheckout(false);
    setCart([]);
    setPlacedOrder(order);
    loadProducts();
  }

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  if (loading) return <p className="message">Loading...</p>;
  if (error) return <p className="message">{error}</p>;

  return (
    <div className="page">
      <header className="header">
        <div className="auth-bar">
          {user ? (
            <>
              <span>Hi, {user.name}</span>
              <button className="auth-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <button className="auth-btn" onClick={() => setShowAuth(true)}>
              Login / Register
            </button>
          )}
        </div>
        <h1>AutoParts Store</h1>
        <p>Quality parts for your vehicle</p>
        <div className="cart-badge">Cart: {totalItems} items</div>
      </header>

      {showAuth && (
        <AuthForm
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuth(false)}
        />
      )}

      {showCheckout && (
        <Checkout
          cart={cart}
          total={totalPrice}
          onClose={() => setShowCheckout(false)}
          onOrderPlaced={handleOrderPlaced}
        />
      )}

      {placedOrder && (
        <div className="modal-back">
          <div className="modal">
            <button
              className="modal-close"
              onClick={() => setPlacedOrder(null)}
            >
              x
            </button>
            <h2>Order placed!</h2>
            <p className="success-text">
              Thank you. Your order total is ₹{placedOrder.totalPrice}.
            </p>
            <p className="success-text">
              Order ID: {placedOrder._id.slice(-8)}
            </p>
            <button className="btn full" onClick={() => setPlacedOrder(null)}>
              Continue shopping
            </button>
          </div>
        </div>
      )}

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
            <>
              <div className="total">Total: ₹{totalPrice}</div>
              <button className="btn full" onClick={startCheckout}>
                Checkout
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export default App;