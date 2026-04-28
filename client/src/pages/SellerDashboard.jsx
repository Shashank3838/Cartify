import { useState, useEffect } from "react";

function SellerDashboard() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    description: "",
  });

  // FETCH PRODUCTS
  const fetchMyProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products/my-products", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  // ADD PRODUCT
  const handleAddProduct = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ name, price, description }),
    });

    setName("");
    setPrice("");
    setDescription("");

    fetchMyProducts();
  };

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    fetchMyProducts();
  };

  // START EDIT
  const handleEditClick = (product) => {
    setEditingId(product._id);
    setEditData({
      name: product.name,
      price: product.price,
      description: product.description,
    });
  };

  // SAVE EDIT
  const handleUpdate = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(editData),
    });

    setEditingId(null);
    fetchMyProducts();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Seller Dashboard 📦</h2>

      {/* ADD PRODUCT */}
      <form onSubmit={handleAddProduct} className="bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Product Name"
          className="w-full mb-3 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full mb-3 p-2 border rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full mb-3 p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Add Product
        </button>
      </form>

      {/* PRODUCTS */}
      <h3 className="text-xl font-semibold mb-3">My Products</h3>

      {products.map((p) => (
        <div key={p._id} className="bg-white p-4 rounded shadow mb-3">

          {editingId === p._id ? (
            <>
              <input
                className="border p-1 mb-2 w-full"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
              <input
                className="border p-1 mb-2 w-full"
                value={editData.price}
                onChange={(e) =>
                  setEditData({ ...editData, price: e.target.value })
                }
              />
              <input
                className="border p-1 mb-2 w-full"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />

              <button
                onClick={() => handleUpdate(p._id)}
                className="bg-green-500 text-white px-3 py-1 mr-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditingId(null)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h4 className="font-bold">{p.name}</h4>
              <p>₹{p.price}</p>

              <p className="text-sm">
                {p.isApproved ? "Approved ✅" : "Pending ⏳"}
              </p>

              <button
                onClick={() => handleEditClick(p)}
                className="bg-blue-500 text-white px-3 py-1 mr-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default SellerDashboard;