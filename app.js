require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("./utils/logger");
const morgan = require("morgan");
const app = express();
const rateLimit = require("express-rate-limit");

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const server = http.createServer(app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});

app.use(limiter);

const allowedOrigins = [
  "http://localhost:5173",
  "https://systemm-git-main-ahiseheks-projects.vercel.app",
  "https://systemm-five.vercel.app",
];

// ✅ ADD CORS MIDDLEWARE BEFORE ANY ROUTES
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.options("/*", cors());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(helmet());

// Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    credentials: true,
  },
});

// Routes
const authRoutes = require("./routes/auth");
const bankRoutes = require("./routes/bank");
const siteRoutes = require("./routes/site");
const unitRoutes = require("./routes/unit");
const gstRoutes = require("./routes/gst");
const fleetRoutes = require("./routes/fleet");

const igroupRoutes = require("./routes/igroup");

// ✅ Inject io into itemRoutes
const itemRoutes = require("./routes/item")(io);
const venderRoutes = require("./routes/vender")(io);
const vehicleRoutes = require("./routes/vehicle")(io);
const ticketRoutes = require("./routes/ticket")(io);

// Use routes
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

// Serve uploads
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Client connected", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    server.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });
