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

function logout () {
  const refreshToken = getCookie('refreshToken');
  const getLogout = document.querySelector('.form-logout');

  getLogout.addEventListener('click', async (event) => {
    event.preventDefault();

    Swal.fire({
      title: 'Loading...',
      text: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch('http://localhost:5500/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      const result = await response.json();

      Swal.fire({
        title: response.ok ? result.message : 'Warning!',
        text: response.ok ? `Let's create your task` : result.message || 'Something went wrong',
        icon: response.ok ? 'success' : 'warning'
      }).then(() => {
        if (response.ok) {
          // window.location.href = window.location.origin + '/index.html';
          window.location.href = '/auth';
          history.replaceState(null, null, '/auth');
          // window.open('http://127.0.0.1:5500/public/index.html')
        }
      });
    } catch (err) {
      console.log('Error: ', err);
      Swal.fire({
        title: 'Error!',
        text: 'Internal server error!',
        icon: 'error'
      });
      return;
    }
  })
};