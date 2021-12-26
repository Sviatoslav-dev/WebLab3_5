'use strict';

const addMessage = document.querySelector('.message'),
      addButton = document.querySelector('.add'),
      todo = document.querySelector('.todo'),
      logOut = document.querySelector('.log-out');

logOut.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/';
});

let todoList = [];

function getMessages() {
  fetch('/todo_list/get_list', {
    method: 'POST',
    body: JSON.stringify({}),
    cache: 'no-cache',
    headers: new Headers({
      'content-type': 'application/json',
    }),
  }).then(response => response.json()).then(text => {
    todoList = text;
    displayMessages();
  });
}

getMessages();

addButton.addEventListener('click', () => {
  if (addMessage.value !== '') {
    const newTodo = {
      todo: addMessage.value,
      checked: false,
    };

    fetch('/todo_list/add', {
      method: 'POST',
      body: JSON.stringify(newTodo),
      cache: 'no-cache',
      headers: new Headers({
        'content-type': 'application/json',
      }),
    }).then(response => response.json()).then(() => {
      getMessages();
    });
    addMessage.value = '';
  }
});

function addListeners() {
  const delButtons = document.querySelectorAll('.del');

  delButtons.forEach(item => {
    item.addEventListener('click', e => {
      const id = parseInt(e.target.parentNode.id.slice(3));
      deleteItem(id);
    });
  });

  const checkboxes = document.querySelectorAll('.checkboxes');
  checkboxes.forEach(item => {
    item.addEventListener('change', e => {
      const id = parseInt(e.target.parentNode.id.slice(3));
      todoList[id]['checked'] = !todoList[id]['checked'];
      updateItem(id);
    });
  });
}

function updateItem(itemI) {
  fetch('/todo_list/update', {
    method: 'POST',
    body: JSON.stringify({ id: todoList[itemI]['id'], checked: todoList[itemI]['checked'] }),
    cache: 'no-cache',
    headers: new Headers({
      'content-type': 'application/json',
    }),
  });
}

function deleteItem(itemI) {
  fetch('/todo_list/delete', {
    method: 'POST',
    body: JSON.stringify({ id: todoList[itemI]['id'] }),
    cache: 'no-cache',
    headers: new Headers({
      'content-type': 'application/json',
    }),
  }).then(response => response.json()).then(() => {
    getMessages();
  });
}

function displayMessages() {
  let displayMessage = '';
  todoList.forEach((item, i) => {
    displayMessage += `
        <li  id='li_${i}'>
            <input class="checkboxes" type='checkbox' id='item_${i}' ${item.checked ? 'checked' : ''}>
            <label class="todo-li" for='item_${i}'>${item.todo}</label>
            <button class="del"></button>
        </li>
        `;
  });
  todo.innerHTML = displayMessage;
  if (todoList.length > 0) {
    addListeners();
  }
}
