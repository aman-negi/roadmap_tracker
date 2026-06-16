let progressDatabase = {};
let parsedRoadmap = [];

/*
=========================================
LOAD APPLICATION
=========================================
*/

window.addEventListener("DOMContentLoaded", async () => {
    try {

        const progressResponse =
            await fetch("/api/progress");

        progressDatabase =
            await progressResponse.json();

        const roadmapResponse =
            await fetch("/api/roadmap");

        parsedRoadmap =
            await roadmapResponse.json();

        renderDayWiseDashboard();

    } catch (err) {

        console.error(err);

        document.getElementById(
            "days-container"
        ).innerHTML = `
            <div class="prompt-state">
                Failed to load roadmap or progress data.
            </div>
        `;
    }
});

/*
=========================================
SAVE JSON
=========================================
*/

async function saveProgress() {

    try {

        await fetch("/api/progress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(progressDatabase)
        });

    } catch (err) {
        console.error(
            "Failed to save progress",
            err
        );
    }
}

/*
=========================================
RENDER DASHBOARD
=========================================
*/

function renderDayWiseDashboard() {

    const container =
        document.getElementById(
            "days-container"
        );

    container.innerHTML = "";

    parsedRoadmap.forEach(row => {

        if (!row.Day) return;

        const dayKey = `Day ${row.Day}`;

        if (!progressDatabase[dayKey]) {

            progressDatabase[dayKey] = {
                completed: false,
                tasks: {}
            };
        }

        let dsaComb =
            row.DSA_Topic || "";

        if (
            row.DSA_Problems_LeetCode &&
            row.DSA_Problems_LeetCode !== "-"
        ) {
            dsaComb +=
                ` → [ ${row.DSA_Problems_LeetCode} ]`;
        }

        const taskDefinitions = [

            {
                id: "dsa",
                category: "DSA Practice",
                content: dsaComb
            },

            {
                id: "system_design",
                category: "System Design",
                content:
                    row.System_Design_Topic
            },

            {
                id: "tech_stack",
                category:
                    "Tech Stack Deep Dive",
                content:
                    row.Tech_Stack_Deep_Dive
            },

            {
                id: "gen_ai",
                category: "GenAI Focus",
                content:
                    row.AI_GenAI_Focus
            },

            {
                id: "behavioral",
                category:
                    "Behavioral STAR",
                content:
                    row.Behavioral_STAR
            },

            {
                id: "deliverable",
                category:
                    "Daily Deliverable",
                content:
                    row.Daily_Deliverable
            }
        ];

        const activeTasks =
            taskDefinitions.filter(
                task =>
                    task.content &&
                    task.content.trim() !== "-"
            );

        const dayCard =
            document.createElement("div");

        dayCard.className = "day-card";

        dayCard.id =
            `card-dir-${row.Day}`;

        dayCard.innerHTML = `
            <div class="day-card-header">
                <h2>
                    Day ${row.Day}
                    : ${row.Phase || ""}
                    <span
                        style="
                            font-size:0.85rem;
                            color:#64748b;
                            font-weight:normal;
                        "
                    >
                        (${row.Week || ""})
                    </span>
                </h2>

                <span
                    class="day-status-label"
                    id="status-badge-${row.Day}"
                >
                    In Progress
                </span>
            </div>
        `;

        activeTasks.forEach(task => {

            if (
                progressDatabase[dayKey]
                    .tasks[task.id] ===
                undefined
            ) {
                progressDatabase[dayKey]
                    .tasks[task.id] = false;
            }

            const checked =
                progressDatabase[dayKey]
                    .tasks[task.id];

            const label =
                document.createElement(
                    "label"
                );

            label.className =
                `todo-row ${
                    checked
                        ? "checked"
                        : ""
                }`;

            label.innerHTML = `
                <input
                    type="checkbox"
                    ${
                        checked
                            ? "checked"
                            : ""
                    }
                >

                <div class="todo-details">

                    <div class="todo-category">
                        ${task.category}
                    </div>

                    <div class="todo-text">
                        ${task.content}
                    </div>

                </div>
            `;

            const checkbox =
                label.querySelector(
                    "input"
                );

            checkbox.addEventListener(
                "change",
                async e => {

                    const checked =
                        e.target.checked;

                    progressDatabase[
                        dayKey
                    ].tasks[
                        task.id
                    ] = checked;

                    if (checked) {
                        label.classList.add(
                            "checked"
                        );
                    } else {
                        label.classList.remove(
                            "checked"
                        );
                    }

                    evaluateDayCompletionState(
                        dayKey,
                        row.Day,
                        activeTasks.map(
                            t => t.id
                        )
                    );

                    await saveProgress();
                }
            );

            dayCard.appendChild(label);
        });

        container.appendChild(dayCard);

        evaluateDayCompletionState(
            dayKey,
            row.Day,
            activeTasks.map(
                t => t.id
            ),
            true
        );
    });

    calculateGlobalMetrics();
}

/*
=========================================
DAY COMPLETION
=========================================
*/

function evaluateDayCompletionState(
    dayKey,
    dayNum,
    taskIds,
    initialLoad = false
) {

    const totalTasks =
        taskIds.length;

    const completedTasks =
        taskIds.filter(
            id =>
                progressDatabase[
                    dayKey
                ].tasks[id]
        ).length;

    const completed =
        totalTasks > 0 &&
        completedTasks ===
        totalTasks;

    progressDatabase[
        dayKey
    ].completed = completed;

    const card =
        document.getElementById(
            `card-dir-${dayNum}`
        );

    const badge =
        document.getElementById(
            `status-badge-${dayNum}`
        );

    if (card && badge) {

        if (completed) {

            card.classList.add(
                "day-complete"
            );

            badge.innerText =
                "Completed";

        } else {

            card.classList.remove(
                "day-complete"
            );

            badge.innerText =
                "In Progress";
        }
    }

    if (!initialLoad) {
        calculateGlobalMetrics();
    }
}

/*
=========================================
METRICS
=========================================
*/

function calculateGlobalMetrics() {

    let completedDays = 0;

    for (
        let i = 1;
        i <= 50;
        i++
    ) {

        const day =
            progressDatabase[
                `Day ${i}`
            ];

        if (
            day &&
            day.completed
        ) {
            completedDays++;
        }
    }

    document.getElementById(
        "days-completed-count"
    ).innerText =
        `${completedDays} / 50 Days`;

    const percentage =
        Math.round(
            (completedDays / 50) * 100
        );

    document.getElementById(
        "progress-bar-fill"
    ).style.width =
        `${percentage}%`;
}