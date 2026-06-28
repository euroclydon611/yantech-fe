import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8072;

// Serve static files from the "build" directory
app.use(express.static(path.join(__dirname, "../build")));

// Handle all routes and send back the index.html from the "build" directory
// app.get("*", (req, res) => {
// });

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is listening on port ${port}`);
});

//7474 REPEATED IDS


