let taskIdDelete = null;

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

async function deleteTask() {
  const taskContainer = document.querySelector(".container-body-mid");
  taskContainer.addEventListener("click", async (event) => {
    if (event.target.closest(".deleteTaskBtn")) {
      const deleteButton = event.target.closest(".deleteTaskBtn");
      taskIdDelete = deleteButton.getAttribute("data-id");

      if (!taskIdDelete) {
        Swal.fire({
          title: "Error!",
          text: "Task id not found!",
          icon: "error",
        });
        return;
      }

      Swal.fire({
        title: "Loading...",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const response = await fetchWithAuth(
          `http://localhost:5500/v1/tasks/${taskIdDelete}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const result = await response.json();

        Swal.fire({
          title: response.ok ? result.message : "Warning!",
          text: response.ok
            ? `delete task success`
            : result.message || "Terjadi kesalahan",
          icon: response.ok ? "success" : "warning",
        });

        if (response.ok) {
          await getTask(); // Refresh daftar tugas
        }
        taskIdDelete = null;
      } catch (err) {
        console.log("Error: ", err);
        Swal.fire({
          title: "Error!",
          text: "Internal server error!",
          icon: "error",
        });
        return;
      }
    }
  });
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
