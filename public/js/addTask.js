async function addTask() {
  const addTaskForm = document.getElementById('addTask-form');
  const taskContainer = document.querySelector('.container-body-mid');
  let getPopupAdd = document.querySelector('.container-addTask');
  let getBackgroundAddTask = document.querySelector('.bg-addTask');
  const getId = getCookie('userId');

  addTaskForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('titleTaskAdd').value;
    const dueDate = document.getElementById('dueDateAdd').value;
    const task = document.getElementById('taskAdd').value;
    const getIsCompleted = document.getElementById('isCompletedAdd');
    const getIsImportant = document.getElementById('isImportantAdd');
    const isCompleted = getIsCompleted.checked ?  true :  false;
    const isImportant = getIsImportant.checked ?  true :  false;

    const requestData = { title, dueDate, task, isCompleted, isImportant };

    Swal.fire({
      title: 'Loading...',
      text: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    try {
      const response = await fetchWithAuth(`http://localhost:5500/v1/tasks/${getId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
         },
        credentials: 'include',
        body: JSON.stringify(requestData)
      });

      const result = await response.json();  // Gunakan await untuk menunggu hasil
      taskContainer.innerHTML = '';

      Swal.fire({
        title: response.ok ? result.message : 'Warning!',
        text: response.ok ? `Let's menage your task` : result.message || 'Something went wrong',
        icon: response.ok ? 'success' : 'warning'
      })

      if(response.ok){
        await getTask();
        document.getElementById('titleTaskAdd').value = '';
        document.getElementById('dueDateAdd').value = '';
        document.getElementById('taskAdd').value = '';
        document.getElementById('isCompletedAdd').checked = false;
        document.getElementById('isImportantAdd').checked = false;
      }

      getPopupAdd.classList.remove('active');
      getBackgroundAddTask.classList.remove('active');
    } catch (err) {
      console.log('Error: ', err);
      Swal.fire({
        title: 'Error!',
        text: 'Internal server error!',
        icon: 'error'
      });
      return;
    }
  });

}

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    let [key, value] = cookie.trim().split('=');
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
      title: 'warning!',
      text: 'Access token expired, try to refresh token...!',
      icon: 'warning',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    const refreshResponse = await fetch("http://localhost:5500/v1/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    const result = await refreshResponse.json();

    if (refreshResponse.ok) {
      Swal.fire({
        title: 'Info!',
        text: result.message || 'Something went wrong',
        icon: 'info'
      })
      response = await fetch(url, options); // Coba request ulang dengan token baru
    }
  }

  return response;
}
