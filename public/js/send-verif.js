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

function sendVerificationEmail() {
  const sendVerifForm = document.getElementById('sendVerif-form');
  const getSendVerif = document.getElementById('item-sendVerif-form');
  const getRegist = document.getElementById('item-register-form');

  sendVerifForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const getUserId = getCookie('userId');
    const getEmail = document.getElementById('sendVerifEmail').value;

    const requestData = { id: getUserId, email: getEmail };
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch(`http://localhost:5500/v1/auth/send-verification-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      Swal.fire({
        title: response.ok ? result.message : 'Warning!',
        text: response.ok ? 'verification your email' : result.message || 'Something went wrong',
        icon: response.ok ? 'success' : 'warning'
      }).then(() => {
        if(response.ok){
          localStorage.setItem('verifyToken', result.tokens);
          getSendVerif.style.display = 'none';
          getRegist.style.removeProperty('display');
        }
      })
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
  sendVerificationEmail();
});
