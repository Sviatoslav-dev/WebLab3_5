
import { toast } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  form.addEventListener('submit', SubmitEntry);

  async function SubmitEntry(e) {
    e.preventDefault();

    const entry = Object.fromEntries(Array.from(form.elements).map(el => [el.name, el.value]));

    form.classList.add('sending');
    fetch('/register/send', {
      method: 'POST',
      body: JSON.stringify(entry),
      cache: 'no-cache',
      headers: new Headers({
        'content-type': 'application/json',
      }),
    }).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(new Error(response.statusText));
      }
    }).then(() => {
      form.reset();
      toast('Registered successfully');
    }).catch(error => {
      toast(error, false);
    }).then(() => {
      form.classList.remove('sending');
    });
  }
});
