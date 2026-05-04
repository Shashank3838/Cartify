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

  const fetchMyProducts = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/my-products`, {
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

  const handleAddProduct = async (e) => {
    e.preventDefault();

    await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
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

  const handleDelete = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    fetchMyProducts();
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setEditData({
      name: product.name,
      price: product.price,
      description: product.description,
    });
  };

  const handleUpdate = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
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
    <div className="bg-gray-100 min-h-screen px-6 py-8">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-3xl font-semibold text-gray-900 mb-6">
          Seller Dashboard 📦
        </h2>

        <form
          onSubmit={handleAddProduct}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Add New Product
          </h3>

          <input
            type="text"
            placeholder="Product Name"
            className="w-full mb-3 px-4 py-2 rounded-lg border border-gray-300 
            focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full mb-3 px-4 py-2 rounded-lg border border-gray-300 
            focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-300 
            focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            className="w-full py-2.5 rounded-xl bg-black text-white 
            font-medium tracking-wide
            hover:bg-gray-900 hover:scale-[1.02] 
            active:scale-95 transition-all"
          >
            Add Product
          </button>
        </form>

        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          My Products
        </h3>

        <div className="space-y-4">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-md p-5 
              hover:shadow-xl transition-all duration-300"
            >
              {editingId === p._id ? (
                <>
                  <input
                    className="w-full mb-2 px-3 py-2 border rounded-lg"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />

                  <input
                    className="w-full mb-2 px-3 py-2 border rounded-lg"
                    value={editData.price}
                    onChange={(e) =>
                      setEditData({ ...editData, price: e.target.value })
                    }
                  />

                  <textarea
                    className="w-full mb-3 px-3 py-2 border rounded-lg"
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        description: e.target.value,
                      })
                    }
                  />

                  <button
                    onClick={() => handleUpdate(p._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg mr-2"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1.5 rounded-lg"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {p.name}
                    </h4>

                    <p className="font-bold mt-1">₹{p.price}</p>

                    <div className="mt-2">
                      {p.isApproved ? (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          Approved
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;