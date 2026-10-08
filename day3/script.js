let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// 1. Search notes
function searchNotes(word) {
  return notes.filter(note =>
    note.text.toLowerCase().includes(word.toLowerCase())
  );
}

console.log(searchNotes("javascript"));
// Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]

console.log(searchNotes("pizza"));
// Expected: []


// 2. Find the longest note
function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];

  for (let note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }

  return longest;
}

console.log(longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

let originalNotes = notes;
notes = [];

console.log(longestNote());
// Expected: null

notes = originalNotes;


// 3. Count notes by category
function countByCategory() {
  let counts = {};

  for (let note of notes) {
    if (counts[note.category]) {
      counts[note.category]++;
    } else {
      counts[note.category] = 1;
    }
  }

  return counts;
}

console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

notes = [];

console.log(countByCategory());
// Expected: {}

notes = originalNotes;


// 4. Get summary
function getSummary() {
  let counts = countByCategory();
  let word = notes.length === 1 ? "note" : "notes";

  return `${notes.length} ${word}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}

console.log(getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

notes = [];

console.log(getSummary());
// Expected: "0 notes: 0 personal, 0 work, 0 study."

notes = originalNotes;


// 5. Check for duplicates
function isDuplicate(text) {
  return notes.some(note =>
    note.text.trim().toLowerCase() === text.trim().toLowerCase()
  );
}

console.log(isDuplicate("  CALL MUM  "));
// Expected: true

console.log(isDuplicate("Go shopping"));
// Expected: false


// 6. Add a note
function addNote(text, category) {
  if (typeof text !== "string" || text.trim().length < 1 || text.trim().length > 200) {
    console.log("Note not added: text must be 1–200 characters.");
    return false;
  }

  if (isDuplicate(text)) {
    console.log("Note not added: duplicate note.");
    return false;
  }

  if (!["personal", "work", "study"].includes(category)) {
    console.log("Note not added: invalid category.");
    return false;
  }

  let newId = notes.length > 0
    ? Math.max(...notes.map(note => note.id)) + 1
    : 1;

  notes.push({
    id: newId,
    text: text.trim(),
    category: category
  });

  console.log("Note added successfully.");
  return true;
}

console.log(addNote("Prepare for the JavaScript test", "study"));
// Expected: true

console.log(addNote("Call mum", "personal"));
// Expected: false
