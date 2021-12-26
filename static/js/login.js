'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  form.addEventListener('submit', SubmitEntry);

  if (localStorage.getItem('token') !== null) {
    fetch('/todo_list', {
      method: 'POST',
      body: JSON.stringify({ token: localStorage.getItem('token') }),
      cache: 'no-cache',
      headers: new Headers({
        'content-type': 'application/json',
      }),
    }).then(response => {
      if (response.status !== 405 && response.status !== 403) {
        postForm('/todo_list', { token: localStorage.getItem('token') });
      }
    });
  }

  async function SubmitEntry(e) {
    e.preventDefault();


    const formData = new FormData(form);
    const entry = {};

    for (const key of formData.keys()) {
      entry[key] = formData.get(key);
    }

    form.classList.add('sending');
    fetch('/log_send', {
      method: 'POST',
      body: JSON.stringify(entry),
      cache: 'no-cache',
      headers: new Headers({
        'content-type': 'application/json',
      }),
    }).then(response => {
      form.classList.remove('sending');
      if (response.status === 200) {
        return response.json();
      } else {
        return Promise.reject(new Error(response.statusText));
      }
    }).then(text => {
      localStorage.setItem('token', text['token']);
      console.log(localStorage.getItem('token'));
      form.reset();
      toast('Login successfully');
      postForm('/todo_list', { token: localStorage.getItem('token') });
    }).catch(() => {
      toast('Wrong name or password', 'red');
    });
  }

  function toast(text, color = '#333') {
    const snackbar = document.getElementById('snackbar');
    snackbar.className = 'show';
    snackbar.innerText = text;
    snackbar.style.backgroundColor = color;
    setTimeout(() => { snackbar.className = snackbar.className.replace('show', ''); }, 3000);
  }

  function postForm(path, params, method) {
    method = method || 'post';

    const form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', path);

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', key);
        hiddenField.setAttribute('value', params[key]);

        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();
  }
});
