function togglePassword () {
  const newPassowrdInput = document.getElementById('newPassword');
  const repeatPasswordInput = document.getElementById('repeatPassword');
  const toggleNewPassword = document.getElementById('toggle-newPassword')
  const toggleReapeatPassword = document.getElementById('toggle-reapetPassword');

  toggleNewPassword.addEventListener('click', function () {
    if (newPassowrdInput.type === 'password') {
      newPassowrdInput.type = 'text';
      toggleNewPassword.classList.remove('fa-eye-slash');
      toggleNewPassword.classList.add('fa-eye');
    } else {
      newPassowrdInput.type = 'password';
      toggleNewPassword.classList.remove('fa-eye');
      toggleNewPassword.classList.add('fa-eye-slash');
    }
  });

  toggleReapeatPassword.addEventListener('click', function () {
    if (repeatPasswordInput.type === 'password') {
      repeatPasswordInput.type = 'text';
      toggleReapeatPassword.classList.remove('fa-eye-slash');
      toggleReapeatPassword.classList.add('fa-eye');
    } else {
      repeatPasswordInput.type = 'password';
      toggleReapeatPassword.classList.remove('fa-eye');
      toggleReapeatPassword.classList.add('fa-eye-slash');
    }
  });
};

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

function resetPassword () {
  const resetPasswordForm = document.getElementById('resetPassword-form');
  const resetPasswordToken = localStorage.getItem('resetPasswordToken');

  if (!resetPasswordToken) {
    Swal.fire({
      title: 'Error!',
      text: 'Invalid or expired reset token!',
      icon: 'error'
    });
    return;
  }

  resetPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const repeatPassword = document.getElementById('repeatPassword').value;

    if (newPassword !== repeatPassword) {
      Swal.fire({
        title: 'Warning!',
        text: 'Password does not match!',
        icon: 'error'
      });
      return;
    }

    Swal.fire({
      title: 'Loading...',
      text: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch(`http://localhost:5500/v1/auth/reset-password?tokens=${resetPasswordToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({newPassword})
      });

      const result = response.json();

      Swal.fire({
        title: response.ok ? result.message : 'Warning!',
        text: response.ok ? 'Password has been reset successfully. Please login again.' : result.message || 'Something went wrong',
        icon: response.ok ? 'success' : 'warning'
      })
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
}


document.addEventListener('DOMContentLoaded', function () {
  togglePassword();
  resetPassword()
});
