const COHORT = "2412-FTB-MT-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

async function getEvents() {
  try {
    console.log("getEvents() - API_URL = ", API_URL);
    const response = await fetch(API_URL);
    const jsonObj = await response.json();

    state.events = jsonObj.data;
    console.log("getEvents() - state.events = ", state.events);
  } catch (error) {
    console.error(error);
  }
}

function createEventRow(event) {
  // we need to create a new row
  const eventRow = document.createElement("tr");

  // now we need to create the cells for the row
  const nameCell = document.createElement("td");
  nameCell.textContent = event.name;
  eventRow.appendChild(nameCell);

  // create the date and time cell
  const dateTimeCell = document.createElement("td");
  const date = new Date(event.date);
  const dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  dateTimeCell.textContent = `${dateString} ${timeString}`;
  eventRow.appendChild(dateTimeCell);

  // create the location cell
  const locationCell = document.createElement("td");
  locationCell.textContent = event.location;
  eventRow.appendChild(locationCell);

  // create the description cell
  const descriptionCell = document.createElement("td");
  descriptionCell.textContent = event.description;
  eventRow.appendChild(descriptionCell);

  // create the delete button cell
  const deleteCell = document.createElement("td");
  deleteCell.id = "delete-button-cell";
  deleteCell.style.verticalAlign = "middle";
  const deleteButton = document.createElement("button");

  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", async () => {
    try {
      const response = await fetch(`${API_URL}/${event.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        eventRow.remove();
      }
    } catch (error) {
      console.error(error);
    }
  });
  deleteCell.appendChild(deleteButton);
  eventRow.appendChild(deleteCell);
  console.log("eventRow = ", eventRow);

  return eventRow;
}

// we need to removethe existing rows and then re-render the events,
// so we dont get duplicates
function removeChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderEvents() {
  const eventsContainer = document.getElementById("party-table-body");
  console.log("eventsContainer = ", eventsContainer);

  console.log("state.events = ", state.events);

  // remove the existing rows and replace them
  removeChildren(eventsContainer);

  state.events.forEach((event) => {
    console.log("event = ", event);
    const eventRow = createEventRow(event);
    eventsContainer.appendChild(eventRow);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const showFormButton = document.getElementById("show-form-button");
  const toggleForm = document.getElementById("toggle-form");
  const eventForm = document.getElementById("event-form");
  const cancelFormButton = document.getElementById("cancel-form");

  showFormButton.addEventListener("click", () => {
    toggleForm.style.display = "block";
    showFormButton.disabled = true;

    const dateInput = document.getElementById("date");
    const timeInput = document.getElementById("time");

    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().split(" ")[0].slice(0, 5);

    dateInput.value = currentDate;
    timeInput.value = currentTime;
  });

  cancelFormButton.addEventListener("click", () => {
    eventForm.reset(); // Clear the form fields
    toggleForm.style.display = "none"; // Hide the form
    showFormButton.disabled = false;
  });

  eventForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Capture the form data
    const formData = new FormData(eventForm);
    const name = formData.get("name");
    const date = formData.get("date");
    const time = formData.get("time");
    const location = formData.get("location");
    const description = formData.get("description");

    // Combine date and time into a single string
    const dateTimeString = `${date}T${time}`;
    // Create a Date object from the combined string
    const dateTime = new Date(dateTimeString);
    // Convert the Date object to an ISO string
    const dateTimeISO = dateTime.toISOString();

    const eventData = {
      name: name,
      date: dateTimeISO,
      location: location,
      description: description,
    };

    console.log("Form submitted:", eventData);

    // Send the eventData to the server using fetch
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // hide the form after submission
        toggleForm.style.display = "none";
        // Clear the form fields
        eventForm.reset();
        // re-fetch and render events
        getEvents().then(() => {
          renderEvents();
        });
        showFormButton.disabled = false;
      })
      .catch((error) => {
        alert("Error:", error);
        console.error("Error:", error);
        showFormButton.disabled = false;
      });
  });

  getEvents().then(() => {
    renderEvents();
  });
});
