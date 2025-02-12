function forgotPassword () {
  const forgotForm = document.getElementById('forgot-password-form');
  const getForgot = document.getElementById('item-forgotPassword-form');
  const getRegist = document.getElementById('item-register-form');

  forgotForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('forgotPasswordEmail').value;

    Swal.fire({
      title: 'Loading...',
      text: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch('http://localhost:5500/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email})
      });

      const result = await response.json()
      console.log('tokens: ',result.tokens )
      Swal.fire({
        title: response.ok ? result.message : 'Warning!',
        text: response.ok ? 'open email and click link to reset your password' : result.message || 'Something went wrong',
        icon: response.ok ? 'success' : 'warning'
      }).then(() => {
        if (response.ok) {
          localStorage.setItem('resetPasswordToken', result.tokens)
          getForgot.style.display = 'none';
          getRegist.style.removeProperty('display');
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
}

document.addEventListener('DOMContentLoaded', function () {
  forgotPassword();
});
