const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

// Update character and word counts
function updateCounts() {
  const text = noteText.value;

  // Count characters
  charCount.textContent = `Characters: ${text.length}`;

  // Count words
  const words = text.trim() === "" ? [] : text.trim().split(/\s+/);
  wordCount.textContent = `Words: ${words.length}`;
}

// Update counts whenever the user types
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
});

// Set the initial counts
updateCounts();
