const cors = require("cors");
const express = require("express");
const session = require("express-session");
require("dotenv").config();
const path = require('path');

const app = express();

// Import Routes
const customerRoutes = require("./routes/customerRouter");
const restaurantOwnerRoutes = require("./routes/restaurantOwnerRouter");
const restaurantRoutes = require("./routes/restaurantRouter");
const dishRoutes = require("./routes/dishRouter");
const orderRoutes = require("./routes/orderRouter");
const favoriteRoutes = require("./routes/favouriteRouter");
const uploadRoutes = require("./routes/uploadRouter");

app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Enable CORS with credentials support
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend requests from here
    credentials: true, // Allows session cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma']
  })
);

// Enable JSON body parsing
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true, // Changed to true to ensure session is saved on each request
    saveUninitialized: true, // Changed to true to create session for all requests
    cookie: {
      secure: false, // Must be false for non-HTTPS local development
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day session expiry
      sameSite: "none", // Change to "none" to allow cross-site cookies
      path: '/' // Ensure cookie is available for all paths
    },
  })
);

// Add session debugging middleware
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session:', req.session);
  next();
});

// Register Routes with API Namespace
app.use("/api/customers", customerRoutes);
app.use("/api/restaurantOwners", restaurantOwnerRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/upload", uploadRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Listening on port ${PORT}`);
});
