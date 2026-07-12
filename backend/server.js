require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const credentialRoutes = require("./routes/credentials");
app.use("/credentials", credentialRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Export the app for Vercel
module.exports = app;

// Run locally only
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}