import { useState } from "react";
import "./App.css";
import { useEffect, useMemo } from "react";

const API_URL = "https://fakestoreapi.com/products";

function App() {
  const [products, setProducs] = useState([]);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("asc");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("faild to fetch");
        const data = await res.json();
        if (active) setProducs(data);
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    return ["all", ...new Set(products.map((p) => p.category))];
  }, [products]);

  const visibleProducts = useMemo(() => {
    return products
      .filter((p) => category === "all" || p.category === category)
      .slice()
      .sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
  }, [products, category, sort]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      <div
        className="app-container"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: 16,
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.4,
        }}
      >
        <header
          className="app-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2 style={{ margin: 0 }}>Products</h2>
          <div style={{ fontWeight: "bold" }}>Cart: {cart.length}</div>
        </header>

        <div
          className="filters-section"
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 20,
            padding: 12,
            border: "1px solid #eee",
            borderRadius: 10,
          }}
        >
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                padding: "8px 10px",
                border: "1px solid #ddd",
                borderRadius: 8,
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            Sort:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                padding: "8px 10px",
                border: "1px solid #ddd",
                borderRadius: 8,
              }}
            >
              <option value="asc">Price asc</option>
              <option value="desc">Price desc</option>
            </select>
          </label>
        </div>

        <div
          className="products-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {visibleProducts.map((p) => (
            <article
              key={p.id}
              className="product-card"
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 12,
                padding: 12,
                background: "#fff",
              }}
            >
              <h4 style={{ margin: "0 0 8px", fontSize: 14 }}>{p.title}</h4>

              <img
                src={p.image}
                alt={p.title}
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "contain",
                  marginBottom: 10,
                }}
              />

              <p style={{ margin: "0 0 6px", opacity: 0.7 }}>{p.category}</p>
              <p style={{ margin: "0 0 10px", fontWeight: "bold" }}>
                ${p.price}
              </p>

              <button
                onClick={() => addToCart(p)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Add to cart
              </button>
            </article>
          ))}
        </div>

        <div
          className="cart-section"
          style={{
            marginTop: 30,
            paddingTop: 16,
            borderTop: "1px solid #eee",
          }}
        >
          <h3 style={{ marginBottom: 12 }}>Cart Items</h3>

          {cart.length === 0 ? (
            <p style={{ margin: 0, opacity: 0.7 }}>Cart is empty</p>
          ) : (
            <ul
              className="cart-list"
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
              }}
            >
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="cart-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <div
                    className="cart-item-title"
                    title={item.title}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      textAlign: "left",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </div>

                  <button
                    className="cart-remove-button"
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      marginLeft: 16,
                      padding: "6px 12px",
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      background: "#fff",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
