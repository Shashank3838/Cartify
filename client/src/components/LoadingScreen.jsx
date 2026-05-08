import { motion } from "framer-motion";

function LoadingScreen() {

  return (

    <motion.div

      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}

      className="
      fixed inset-0 z-[9999]

      bg-black

      flex flex-col
      items-center
      justify-center

      overflow-hidden
    "
    >

      {/* BACKGROUND GLOW */}
      <div
        className="
        absolute w-[750px] h-[750px]

        bg-blue-500/20

        blur-[180px]

        rounded-full
      "
      />

      {/* EXTRA GLOW */}
      <div
        className="
        absolute bottom-[-120px]

        w-[500px] h-[500px]

        bg-orange-500/10

        blur-[150px]

        rounded-full
      "
      />

      {/* FLOATING PARTICLES */}
      <motion.div

        animate={{
          y: [0, -25, 0],
          opacity: [0.2, 0.5, 0.2],
        }}

        transition={{
          repeat: Infinity,
          duration: 4,
        }}

        className="
        absolute top-20 left-24

        text-5xl
      "
      >
        ✨
      </motion.div>

      <motion.div

        animate={{
          y: [0, 20, 0],
          opacity: [0.1, 0.4, 0.1],
        }}

        transition={{
          repeat: Infinity,
          duration: 5,
        }}

        className="
        absolute bottom-24 right-24

        text-6xl
      "
      >
        ⚡
      </motion.div>

      {/* MAIN DROP */}
      <motion.div

        initial={{
          y: -500,
          scale: 0.7,
          rotate: -12,
        }}

        animate={{
          y: 0,
          scale: 1,
          rotate: 0,
        }}

        transition={{
          duration: 1.5,
          type: "spring",
          stiffness: 90,
        }}

        className="
        relative z-10

        flex flex-col
        items-center
      "
      >

        {/* PARACHUTE */}
        <motion.div

          animate={{
            y: [0, -8, 0],
          }}

          transition={{
            repeat: Infinity,
            duration: 2.5,
          }}

          className="
          relative flex flex-col items-center
        "
        >

          {/* PARACHUTE TOP */}
          <div
            className="
            relative

            w-56 h-28

            rounded-t-full

            bg-gradient-to-b
            from-white
            to-gray-200

            border-b-[6px]
            border-gray-300

            shadow-[0_20px_60px_rgba(255,255,255,0.15)]
          "
          >

            {/* CURVE LINES */}
            <div
              className="
              absolute left-1/2 top-0

              -translate-x-1/2

              w-[3px] h-full

              bg-gray-300
            "
            />

            <div
              className="
              absolute left-[30%] top-0

              w-[2px] h-full

              bg-gray-300
            "
            />

            <div
              className="
              absolute right-[30%] top-0

              w-[2px] h-full

              bg-gray-300
            "
            />
          </div>

          {/* STRINGS */}
          <div className="flex gap-24">

            <div className="w-[2px] h-28 bg-white/90" />
            <div className="w-[2px] h-28 bg-white/90" />

          </div>

          {/* PACKAGE */}
          <motion.div

            animate={{
              y: [0, -12, 0],
              rotate: [0, 2, -2, 0],
            }}

            transition={{
              repeat: Infinity,
              duration: 3,
            }}

            className="
            relative

            w-40 h-40

            rounded-[38px]

            bg-gradient-to-br
            from-orange-300
            via-orange-500
            to-orange-700

            shadow-[0_25px_90px_rgba(249,115,22,0.65)]

            border border-orange-200/30

            flex items-center
            justify-center

            overflow-hidden
          "
          >

            {/* SHINE */}
            <div
              className="
              absolute top-3 left-3

              w-20 h-20

              rounded-full

              bg-white/20

              blur-xl
            "
            />

            {/* TAPE VERTICAL */}
            <div
              className="
              absolute top-0 left-1/2

              -translate-x-1/2

              w-10 h-full

              bg-orange-200/40
            "
            />

            {/* TAPE HORIZONTAL */}
            <div
              className="
              absolute left-0 top-1/2

              -translate-y-1/2

              w-full h-10

              bg-orange-200/30
            "
            />

            {/* ICON */}
            <motion.div

              animate={{
                scale: [1, 1.08, 1],
              }}

              transition={{
                repeat: Infinity,
                duration: 2,
              }}

              className="
              text-7xl drop-shadow-2xl
            "
            >
              📦
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* TEXT */}
      <motion.div

        initial={{
          opacity: 0,
          y: 30,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          delay: 0.4,
        }}

        className="
        relative z-10
        text-center mt-16
      "
      >

        <h1
          className="
          text-white

          text-5xl md:text-7xl

          font-black

          tracking-tight
        "
        >
          Delivering Your Experience ✨
        </h1>

        <p
          className="
          text-gray-400

          mt-6 text-xl
        "
        >
          Cartify is preparing your premium journey...
        </p>

        {/* LOADING DOTS */}
        <div
          className="
          flex items-center justify-center
          gap-3 mt-8
        "
        >

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
            }}

            className="
            w-3 h-3 rounded-full
            bg-orange-400
          "
          />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              delay: 0.15,
            }}

            className="
            w-3 h-3 rounded-full
            bg-orange-400
          "
          />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              delay: 0.3,
            }}

            className="
            w-3 h-3 rounded-full
            bg-orange-400
          "
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default LoadingScreen;