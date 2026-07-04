const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const csv = require("csv-parser");
const fs = require("fs"); // Using Node's built-in fs for the CSV
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const ROADMAP_FILE = "./data/roadmap.csv";


// 1. Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => {
    console.error(err);
    console.error(err.stack);
});

// 2. Define a flexible Schema to hold your JSON progress
const progressSchema = new mongoose.Schema({
    userId: { type: String, default: "aman_admin", unique: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { minimize: false });

const Progress = mongoose.model("Progress", progressSchema);

// 3. GET Route - Read from Database
app.get("/api/progress", async (req, res) => {
    try {
        let userProgress = await Progress.findOne({ userId: "aman_admin" });
        
        // If it's the first time running, send an empty object
        if (!userProgress) {
            return res.json({});
        }
        
        res.json(userProgress.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch progress from DB" });
    }
});

// 4. POST Route - Save to Database
app.post("/api/progress", async (req, res) => {
    try {
        // Upsert creates the document if it doesn't exist, or updates it if it does
        await Progress.findOneAndUpdate(
            { userId: "aman_admin" },
            { data: req.body },
            { upsert: true, returnDocument: "after" } 
        );

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save progress to DB" });
    }
});

// 5. ROADMAP Route - Keep reading the local CSV (Safe for free hosting)
app.get("/api/roadmap", (req, res) => {
    const rows = [];
    fs.createReadStream(ROADMAP_FILE)
        .pipe(csv())
        .on("data", row => rows.push(row))
        .on("end", () => {
            res.json(rows);
        });
});

// Use the PORT environment variable for cloud hosting, fallback to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});