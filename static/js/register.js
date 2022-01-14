
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

  async function SubmitEntry(e) {
    e.preventDefault();

    const entry = Object.fromEntries(Array.from(form.elements).map(el => [el.name, el.value]));

    form.classList.add('sending');
    fetch('/register/send', {
      ...fetchOptions,
      body: JSON.stringify(entry),
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
