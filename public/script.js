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
            // ... (previous code where label.innerHTML is set)

            const checkbox = label.querySelector("input");

            // --- ADD THIS NEW BLOCK FOR CLIPBOARD COPYING ---
            label.addEventListener("click", (e) => {
                // Ignore clicks directly on the checkbox so it doesn't copy when just checking it off
                if (e.target.tagName.toLowerCase() === 'input') return;
                const preTextPrompt = `
                You are an expert software engineer, technical mentor, and interview coach.

                    I am a Full Stack Developer with 4 years of professional experience preparing for software engineering interviews. I will provide one topic at a time.

                    Based on the type of topic, respond in the following format.

                    ## If the topic is a DSA problem

                    1. Problem Statement
                    - Present the complete interview question.
                    - Mention input/output and constraints if applicable.

                    2. Clarifying Questions
                    - Mention any assumptions or questions an interviewer might expect me to ask.

                    3. Brute Force Approach
                    - Explain the intuition.
                    - Time Complexity
                    - Space Complexity

                    4. Optimized Approach
                    - Explain the intuition.
                    - Why it is optimal.
                    - Time Complexity
                    - Space Complexity

                    5. Pseudocode

                    6. Python Solution
                    - Clean, interview-quality code with comments only where necessary.

                    7. Edge Cases

                    8. Common Mistakes

                    9. Follow-up Interview Questions
                    - Mention possible follow-up questions an interviewer may ask.

                    10. Similar Problems
                        - List related LeetCode problems and the patterns they belong to.

                    ---

                    ## If the topic is any technical concept (System Design, Backend, Frontend, Databases, Cloud, DevOps, Networking, Operating Systems, Architecture, etc.)

                    1. High-Level Overview
                    - Explain the concept in simple terms.

                    2. Deep Dive
                    - Explain how it works internally.
                    - Cover important components and workflow.

                    3. Why It Exists
                    - What problem does it solve?
                    - What are its advantages and disadvantages?

                    4. Real-World Example
                    - Explain using practical software engineering examples.

                    5. Things Every 4-Year Experienced Developer Should Know
                    - Important concepts
                    - Best practices
                    - Common pitfalls
                    - Performance considerations
                    - Security considerations (if applicable)

                    6. Related Concepts
                    - Explain how this topic connects with other technologies.

                    7. Interview Questions
                    - Beginner
                    - Intermediate
                    - Senior (4+ years level)

                    8. Practical Scenarios
                    - Explain how this topic is used in production systems.

                    9. Cheat Sheet
                    - Summarize the most important points in bullet form.

                    10. Common Interview Mistakes
                        - Mention misconceptions and incorrect answers candidates often give.

                    ---

                    Keep explanations concise but complete.
                    Prefer diagrams using ASCII whenever they improve understanding.
                    Focus on interview preparation and real-world engineering rather than academic definitions.
                    Whenever relevant, compare similar concepts in a table.
                    Mention time complexity, space complexity, scalability, and trade-offs wherever applicable.
                    Topic is this : 
                `
                // Copy the specific task content to the clipboard
                navigator.clipboard.writeText( preTextPrompt + task.content).then(() => {
                    const textDiv = label.querySelector(".todo-text");
                    const originalHTML = textDiv.innerHTML;
                    
                    // Show a quick visual confirmation
                    textDiv.innerHTML = `<span style="color: var(--accent-green); font-weight: bold;">✓ Copied to clipboard!</span>`;
                    
                    // Revert back to the original text after 800 milliseconds
                    setTimeout(() => {
                        textDiv.innerHTML = originalHTML;
                    }, 800);
                }).catch(err => {
                    console.error("Failed to copy text: ", err);
                });
            });

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