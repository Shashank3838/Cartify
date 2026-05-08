import { useState, useEffect } from "react";

function SellerDashboard() {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const [products, setProducts] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    revenue: 0,
  });

  // FETCH PRODUCTS
  const fetchMyProducts = async () => {

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/my-products`,
      {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const data = await res.json();

    setProducts(data);

    const approved = data.filter(
      (p) => p.status === "approved"
    ).length;

    const pending = data.filter(
      (p) => p.status !== "approved"
    ).length;

    const revenue = data.reduce(
      (acc, item) =>
        acc + Number(item.price || 0),
      0
    );

    setStats({
      total: data.length,
      approved,
      pending,
      revenue,
    });
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  // AUTO FETCH IMAGE
  const fetchImage = async () => {

    if (!name) {
      alert("Enter product name first");
      return;
    }

    try {

      const res = await fetch(
        `https://api.unsplash.com/search/photos?page=1&query=${name}&client_id=${import.meta.env.VITE_UNSPLASH_KEY}`
      );

      const data = await res.json();

      if (data.results.length > 0) {
        setImage(data.results[0].urls.regular);
      } else {
        alert("No image found");
      }

    } catch (err) {
      console.error(err);
      alert("Image fetch failed");
    }
  };

  // ADD PRODUCT
  const handleAddProduct = async (e) => {

    e.preventDefault();

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " +
            localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name,
          price,
          description,
          image,
          category,
        }),
      }
    );

    setName("");
    setPrice("");
    setDescription("");
    setImage("");
    setCategory("");

    fetchMyProducts();
  };

  // DELETE PRODUCT
  const handleDelete = async (id) => {

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem("token"),
        },
      }
    );

    fetchMyProducts();
  };

  // EDIT CLICK
  const handleEditClick = (product) => {

    setEditingId(product._id);

    setEditData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category || "",
    });
  };

  // UPDATE PRODUCT
  const handleUpdate = async (id) => {

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " +
            localStorage.getItem("token"),
        },
        body: JSON.stringify(editData),
      }
    );

    setEditingId(null);

    fetchMyProducts();
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-6 py-8">

      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div
          className="relative overflow-hidden
          rounded-[40px]
          bg-gradient-to-br
          from-black via-gray-900 to-blue-950
          px-10 py-16 mb-12"
        >

          <div className="relative z-10">

            <p
              className="uppercase tracking-[6px]
              text-sm text-gray-400
              font-semibold mb-5"
            >
              Seller Control Center
            </p>

            <h1
              className="text-5xl md:text-7xl
              font-black text-white"
            >
              Seller Dashboard 👑
            </h1>

            <p
              className="text-gray-300 text-lg
              mt-6 max-w-2xl leading-8"
            >
              Manage products and grow your
              ecommerce business with Cartify.
            </p>
          </div>
        </div>

        {/* ANALYTICS */}
        <div
          className="grid grid-cols-1
          sm:grid-cols-2 lg:grid-cols-4
          gap-6 mb-12"
        >

          {[
            {
              title: "Total Products",
              value: stats.total,
              icon: "📦",
            },
            {
              title: "Approved",
              value: stats.approved,
              icon: "✅",
            },
            {
              title: "Pending",
              value: stats.pending,
              icon: "⏳",
            },
            {
              title: "Revenue",
              value: `₹${stats.revenue}`,
              icon: "💰",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-[30px]
              p-7 shadow-md"
            >

              <div
                className="flex items-center
                justify-between"
              >

                <div>

                  <p className="text-gray-500">
                    {item.title}
                  </p>

                  <h2
                    className="text-4xl font-black
                    mt-3"
                  >
                    {item.value}
                  </h2>
                </div>

                <div
                  className="w-16 h-16 rounded-2xl
                  bg-black text-white
                  flex items-center justify-center
                  text-3xl"
                >
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div
          className="grid grid-cols-1
          lg:grid-cols-3 gap-10 items-start"
        >

          {/* LEFT SIDE */}
          <div className="lg:sticky lg:top-28 self-start">

            <form
              onSubmit={handleAddProduct}

              className="
              bg-white rounded-[35px]
              p-8 shadow-md

              max-h-[85vh]
              overflow-y-auto

              scrollbar-thin
            "
            >

              <h2
                className="text-3xl font-black
                mb-8"
              >
                Add Product ✨
              </h2>

              <div className="space-y-5">

                <input
                  type="text"
                  placeholder="Product Name"
                  className="w-full px-5 py-4
                  rounded-2xl border"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

                <input
                  type="number"
                  placeholder="Price"
                  className="w-full px-5 py-4
                  rounded-2xl border"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                />

                <textarea
                  placeholder="Description"
                  rows={5}
                  className="w-full px-5 py-4
                  rounded-2xl border"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />

                <select
                  className="w-full px-5 py-4
                  rounded-2xl border"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                >
                  <option value="">
                    Select Category
                  </option>

                  <option value="Electronics">
                    Electronics
                  </option>

                  <option value="Fashion">
                    Fashion
                  </option>

                  <option value="Food">
                    Food
                  </option>

                  <option value="Toys">
                    Toys
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

                <button
                  type="button"
                  onClick={fetchImage}
                  className="w-full py-4
                  rounded-2xl
                  bg-blue-600 text-white
                  font-semibold"
                >
                  Auto Fetch Image ✨
                </button>

                {image && (
                  <img
                    src={image}
                    alt="preview"
                    className="w-full h-72
                    object-cover rounded-[25px]"
                  />
                )}

                <button
                  className="w-full py-5
                  rounded-2xl
                  bg-black text-white
                  font-black"
                >
                  Add Product 🚀
                </button>
              </div>
            </form>
          </div>

          {/* PRODUCTS */}
          <div className="lg:col-span-2">

            <div className="space-y-8">

              {products.map((p) => (

                <div
                  key={p._id}
                  className="bg-white rounded-[35px]
                  overflow-hidden shadow-md"
                >

                  {editingId === p._id ? (

                    <div className="p-8 space-y-5">

                      <input
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-5 py-4
                        rounded-2xl border"
                      />

                      <input
                        value={editData.price}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            price: e.target.value,
                          })
                        }
                        className="w-full px-5 py-4
                        rounded-2xl border"
                      />

                      <textarea
                        rows={5}
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description:
                              e.target.value,
                          })
                        }
                        className="w-full px-5 py-4
                        rounded-2xl border"
                      />

                      <div className="flex gap-4">

                        <button
                          onClick={() =>
                            handleUpdate(p._id)
                          }
                          className="flex-1 py-4
                          rounded-2xl
                          bg-green-500
                          text-white font-bold"
                        >
                          Save Changes ✅
                        </button>

                        <button
                          onClick={() =>
                            setEditingId(null)
                          }
                          className="flex-1 py-4
                          rounded-2xl
                          bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                  ) : (

                    <div
                      className="flex flex-col
                      md:flex-row gap-6 p-7"
                    >

                      <div
                        className="w-full md:w-56
                        h-56 rounded-[30px]
                        overflow-hidden"
                      >

                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full
                            object-cover"
                          />
                        )}
                      </div>

                      <div
                        className="flex flex-col
                        flex-grow justify-between"
                      >

                        <div>

                          <div
                            className="flex gap-2
                            mb-4 flex-wrap"
                          >

                            {p.category && (
                              <span
                                className="text-xs
                                px-3 py-1 rounded-full
                                bg-gray-200"
                              >
                                {p.category}
                              </span>
                            )}

                            {p.status ===
                            "approved" ? (
                              <span
                                className="text-xs
                                px-3 py-1 rounded-full
                                bg-green-100
                                text-green-700"
                              >
                                Approved ✅
                              </span>
                            ) : (
                              <span
                                className="text-xs
                                px-3 py-1 rounded-full
                                bg-yellow-100
                                text-yellow-700"
                              >
                                Pending ⏳
                              </span>
                            )}
                          </div>

                          <h3
                            className="text-3xl
                            font-black"
                          >
                            {p.name}
                          </h3>

                          <p
                            className="text-gray-500
                            mt-4 leading-8"
                          >
                            {p.description}
                          </p>

                          <p
                            className="text-4xl
                            font-black mt-6"
                          >
                            ₹{p.price}
                          </p>
                        </div>

                        <div
                          className="flex gap-4
                          mt-8"
                        >

                          <button
                            onClick={() =>
                              handleEditClick(p)
                            }
                            className="px-6 py-3
                            rounded-2xl
                            bg-blue-500 text-white"
                          >
                            Edit ✏️
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(p._id)
                            }
                            className="px-6 py-3
                            rounded-2xl
                            bg-red-500 text-white"
                          >
                            Delete 🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SellerDashboard;