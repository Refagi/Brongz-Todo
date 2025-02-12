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

function verifyEmail() {
  const verifyForm = document.getElementById('verifyEmail-btn');
  const verifyToken = localStorage.getItem('verifyToken');
  console.log('verify: ', verifyToken)

  verifyForm.addEventListener('click', async (event) => {
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
      const response = await fetch(`http://localhost:5500/v1/auth/verify-email?tokens=${verifyToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' 
      });
      const result = await response.json();

      Swal.fire({
        title: response.ok ? result.message : 'Warning!',
        text: response.ok ? 'Enter to continue login' : result.message || 'Something went wrong',
        icon: response.ok ? 'success' : 'warning'
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
  verifyEmail();
});
