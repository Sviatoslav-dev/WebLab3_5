const snackbar = document.getElementById('snackbar');
export function setCssVar(name, value) {
  document.documentElement.style.setProperty(name, value);
}

export function toast(text, success = true) {
  setCssVar('--snakebar-background-color', success ? '#333' : 'red');
  snackbar.classList.add('show');
  snackbar.innerText = text;
  setTimeout(() => { snackbar.classList.remove('show'); }, 3000);
}
