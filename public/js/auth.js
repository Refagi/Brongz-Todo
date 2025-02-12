function textMove() {
  new TypeIt('.quote-login h1', {
    speed: 50,
    waitUntilVisible: true,
    afterComplete: () => {
      setTimeout(() => {
        new TypeIt('.quote-login p', {
          speed: 50,
          waitUntilVisible: true
        })
          .type(`Don't miss the opportunity to be more productive`)
          .pause(500)
          .break()
          .move(0)
          .go();
      }, 1000);
    }
  })
    .move(-1)
    .go();
}

function togglePassword() {
  const passwordInputLogin = document.getElementById('loginPassword');
  const toggleIconLogin = document.getElementById('toggle-pw');
  const passwordInputRegis = document.getElementById('registerPassword');
  const toggleIconRegis = document.getElementById('toggle-pw-register');

  toggleIconLogin.addEventListener('click', function () {
    if (passwordInputLogin.type === 'password') {
      passwordInputLogin.type = 'text';
      toggleIconLogin.classList.remove('fa-eye-slash');
      toggleIconLogin.classList.add('fa-eye');
    } else {
      passwordInputLogin.type = 'password';
      toggleIconLogin.classList.remove('fa-eye');
      toggleIconLogin.classList.add('fa-eye-slash');
    }
  });

  toggleIconRegis.addEventListener('click', function () {
    if (passwordInputRegis.type === 'password') {
      passwordInputRegis.type = 'text';
      toggleIconRegis.classList.remove('fa-eye-slash');
      toggleIconRegis.classList.add('fa-eye');
    } else {
      passwordInputRegis.type = 'password';
      toggleIconRegis.classList.remove('fa-eye');
      toggleIconRegis.classList.add('fa-eye-slash');
    }
  });
}

function switchToRegisterAndForgotPassword () {
  let getLogin = document.getElementById('item-login-form');
  let getRegist = document.getElementById('item-register-form');
  let getForgot = document.getElementById('item-forgotPassword-form');
  let getToggleRegist = document.getElementById('toggle-register');
  let getToggleLogin = document.getElementById('toggle-login');
  let getToggleForgot = document.getElementById('toggle-forgot');
  let getToggleBack = document.getElementById('toggle-back');

  getToggleRegist.addEventListener('click', function () {
    getLogin.style.display = 'none'; // Sembunyikan form login
    getRegist.style.removeProperty('display') // Tampilkan form register
  });

  getToggleLogin.addEventListener('click', function () {
    getRegist.style.display = 'none'; // Sembunyikan form register
    getLogin.style.removeProperty('display') // Tampilkan form login
  });

  getToggleForgot.addEventListener('click', function () {
    getLogin.style.display = 'none';
    getRegist.style.display = 'none';
    getForgot.style.removeProperty('display');
  });

  getToggleBack.addEventListener('click', function () {
    getForgot.style.display = 'none';
    getRegist.style.display = 'none'
    getLogin.style.removeProperty('display');
  });

};


document.addEventListener('DOMContentLoaded', function () {
  textMove();
  togglePassword();
  switchToRegisterAndForgotPassword();
});
