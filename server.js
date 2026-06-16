const express = require("express");
const fs = require("fs-extra");
const csv = require("csv-parser");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const PROGRESS_FILE = "./data/progress.json";
const ROADMAP_FILE = "./data/roadmap.csv";

app.get("/api/progress", async (req, res) => {
    const data = await fs.readJson(PROGRESS_FILE);
    res.json(data);
});

app.post("/api/progress", async (req, res) => {
    await fs.writeJson(
        PROGRESS_FILE,
        req.body,
        { spaces: 4 }
    );

    res.json({
        success: true
    });
});

app.get("/api/roadmap", async (req, res) => {

    const rows = [];

    fs.createReadStream(ROADMAP_FILE)
        .pipe(csv())
        .on("data", row => rows.push(row))
        .on("end", () => {
            res.json(rows);
        });
});

app.listen(3000, () => {
    console.log(
        "Server running at http://localhost:3000"
    );
});