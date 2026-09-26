const chatBox = document.getElementById("chat-box");
const emptyState = document.getElementById("emptyState");
const emptyStateText = document.getElementById("emptyStateText");
const input = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const typing = document.getElementById("typing");
const typingText = document.getElementById("typingText");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");

const modeToggle = document.getElementById("modeToggle");
const modeChatBtn = document.getElementById("modeChat");
const modeTutorBtn = document.getElementById("modeTutor");
const modeSubtitle = document.getElementById("modeSubtitle");

const MODE_COPY = {
    chat: {
        subtitle: "Your AI assistant",
        placeholder: "Message JudeBot...",
        empty: "Ask a question, share a document, or just say hello.",
        thinking: "JudeBot is thinking"
    },
    tutor: {
        subtitle: "Assistant de français",
        placeholder: "Écrivez en français, ou en anglais...",
        empty: "Practice in French, or ask about grammar and vocabulary.",
        thinking: "JudeBot réfléchit"
    }
};

let currentMode = "chat";

// Auto resize text area
input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
});

// Enter = Send
// Shift+Enter = New line
input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Send button
sendBtn.addEventListener("click", sendMessage);

function addMessage(text, type) {
    if (!emptyState.classList.contains("hidden")) {
        emptyState.classList.add("hidden");
    }

    let div = document.createElement("div");
    div.className = `message ${type}`;

    if (type === "bot") {
        div.innerHTML = marked.parse(text);

        div.querySelectorAll("pre code").forEach((block) => {
            hljs.highlightElement(block);
        });
    } else {
        div.textContent = text;
    }

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    let message = input.value.trim();
    if (message === "") return;

    addMessage(message, "user");
    input.value = "";
    input.style.height = "54px";
    typing.classList.remove("hidden");
    sendBtn.disabled = true;

    try {
        let response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        let data = await response.json();
        typing.classList.add("hidden");
        addMessage(data.reply, "bot");
    } catch {
        typing.classList.add("hidden");
        addMessage("Something went wrong.", "bot");
    }

    sendBtn.disabled = false;
}

clearBtn.addEventListener("click", async () => {
    await fetch("/clear", {
        method: "POST"
    });

    chatBox.innerHTML = "";
    chatBox.appendChild(emptyState);
    emptyState.classList.remove("hidden");
});

uploadBtn.onclick = () => {
    fileInput.click();
};

fileInput.onchange = async () => {
    const file = fileInput.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    typing.classList.remove("hidden");
    typingText.textContent = "Processing document...";

    try {
        await fetch("/upload", {
            method: "POST",
            body: formData
        });

        addMessage(
            `📄 Document uploaded successfully: ${file.name}`,
            "bot"
        );
    } catch {
        addMessage(
            "Failed to upload the document.",
            "bot"
        );
    }

    typing.classList.add("hidden");
    typingText.textContent = MODE_COPY[currentMode].thinking;
};

// Mode Toggle
async function setMode(mode) {
    if (mode === currentMode) return;

    const previousMode = currentMode;
    currentMode = mode;
    applyModeUI(mode);

    try {
        const response = await fetch("/mode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ mode })
        });

        if (!response.ok) {
            throw new Error("Mode change rejected");
        }
    } catch {
        // Revert if the server didn't accept the mode switch
        currentMode = previousMode;
        applyModeUI(previousMode);
    }
}

function applyModeUI(mode) {
    document.body.dataset.mode = mode;
    modeToggle.dataset.active = mode;

    modeChatBtn.classList.toggle("active", mode === "chat");
    modeChatBtn.setAttribute("aria-selected", mode === "chat");

    modeTutorBtn.classList.toggle("active", mode === "tutor");
    modeTutorBtn.setAttribute("aria-selected", mode === "tutor");

    const copy = MODE_COPY[mode];
    modeSubtitle.textContent = copy.subtitle;
    input.placeholder = copy.placeholder;
    emptyStateText.textContent = copy.empty;
    typingText.textContent = copy.thinking;
}

modeChatBtn.addEventListener("click", () => setMode("chat"));
modeTutorBtn.addEventListener("click", () => setMode("tutor"));

(async function syncInitialMode() {
    try {
        await fetch("/mode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: currentMode })
        });
    } catch {
      
    }
})();