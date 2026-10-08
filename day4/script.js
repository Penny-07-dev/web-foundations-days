const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

const MAX_CHARS = 200;

// Update character and word counts
function updateCounts() {
    const text = noteText.value;
    const characters = text.length;

    // Count words
    const words = text.trim() === "" ? [] : text.trim().split(/\s+/);

    charCount.textContent = `${characters} / ${MAX_CHARS} characters`;
    wordCount.textContent = `${words.length} words`;

    // Character warning
    charCount.classList.remove("warning", "over");

    if (characters > MAX_CHARS) {
        charCount.classList.add("over");
    } else if (characters >= 180) {
        charCount.classList.add("warning");
    }
}

// Update counts while typing
noteText.addEventListener("input", updateCounts);

// Clear the note
clearBtn.addEventListener("click", function () {
    noteText.value = "";
    updateCounts();
    noteText.focus();
});

// Toggle dark theme
themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "Light mode";
    } else {
        themeToggle.textContent = "Dark mode";
    }
});

// Set initial counts
updateCounts();
