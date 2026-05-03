import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://https://cartify-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registered Successfully ✅");
        navigate("/login");
      } else {
        alert(data.message || "Error ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-gray-100 to-gray-200 px-4">

      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white/80 backdrop-blur-md 
        border border-gray-200 rounded-2xl p-8 
        shadow-xl transition-all"
      >
        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
          Create Account 🚀
        </h2>

        {/* NAME */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 
            focus:outline-none focus:ring-2 focus:ring-gray-400 
            transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 
            focus:outline-none focus:ring-2 focus:ring-gray-400 
            transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-5">
          <label className="text-sm text-gray-600 mb-1 block">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 
            focus:outline-none focus:ring-2 focus:ring-gray-400 
            transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <button
          className="w-full py-2.5 rounded-lg 
          bg-black text-white font-medium tracking-wide
          hover:bg-gray-900 hover:shadow-lg hover:scale-[1.02]
          active:scale-95 transition-all duration-200"
        >
          Register
        </button>

        {/* LOGIN LINK */}
        <p className="text-sm text-gray-500 text-center mt-5">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-black font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;