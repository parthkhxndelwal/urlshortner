const express = require("express");
const path = require("path");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const app = express();
const PORT = process.env.PORT || 8001;  // Vercel provides the port in the environment variables

// Connect to MongoDB (make sure the connection string comes from environment variables for production)
const mongoDBURI = process.env.MONGODB_URI || "mongodb://localhost:27017/urlShortner";
connectToMongoDB(mongoDBURI).then(() => {
  console.log("Connected to MongoDB");
});

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define Routes
app.use("/url", urlRoute);
app.use("/", staticRoute);

// Handle redirects for short URLs
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  
  if (entry) {
    return res.redirect(entry.redirectURL);
  }
  res.status(404).send('URL not found');
});

// Start the server (Vercel handles the server process automatically)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;  // Export the app for Vercel
