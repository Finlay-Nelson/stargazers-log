const repositoryList = document.querySelector("#repositories");

function showError(message) {
  const status = document.createElement("li");
  status.className = "status status-error";
  status.textContent = message;
  repositoryList.replaceChildren(status);
}

function isRepositoryEvent(event) {
  return (
    event !== null &&
    typeof event === "object" &&
    typeof event.repository === "string" &&
    typeof event.description === "string" &&
    typeof event.url === "string" &&
    typeof event.starredAt === "string"
  );
}

function renderRepositories(events) {
  if (!Array.isArray(events) || !events.every(isRepositoryEvent)) {
    showError("Repository data is not in the expected format.");
    return;
  }

  if (events.length === 0) {
    const status = document.createElement("li");
    status.className = "status";
    status.textContent = "No starred repositories yet.";
    repositoryList.replaceChildren(status);
    return;
  }

  const items = events.map((event) => {
    const item = document.createElement("li");
    item.className = "repository";

    const link = document.createElement("a");
    link.href = event.url;
    link.textContent = event.repository;

    const description = document.createElement("p");
    description.textContent = event.description;

    const date = document.createElement("time");
    date.dateTime = event.starredAt;
    date.textContent = `Starred ${event.starredAt}`;

    item.append(link, description, date);
    return item;
  });

  repositoryList.replaceChildren(...items);
}

fetch("events.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }
    return response.json();
  })
  .then(renderRepositories)
  .catch((error) => {
    console.error("Unable to load starred repositories:", error);
    showError("Could not load starred repositories. Please try again later.");
  });
