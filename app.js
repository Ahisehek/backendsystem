require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();
const server = http.createServer(app);

// ================= LOGGER =================
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ================= RATE LIMIT =================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use(limiter);

// ================= CORS (FIXED) =================
const allowedOrigins = [
  "http://localhost:5173",
  "https://systemm-five.vercel.app",
  "https://systemm-git-main-ahiseheks-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// ================= MIDDLEWARE =================
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

// ================= ROUTES =================
const authRoutes = require("./routes/auth");
const bankRoutes = require("./routes/bank");
const siteRoutes = require("./routes/site");
const unitRoutes = require("./routes/unit");
const gstRoutes = require("./routes/gst");
const fleetRoutes = require("./routes/fleet");

const igroupRoutes = require("./routes/igroup");
const itemRoutes = require("./routes/item")(io);
const venderRoutes = require("./routes/vender")(io);
const vehicleRoutes = require("./routes/vehicle")(io);
const ticketRoutes = require("./routes/ticket")(io);

// API Routes
app.use("/api", authRoutes);
app.use("/api", bankRoutes);

app.use("/site", siteRoutes);
app.use("/unit", unitRoutes);
app.use("/gst", gstRoutes);
app.use("/fleet", fleetRoutes);
app.use("/item", itemRoutes);
app.use("/vender", venderRoutes);
app.use("/vehicle", vehicleRoutes);
app.use("/ticket", ticketRoutes);
app.use("/igroup", igroupRoutes);

// ================= STATIC FILES =================
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));
// ================= SOCKET CONNECTION =================
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ================= DB CONNECTION =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });
