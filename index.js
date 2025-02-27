const COHORT = "2412-FTB-MT-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const jsonObj = await response.json();

    state.events = jsonObj.data;
    console.log("state.events = ", state.events);
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

function renderEvents() {
  const eventsContainer = document.getElementById("party-table-body");
  console.log("eventsContainer = ", eventsContainer);

  console.log("state.events = ", state.events);

  state.events.forEach((event) => {
    console.log("event = ", event);
    const eventRow = createEventRow(event);
    eventsContainer.appendChild(eventRow);
  });
}

//getEvents();

document.addEventListener("DOMContentLoaded", () => {
  getEvents().then(() => {
    renderEvents();
  });
});
