async function loadQuests() {
    const questList = document.getElementById("questList");
    const message = document.getElementById("message");

    try {
        const response = await fetch(API_BASE_URL, {
            credentials: "include"
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("You are not authenticated. Please log in.");
            }

            throw new Error(`HTTP error: ${response.status}`);
        }

        const quests = await response.json();

        questList.innerHTML = "";

        if (quests.length === 0) {
            questList.innerHTML = "<p>No quests found.</p>";
            message.textContent = "";
            return;
        }

        quests.forEach(quest => {
            const card = document.createElement("div");

            card.innerHTML = `
                <h3>${quest.title}</h3>
                <p><strong>Description:</strong> ${quest.description}</p>
                <p><strong>Difficulty:</strong> ${quest.difficulty}</p>
                <p><strong>XP:</strong> ${quest.xp}</p>
                <p><strong>Status:</strong> ${quest.status}</p>
                <p><strong>Deadline:</strong> ${quest.deadline}</p>

                <button onclick="viewQuest(${quest.id})">
                    View Details
                </button>

                <button onclick="editQuest(${quest.id})">
                    Edit
                </button>

                <hr>
            `;

            questList.appendChild(card);
        });

        message.textContent = `Loaded ${quests.length} quest(s).`;

    } catch (error) {
        console.error("Error loading quests:", error);
        message.textContent = error.message;
    }
}



async function viewQuest(id) {
    const message = document.getElementById("message");

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            credentials: "include"
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("You are not authenticated. Please log in.");
            }

            if (response.status === 404) {
                throw new Error("Quest not found.");
            }

            throw new Error(`HTTP error: ${response.status}`);
        }

        const quest = await response.json();

        message.textContent =
            `Quest #${quest.id}: ${quest.title} | ` +
            `${quest.difficulty} | ${quest.xp} XP | ${quest.status}`;

    } catch (error) {
        console.error("Error getting quest:", error);
        message.textContent = error.message;
    }
}



async function createQuest(event) {
    event.preventDefault();

    const quest = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        difficulty: document.getElementById("difficulty").value,
        xp: Number(document.getElementById("xp").value),
        status: document.getElementById("status").value,
        deadline: document.getElementById("deadline").value
    };

    const message = document.getElementById("message");

    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(quest)
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("You are not authenticated. Please log in.");
            }

            throw new Error(`HTTP error: ${response.status}`);
        }

        const createdQuest = await response.json();

        message.textContent =
            `Created quest "${createdQuest.title}" successfully!`;

        document.getElementById("questForm").reset();

        loadQuests();

    } catch (error) {
        console.error("Error creating quest:", error);
        message.textContent = error.message;
    }
}



async function editQuest(id) {
    try {
        
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            credentials: "include"
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("You are not authenticated. Please log in.");
            }

            if (response.status === 404) {
                throw new Error("Quest not found.");
            }

            throw new Error(`HTTP error: ${response.status}`);
        }

        const quest = await response.json();

        
        document.getElementById("title").value = quest.title;
        document.getElementById("description").value = quest.description;
        document.getElementById("difficulty").value = quest.difficulty;
        document.getElementById("xp").value = quest.xp;
        document.getElementById("status").value = quest.status;
        document.getElementById("deadline").value = quest.deadline;

        
        const form = document.getElementById("questForm");
        form.dataset.editingId = id;

        
        const submitButton = form.querySelector("button[type='submit']");
        submitButton.textContent = "Update Quest";

        document.getElementById("message").textContent =
            `Editing quest #${id}. Change the fields and click Update Quest.`;

    } catch (error) {
        console.error("Error editing quest:", error);
        document.getElementById("message").textContent = error.message;
    }
}



async function submitQuest(event) {
    event.preventDefault();

    const form = document.getElementById("questForm");
    const editingId = form.dataset.editingId;
    const message = document.getElementById("message");

    const quest = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        difficulty: document.getElementById("difficulty").value,
        xp: Number(document.getElementById("xp").value),
        status: document.getElementById("status").value,
        deadline: document.getElementById("deadline").value
    };

    try {
        let response;

        
        if (editingId) {
            response = await fetch(`${API_BASE_URL}/${editingId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(quest)
            });
        }

        
        else {
            response = await fetch(API_BASE_URL, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(quest)
            });
        }

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("You are not authenticated. Please log in.");
            }

            if (response.status === 404) {
                throw new Error("Quest not found.");
            }

            throw new Error(`HTTP error: ${response.status}`);
        }

        const savedQuest = await response.json();

        if (editingId) {
            message.textContent =
                `Updated quest "${savedQuest.title}" successfully!`;
        } else {
            message.textContent =
                `Created quest "${savedQuest.title}" successfully!`;
        }

        
        form.reset();

        
        delete form.dataset.editingId;

        
        form.querySelector("button[type='submit']").textContent =
            "Create Quest";

        
        loadQuests();

    } catch (error) {
        console.error("Error saving quest:", error);
        message.textContent = error.message;
    }
}



document.getElementById("questForm").addEventListener(
    "submit",
    submitQuest
);



loadQuests();

