function login() {
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const getEmail = document.getElementById('loginEmail').value;
    const getPassword = document.getElementById('loginPassword').value;

    const requestData = { email: getEmail, password: getPassword };

    Swal.fire({
      title: 'Loading...',
      text: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch('http://localhost:5500/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      Swal.fire({
        title: response.ok ? result.message : 'Warning!',
        text: response.ok ? `Let's create your task` : result.message || 'Something went wrong',
        icon: response.ok ? 'success' : 'warning'
      }).then(() => {
        if (response.ok) {
          localStorage.setItem('username', result.data.username);
          // window.location.href = window.location.origin + '/index.html';
          window.location.href = '/';
          history.replaceState(null, null, '/');
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
  });
}
document.addEventListener('DOMContentLoaded', function () {
  login();
});
