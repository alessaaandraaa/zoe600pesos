import { apiGet, apiSend } from "./utils.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userId = urlParams.get("user_id");

// -------- VISIBILITY SCRIPT ------------

if (userId === null) {
  location.href = "login.html";
}

$("#logout").on("click", function () {
  location.href = "login.html";
});

$("#editTaskModal").hide();

$("#activeTasks").click(function () {
  $(".active-todo").show();
  $(".inactive-todo").hide();
  $("#taskLabel").text("Active Tasks");

  renderTasks("active");
});

$("#inactiveTasks").click(function () {
  $(".inactive-todo").show();
  $(".active-todo").hide();
  $("#taskLabel").text("Inactive Tasks");

  renderTasks("inactive");
});

$(document).on("click", ".edit-task", function () {
  const id = $(this).data("id");
  const name = $(this).data("name");
  const desc = $(this).data("desc");

  $("#edit_item_id").val(id);
  $("#edit_item_name").val(name);
  $("#edit_item_description").val(desc);
  $("#editTaskModal").show();
  $("#editTaskForm").show();
});

$("#cancelEdit").click(function () {
  $("#editTask").hide();
  $("#editTaskForm").hide();
});

// ------------- ADD TASK -------------

$("#addTaskForm").on("submit", async function (event) {
  event.preventDefault();

  // create javascript object storing the form data
  let formData = {};
  new FormData(this).forEach((value, key) => {
    formData[key] = value;
  });

  formData.user_id = userId;

  try {
    // Use proxy helper instead of raw XMLHttpRequest
    const response = await apiSend("POST", "/addItem_action.php", formData);

    console.log("Add task response:", response);

    alert("Task added!");
    renderTasks("active");
  } catch (err) {
    console.error("Task added failed:", err);
  }
});

// ----------- EDIT TASK --------------
$("#editTaskForm").on("submit", async function (event) {
  event.preventDefault();

  // create javascript object storing the form data
  let formData = {};
  new FormData(this).forEach((value, key) => {
    formData[key] = value;
  });

  console.log(formData);

  try {
    // Use proxy helper instead of raw XMLHttpRequest8
    const response = await apiSend("PUT", "/editItem_action.php", formData);

    console.log("Add task response:", response);

    alert("Task edited!");
    $("#editTask").hide();
    $("#editTaskForm").hide();

    renderTasks("active");
  } catch (err) {
    console.error("Task edit failed:", err);
  }
});

// -- TOGGLE TASK STATUS -----
$(document).on("click", ".toggle-status", function () {
  const taskId = $(this).data("id"); // <-- read from button
  const currentStatus = $(this).data("status");
  const newStatus = currentStatus === "active" ? "inactive" : "active";

  updateTaskStatus(taskId, newStatus);
  S;
});

async function updateTaskStatus(itemId, newStatus) {
  let data = {
    status: newStatus,
    item_id: itemId,
  };

  try {
    const response = await apiSend("POST", "/statusItem_action.php", data);
    console.log("Toggle task response:", response);

    alert("✅ Task status changed to " + newStatus);
    renderTasks("active");
    renderTasks("inactive");
  } catch (err) {
    console.error("Task status toggle failed:", err);
  }
}

// --- DELETE TASK -----------------

$(document).on("click", ".delete-task", function () {
  const taskId = $(this).closest(".card").data("id");
  console.log("Deleting task:", taskId);

  deleteTask(taskId);
});

async function deleteTask(id) {
  try {
    // Use proxy helper instead of direct XMLHttpRequest
    const response = await apiGet("/deleteItem_action.php", { item_id: id });
    console.log("Delete response:", response);
    renderTasks("active");
    renderTasks("inactive");
  } catch (err) {
    console.error("Task delete failed:", err);
  }
}

// -- RENDER TASK --------------------

async function renderTasks(status) {
  try {
    // Use your proxy helper
    const response = await apiGet("/getItems_action.php", {
      status,
      user_id: userId,
    });

    const items = Object.values(response.data || {});
    const todoDiv = document.querySelector(`.${status}-todo`);
    todoDiv.innerHTML = ""; // clear before re-render

    items.forEach((item) => {
      let task = document.createElement("div");
      task.className = "card mb-3 shadow-sm";
      task.dataset.id = item.item_id;
      task.innerHTML = `
        <div class="card-body d-flex justify-content-between align-items-center">
          <!-- LEFT SIDE: Task details -->
          <div class="text-start">
            <h6 class="mb-1 fw-bold">${item.item_name}</h6>
            <small class="text-muted">${item.item_description}</small>
          </div>

          <!-- RIGHT SIDE: Buttons -->
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-edit edit-task"
              data-id="${item.item_id}"
              data-name="${item.item_name}"
              data-desc="${item.item_description}">
              Edit
            </button>
            <button class="btn btn-sm ${
              item.status === "active" ? "btn-secondary" : "btn-custom"
            } toggle-status"
              data-id="${item.item_id}"
              data-status="${item.status}">
              ${item.status === "active" ? "Inactive" : "Active"}
            </button>
            <button class="btn btn-sm btn-danger delete-task">Delete</button>
          </div>
        </div>
      `;
      todoDiv.appendChild(task);
    });
  } catch (err) {
    console.error("Failed to render tasks:", err);
  }
}
