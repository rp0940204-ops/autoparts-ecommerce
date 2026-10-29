import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p className="message">Loading...</p>;
  if (error) return <p className="message">{error}</p>;

  return (
    <div className="page">
      <header className="header">
        <h1>AutoParts Store</h1>
        <p>Quality parts for your vehicle</p>
      </header>

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
            <button className="btn">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;