let taskId = null;

function popUpEditTask() {
  let getEditTask = document.querySelectorAll(".editTaskBtn");
  let getPopupEdit = document.querySelector(".container-editTask");
  let getCloseBtnEdit = document.querySelector(".close-btn-edit");
  let getBackgroundEditTask = document.querySelector(".bg-editTask");

  getEditTask.forEach((button) => {
    button.addEventListener("click", function (event) {
      getPopupEdit.classList.add("active");
      getBackgroundEditTask.classList.add("active");

      if (event.target.closest(".editTaskBtn")) {
        const editButton = event.target.closest(".editTaskBtn");
        taskId = editButton.getAttribute("data-id");
      }
    });
  });

  getCloseBtnEdit.addEventListener("click", function () {
    getPopupEdit.classList.remove("active");
    getBackgroundEditTask.classList.remove("active");
  });
}

async function editTask() {
  const editTaskForm = document.getElementById("editTask-form");
  let getPopupEdit = document.querySelector(".container-editTask");
  let getBackgroundEditTask = document.querySelector(".bg-editTask");

  editTaskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("titleTaskEdit").value;
    const dueDate = document.getElementById("dueDateEdit").value;
    const task = document.getElementById("taskEdit").value;
    const isCompleted = document.getElementById("isCompletedEdit").checked;
    const isImportant = document.getElementById("isImportantEdit").checked;

    const requestData = {
      title,
      dueDate,
      task,
      isCompleted,
      isImportant,
    };

    Swal.fire({
      title: "Loading...",
      text: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetchWithAuth(`http://localhost:5500/v1/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      Swal.fire({
        title: response.ok ? result.message : "Warning!",
        text: response.ok
          ? `Task is updated`
          : result.message || "Something went wrong",
        icon: response.ok ? "success" : "warning",
      });

      if (response.ok) {
        await getTask();
        await deleteTask();
      }

      getPopupEdit.classList.remove("active");
      getBackgroundEditTask.classList.remove("active");
      taskId = null;
    } catch (err) {
      console.log("Error: ", err);
      Swal.fire({
        title: "Error!",
        text: "Internal server error!",
        icon: "error",
      });
      return;
    }
  });
}

function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    let [key, value] = cookie.trim().split("=");
    if (key === name) {
      return value;
    }
  }
  return null;
}

async function fetchWithAuth(url, options = {}) {
  if (!options.headers) {
    options.headers = {};
  }

  options.credentials = "include";

  let response = await fetch(url, options);

  if (response.status === 401) {
    Swal.fire({
      title: "warning!",
      text: "Access token expired, try to refresh token...!",
      icon: "warning",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const refreshResponse = await fetch(
      "http://localhost:5500/v1/auth/refresh-token",
      {
        method: "POST",
        credentials: "include",
      }
    );

    const result = await refreshResponse.json();

    if (refreshResponse.ok) {
      Swal.fire({
        title: "Info!",
        text: result.message || "Something went wrong",
        icon: "info",
      });
      response = await fetch(url, options); // Coba request ulang dengan token baru
    }
  }

  return response;
}
