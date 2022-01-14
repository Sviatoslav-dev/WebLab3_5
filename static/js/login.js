
import { toast } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  form.addEventListener('submit', SubmitEntry);

  const fetchOptions = {
    method: 'POST',
    cache: 'no-cache',
    headers: new Headers({
      'content-type': 'application/json',
    }) };

  if (localStorage.getItem('token') !== null) {
    fetch('/todo_list', {
      ...fetchOptions,
      body: JSON.stringify({ token: localStorage.getItem('token') }),
    }).then(response => {
      if (response.status !== 405 && response.status !== 403) {
        postForm('/todo_list', { token: localStorage.getItem('token') });
        return Promise.resolve(response);
      } else {
        return Promise.reject(new Error(response.statusText));
      }
    }).catch(() => {
      console.log('the token is out of date');
      toast('login time elapsed, you need to re-login');
    });
  }

  async function SubmitEntry(e) {
    e.preventDefault();

    const entry = Object.fromEntries(Array.from(form.elements).map(el => [el.name, el.value]));

    form.classList.add('sending');
    fetch('/log_send', {
      ...fetchOptions,
      body: JSON.stringify(entry),
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
      form.classList.remove('sending');
      toast('Wrong name or password', false);
    });
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
