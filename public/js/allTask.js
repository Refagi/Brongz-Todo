async function fetchTasks(type) {
  const taskContainer = document.querySelector(".container-body-mid");
  const getHeader = document.querySelector(".item-nav-left h3");
  const getButtonAllTask = document.getElementById("allTask");
  const getButtonImportantTask = document.getElementById("importanTask");
  const getButtonCompletedTask = document.getElementById("completeTask");
  const getUncompletedTask = document.getElementById("uncompleteTask");
  const userId = getCookie("userId");
  const username = getCookie("username");

  let url = `http://localhost:5500/v1/tasks/${userId}`;
  if (type === "important") url = `http://localhost:5500/v1/tasks/important-task/${userId}`;
  if (type === "completed") url = `http://localhost:5500/v1/tasks/completed-task/${userId}`;
  if (type === "uncompleted") url = `http://localhost:5500/v1/tasks/uncompleted-task/${userId}`;

  // Atur tombol aktif
  getButtonAllTask.classList.toggle("active", type === "all");
  getButtonImportantTask.classList.toggle("active", type === "important");
  getButtonCompletedTask.classList.toggle("active", type === "completed");
  getUncompletedTask.classList.toggle("active", type === "uncompleted");

  try {
    const response = await fetchWithAuth(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();
    taskContainer.innerHTML = ""; // Bersihkan container sebelum render ulang
    getHeader.textContent = `Hi, ${username}`;

    if (!response.ok || !result.data || result.data.length === 0) {
      taskContainer.innerHTML = `<h3 style="color:#d62828">No Task Yet...</h3>`;
      return;
    }

    result.data.forEach((task) => {
      const taskElement = document.createElement("div");
      taskElement.classList.add("item-body-mid");

      const statusCompleted = task.isCompleted ? "status-completed" : "status-uncompleted";
      const statusTextCompleted = task.isCompleted ? "completed" : "uncompleted";
      const iconImportant = task.isImportant ? "fas fa-star" : "far fa-star";

      taskElement.innerHTML = `
        <div class="box-task">
          <h3>${task.title}</h3>
          <p>${task.task}</p>
        </div>
        <hr>

        <div class="date-body">
          <i class='fas fa-calendar-alt'></i>
          <p class="date">${task.dueDate}</p>
        </div>

        <div class="status-item">
          <div class="${statusCompleted}">
            <p type="button">${statusTextCompleted}</p>
          </div>

          <div class="status-action">
            <button class="importantTaskBtn" data-id=${task.id} type="button"><i class='${iconImportant}'></i></button>
            <button class="deleteTaskBtn" data-id=${task.id}><i class='fas fa-trash-alt'></i></button>
            <button class="editTaskBtn" data-id=${task.id}><i class='far fa-sun'></i></button>
          </div>
        </div>
      `;
      taskContainer.appendChild(taskElement);
    });

    await popUpAddTask();
    await popUpEditTask();
  } catch (err) {
    console.error("Error:", err);
    Swal.fire({
      title: "Error!",
      text: "Internal server error!",
      icon: "error",
    });
  }
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
