'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const snackbar = document.getElementById('snackbar');
  form.addEventListener('submit', SubmitEntry);

  async function SubmitEntry(e) {
    e.preventDefault();


    const formData = new FormData(form);

    const entry = {};

    for (const key of formData.keys()) {
      entry[key] = formData.get(key);
    }

    form.classList.add('sending');
    fetch('/register/send', {
      method: 'POST',
      body: JSON.stringify(entry),
      cache: 'no-cache',
      headers: new Headers({
        'content-type': 'application/json',
      }),
    }).then(response => {
      form.classList.remove('sending');
      if (response.status === 200) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(new Error(response.statusText));
      }
    }).then(() => {
      form.reset();
      toast('Registered successfully');
    }).catch(error => {
      form.classList.remove('sending');
      toast(error, false);
    });
  }

  function setCssVar(name, value) {
    document.documentElement.style.setProperty(name, value);
  }

  function toast(text, success = true) {
    if (success) {
      setCssVar('--snakebar-background-color', '#333');
    } else {
      setCssVar('--snakebar-background-color', 'red');
    }
    snackbar.className = 'show';
    snackbar.innerText = text;
    setTimeout(() => { snackbar.className = snackbar.className.replace('show', ''); }, 3000);
  }
});
