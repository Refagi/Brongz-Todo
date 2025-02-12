function register() {
  const registerForm = document.getElementById('register-form');
  const getSendVerif = document.getElementById('item-sendVerif-form');
  const getRegist = document.getElementById('item-register-form');

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const ageValue = document.getElementById('registerAge').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const age = isNaN(parseInt(ageValue, 10)) ? 0 : parseInt(ageValue, 10);

    const requestData = { username, age, email, password };
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch('http://localhost:5500/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      Swal.fire({
        title: response.ok ? result.message : 'Warning!',
        text: response.ok ? 'We will send verification to your email' : result.message || 'Something went wrong',
        icon: response.ok ? 'success' : 'warning'
      });

      if (response.ok) {
        getRegist.style.display = 'none';
        getSendVerif.style.removeProperty('display');
      }
    } catch (err) {
      console.error('Error:', err);
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
  register();
});
