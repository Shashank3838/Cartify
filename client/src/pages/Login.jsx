import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://https://cartify-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("storage"));
        alert("Login Successful ✅");
        navigate("/");
      } else {
        alert(data.message || "Login Failed ❌");
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
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white/80 backdrop-blur-md 
        border border-gray-200 rounded-2xl p-8 
        shadow-xl transition-all"
      >
        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
          Welcome Back 👋
        </h2>

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
            placeholder="Enter your password"
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
          Login
        </button>

        {/* REGISTER LINK */}
        <p className="text-sm text-gray-500 text-center mt-5">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-black font-medium cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;