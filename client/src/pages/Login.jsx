import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [toast, setToast] =
    useState({
      show: false,
      message: "",
      type: "",
    });

  const navigate = useNavigate();

  const showToast = (
    message,
    type = "success"
  ) => {

    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {

      setToast({
        show: false,
        message: "",
        type: "",
      });

    }, 2500);
  };

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {

        localStorage.setItem(
          "token",
          data.token
        );

        window.dispatchEvent(
          new Event("storage")
        );

        showToast(
          "Login Successful ✨",
          "success"
        );

        setTimeout(() => {
          navigate("/");
        }, 1200);

      } else {

        showToast(
          data.message ||
            "Login Failed ❌",
          "error"
        );
      }

    } catch (err) {

      console.error(err);

      showToast(
        "Server Error ❌",
        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      className="
      relative
      min-h-screen
      overflow-hidden
      flex
      items-center
      justify-center
      bg-[#eef2ff]
      px-4"
    >

      {/* BACKGROUND */}

      <div
        className="
        absolute
        inset-0
        bg-gradient-to-br
        from-[#dbeafe]
        via-[#eef2ff]
        to-[#ecfeff]"
      />

      {/* GLOW EFFECTS */}

      <div
        className="
        absolute
        top-[-140px]
        left-[-120px]
        w-[380px]
        h-[380px]
        rounded-full
        bg-blue-400/30
        blur-[120px]
        animate-pulse"
      />

      <div
        className="
        absolute
        bottom-[-160px]
        right-[-100px]
        w-[380px]
        h-[380px]
        rounded-full
        bg-cyan-300/30
        blur-[120px]
        animate-pulse"
      />

      {/* GRID */}

      <div
        className="
        absolute
        inset-0
        opacity-[0.05]
        bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]
        bg-[size:70px_70px]"
      />

      {/* FLOATING GLASS BALLS */}

      <div
        className="
        absolute
        top-[16%]
        left-[10%]
        w-20 h-20
        rounded-full
        border
        border-white/40
        bg-white/20
        backdrop-blur-2xl
        shadow-2xl
        animate-pulse"
      />

      <div
        className="
        absolute
        bottom-[15%]
        right-[12%]
        w-16 h-16
        rounded-full
        border
        border-white/40
        bg-white/20
        backdrop-blur-2xl
        shadow-2xl
        animate-bounce"
      />

      {/* TOAST */}

      {toast.show && (

        <div
          className={`
          fixed
          top-6
          right-6
          z-50
          px-6 py-4
          rounded-2xl
          text-white
          font-semibold
          shadow-[0_20px_60px_rgba(0,0,0,0.25)]
          backdrop-blur-2xl
          animate-bounce

          ${
            toast.type === "success"
              ? "bg-green-500/90"
              : "bg-red-500/90"
          }
          `}
        >
          {toast.message}
        </div>
      )}

      {/* MAIN CONTAINER */}

      <div
        className="
        relative
        z-10
        w-full
        max-w-4xl
        rounded-[35px]
        overflow-hidden
        border
        border-white/30
        bg-white/20
        backdrop-blur-[28px]
        shadow-[0_25px_70px_rgba(0,0,0,0.12)]
        grid
        lg:grid-cols-2"
      >

        {/* LEFT SECTION */}

        <div
          className="
          hidden
          lg:flex
          flex-col
          justify-center
          relative
          overflow-hidden
          p-12"
        >

          {/* MINI GLASS CARD */}

          <div
            className="
            absolute
            top-8
            left-8
            px-5 py-3
            rounded-2xl
            bg-white/20
            backdrop-blur-xl
            border border-white/30
            shadow-xl
            text-[#0f172a]
            font-semibold"
          >
            Cartify ✨
          </div>

          {/* BIG TITLE */}

          <h1
            className="
            text-6xl
            font-black
            leading-none
            text-[#0f172a]"
          >
            Welcome
          </h1>

          <h2
            className="
            text-5xl
            font-black
            mt-4
            leading-tight
            text-[#2563eb]"
          >
            Back.
          </h2>

          <p
            className="
            mt-7
            text-base
            leading-relaxed
            text-gray-600
            max-w-sm"
          >
            Login to continue your
            premium shopping journey
            with Cartify.
          </p>

          {/* GLASS INFO BOXES */}

          <div
            className="
            mt-12
            flex
            gap-4"
          >

            <div
              className="
              flex-1
              p-5
              rounded-3xl
              bg-white/20
              border border-white/30
              backdrop-blur-xl
              shadow-xl
              hover:scale-105
              hover:-translate-y-2
              transition-all
              duration-300"
            >
              <p
                className="
                text-3xl
                font-black
                text-[#0f172a]"
              >
                Fast
              </p>

              <p
                className="
                text-gray-600
                mt-2
                text-sm"
              >
                Smooth & secure login
              </p>
            </div>

            <div
              className="
              flex-1
              p-5
              rounded-3xl
              bg-white/20
              border border-white/30
              backdrop-blur-xl
              shadow-xl
              hover:scale-105
              hover:-translate-y-2
              transition-all
              duration-300"
            >
              <p
                className="
                text-3xl
                font-black
                text-[#2563eb]"
              >
                Safe
              </p>

              <p
                className="
                text-gray-600
                mt-2
                text-sm"
              >
                Protected shopping
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}

        <div
          className="
          flex
          items-center
          justify-center
          p-8 lg:p-12"
        >

          <form
            onSubmit={handleLogin}
            className="
            w-full
            max-w-md"
          >

            {/* ICON */}

            <div
              className="
              w-20 h-20
              mx-auto
              mb-7
              rounded-[24px]
              bg-white/20
              backdrop-blur-xl
              border border-white/30
              shadow-[0_15px_40px_rgba(37,99,235,0.20)]
              flex
              items-center
              justify-center
              text-4xl
              hover:rotate-6
              hover:scale-110
              transition-all
              duration-300"
            >
              🛒
            </div>

            {/* TITLE */}

            <h2
              className="
              text-5xl
              font-black
              text-center
              text-[#0f172a]
              mb-2"
            >
              Login
            </h2>

            <p
              className="
              text-center
              text-gray-500
              mb-8"
            >
              Access your account
            </p>

            {/* EMAIL */}

            <div className="mb-5">

              <label
                className="
                text-sm
                font-semibold
                text-gray-700
                mb-2 block"
              >
                Email
              </label>

              <input
                type="email"

                placeholder="Enter your email"

                value={email}

                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }

                className="
                w-full
                px-5 py-4
                rounded-2xl
                bg-white/30
                backdrop-blur-xl
                border border-white/30
                text-[#0f172a]
                placeholder:text-gray-500
                shadow-lg
                focus:outline-none
                focus:ring-2
                focus:ring-blue-400
                hover:scale-[1.02]
                hover:shadow-[0_10px_35px_rgba(37,99,235,0.18)]
                transition-all
                duration-300"
              />
            </div>

            {/* PASSWORD */}

            <div className="mb-8">

              <label
                className="
                text-sm
                font-semibold
                text-gray-700
                mb-2 block"
              >
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  placeholder="Enter password"

                  value={password}

                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }

                  className="
                  w-full
                  px-5 py-4
                  pr-14
                  rounded-2xl
                  bg-white/30
                  backdrop-blur-xl
                  border border-white/30
                  text-[#0f172a]
                  placeholder:text-gray-500
                  shadow-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-400
                  hover:scale-[1.02]
                  hover:shadow-[0_10px_35px_rgba(37,99,235,0.18)]
                  transition-all
                  duration-300"
                />

                <button
                  type="button"

                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }

                  className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-xl
                  hover:scale-125
                  transition-all"
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}

            <button
              disabled={loading}

              className="
              relative
              w-full
              py-4
              rounded-2xl
              overflow-hidden
              bg-gradient-to-r
              from-[#0f172a]
              via-[#1e40af]
              to-[#2563eb]
              text-white
              font-bold
              text-lg
              shadow-[0_15px_45px_rgba(37,99,235,0.30)]
              hover:scale-[1.03]
              hover:-translate-y-1
              active:scale-95
              transition-all
              duration-300"
            >

              <span
                className="
                absolute
                inset-0
                bg-white/10
                opacity-0
                hover:opacity-100
                transition"
              />

              {loading
                ? "Logging in..."
                : "Login →"}
            </button>

            {/* REGISTER */}

            <p
              className="
              text-center
              text-gray-600
              mt-7"
            >
              Don’t have an account?{" "}

              <span
                onClick={() =>
                  navigate("/register")
                }

                className="
                text-[#2563eb]
                font-bold
                cursor-pointer
                hover:underline"
              >
                Register
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;