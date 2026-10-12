
const loadButton = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const statusMessage = document.getElementById("status");
const usersList = document.getElementById("users-list");

let users = [];

async function loadUsers() {
  loadButton.disabled = true;
  statusMessage.textContent = "Loading users...";
  usersList.replaceChildren();

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users"
    );

    if (!response.ok) {
      throw new Error("Failed to load users.");
    }

    users = await response.json();

    renderUsers(users);
    statusMessage.textContent = `Successfully loaded ${users.length} users.`;
  } catch (error) {
    users = [];
    usersList.replaceChildren();
    statusMessage.textContent =
      "Error loading users. Please try again.";
    console.error("Error loading users:", error);
  } finally {
    loadButton.disabled = false;
  }
}

function renderUsers(list) {
  usersList.replaceChildren();

  if (list.length === 0) {
    statusMessage.textContent = "No users match your filter.";
    return;
  }

  list.forEach((user) => {
    const listItem = document.createElement("li");

    const name = document.createElement("h3");
    name.textContent = user.name;

    const email = document.createElement("p");
    email.textContent = `Email: ${user.email}`;

    const city = document.createElement("p");
    city.textContent = `City: ${user.address.city}`;

    const company = document.createElement("p");
    company.textContent = `Company: ${user.company.name}`;

    listItem.append(name, email, city, company);
    usersList.appendChild(listItem);
  });
}

loadButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
  const searchText = filterInput.value.toLowerCase().trim();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText)
  );

  renderUsers(filteredUsers);

  if (filteredUsers.length > 0) {
    statusMessage.textContent =
      `Showing ${filteredUsers.length} matching user(s).`;
  }
});
