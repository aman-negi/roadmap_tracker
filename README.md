README.md
```

```markdown
# 50 Day Interview Tracker

A web-based application to track progress through a 50-day interview preparation roadmap. This project includes a server and client-side components, and it uses a JSON file to store progress data and a CSV file to define the roadmap.

---

## 📌 Project Overview

This project is a **50 Day Interview Preparation Tracker** that helps users monitor their daily tasks and progress. It includes:

- **Server-side**: Built using [Express.js](https://expressjs.com/) to serve the application and handle data storage.
- **Client-side**: Built with HTML, CSS, and JavaScript to render the user interface and manage interactivity.
- **Data Storage**: Progress is stored in a JSON file (`progress.json`) and the roadmap is defined in a CSV file (`roadmap.csv`).

---

## 📁 Folder Structure

```
50-day-interview-tracker/
│
├── public/                       # Client-side static files
│   ├── index.html                # Main HTML file
│   ├── style.css                 # CSS styling
│   └── script.js                 # JavaScript for interactivity
│
├── data/                         # Data files
│   ├── progress.json             # Stores user progress
│   └── roadmap.csv               # Defines the roadmap structure
│
├── server.js                     # Server-side logic using Express.js
│
├── package.json                  # Node.js dependencies and scripts
└── README.md                     # This file
```

---

## 📦 Dependencies

To run this project, install the following dependencies:

- [Express.js](https://expressjs.com/)
- [fs-extra](https://github.com/jprichardson/fs-extra)
- [csv-parser](https://github.com/mafintosh/csv-parser)
- [PapaParse](https://github.com/mholt/PapaParse) (used in the client-side code)

Install them with:

```bash
npm install express fs-extra csv-parser
```

---

## 🚀 How to Start

1. **Clone the repository**:

```bash
git clone https://github.com/your-username/50-day-interview-tracker.git
cd 50-day-interview-tracker
```

2. **Install dependencies**:

```bash
npm install
```

3. **Run the server**:

```bash
node server.js
```

4. **Open your browser**:

Go to `http://localhost:3000` to view the application.

---

## 📄 Data Flow

### 1. Roadmap Definition (`roadmap.csv`)
- This file defines each day's tasks and topics.
- It is read by the server and sent to the client for rendering.
- Sample CSV format:

```
Day,Phase,Week,DSA_Topic,DSA_Problems_LeetCode,System_Design_Topic,Tech_Stack_Deep_Dive,AI_GenAI_Focus,Behavioral_STAR,Daily_Deliverable
1,Preparation,Week 1,Arrays,101,Introduction to System Design,JavaScript,Introduction to AI,Introduction to Behavioral Questions,Review Interview Concepts
```

### 2. Progress Storage (`progress.json`)
- This file stores the user's progress for each day.
- It is updated dynamically as the user completes tasks.
- Sample JSON format:

```json
{
  "Day 1": {
    "completed": true,
    "tasks": {
      "dsa": true,
      "system_design": true,
      "tech_stack": true,
      "gen_ai": true,
      "behavioral": true,
      "deliverable": true
    }
  }
}
```

### 3. Server (`server.js`)
- Provides endpoints:
  - `/api/progress`: GET to read progress, POST to save progress.
  - `/api/roadmap`: GET to read the roadmap data from the CSV file.
- Uses `fs-extra` and `csv-parser` to read and write data.

### 4. Client (`script.js`, `index.html`)
- Fetches the roadmap and progress data from the server.
- Renders the UI with dynamic cards for each day.
- Allows users to complete tasks and updates the progress in real-time.

---

## ✅ Features

- Real-time progress tracking.
- Task completion status stored in `progress.json`.
- Visual progress bar and metrics.
- Responsive and modern UI.

---

## 🛠️ Customization

- Modify the `roadmap.csv` file to define your own roadmap.
- Customize the `style.css` file to change the appearance.
- Extend the server or client-side logic to support additional features.

---

## 📝 Notes

- Ensure that the `data/` directory exists and contains both `progress.json` and `roadmap.csv`.
- If the `progress.json` file is missing, the application will initialize it with default values.
- The roadmap is loaded on the client side and rendered dynamically based on the CSV file.

---

## 🧑‍💻 Author

- [Your Name](https://github.com/your-username)
- Email: your.email@example.com
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/your-username)

---

## 📝 License

This project is open-source and released under the [MIT License](https://github.com/your-username/50-day-interview-tracker/blob/main/LICENSE).