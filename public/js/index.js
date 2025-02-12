function darkMode() {
  let darkmode = localStorage.getItem('darkmode');
  const theme = document.getElementById('theme-switch');
  let textDarkmode = document.getElementById('txt-dark');

  const enableDarkMode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
    if (textDarkmode) textDarkmode.textContent = 'Darkmode';
    localStorage.setItem('text-darkmode', 'active');
  };

  const disableDarkMode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkmode', null);
    if (textDarkmode) textDarkmode.textContent = 'Lightmode';
    localStorage.setItem('text-darkmode', null);
  };

  // Atur mode awal sesuai dengan localStorage
  if (darkmode === 'active') enableDarkMode();

  theme.addEventListener('click', function () {
    darkmode = localStorage.getItem('darkmode');
    darkmode !== 'active' ? enableDarkMode() : disableDarkMode();
  });
}

function getCurrentDate() {
  let date;
  let dateTime;

  date = new Date();
  dateTime = date.toISOString().split('T')[0];

  document.querySelectorAll('.date').forEach((element) => {
    element.textContent = dateTime;
  });
}

function popUpAddTask() {
  let getAddTaskMid = document.querySelector('.add-nav-mid');
  let getAddTaskRight = document.querySelector('.add-nav-right');
  let getPopupAdd = document.querySelector('.container-addTask');
  let getCloseBtn = document.querySelector('.close-btn-add');
  let getBackgroundAddTask = document.querySelector('.bg-addTask');

  // Event listener untuk membuka popup
  getAddTaskMid.addEventListener('click', function () {
    getPopupAdd.classList.add('active');
    getBackgroundAddTask.classList.add('active');
  });
  getAddTaskRight.addEventListener('click', function () {
    getPopupAdd.classList.add('active');
    getBackgroundAddTask.classList.add('active');
  })

  // Event listener untuk menutup popup
  getCloseBtn.addEventListener('click', function () {
    getPopupAdd.classList.remove('active');
    getBackgroundAddTask.classList.remove('active');
  });
};