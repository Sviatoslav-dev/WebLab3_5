'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const snackbar = document.getElementById('snackbar');
  const addMessage = document.querySelector('.message'),
        addButton = document.querySelector('.add'),
        todo = document.querySelector('.todo'),
        logOut = document.querySelector('.log-out');

  logOut.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  });

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
    }).catch(e => {
      toast(e, false);
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
      }).catch(e => {
        toast(e, false);
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
        updateItem(id);
      });
    });
  }

  function updateItem(itemI) {
    fetch('/todo_list/update', {
      method: 'POST',
      body: JSON.stringify({ id: todoList[itemI]['id'], checked: !todoList[itemI]['checked'] }),
      cache: 'no-cache',
      headers: new Headers({
        'content-type': 'application/json',
      }),
    }).then(() => {
      todoList[itemI]['checked'] = !todoList[itemI]['checked'];
    }).catch(e => {
      toast(e, false);
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
    }).catch(e => {
      toast(e, false);
    });
  }

  function displayMessages() {
    while (todo.firstChild) {
      todo.removeChild(todo.lastChild);
    }
    todoList.forEach((item, i) => {
      const li = document.createElement('li');
      li.setAttribute('id', `li_${i}`);

      const input = document.createElement('input');
      input.setAttribute('class', 'checkboxes');
      input.setAttribute('type', 'checkbox');
      input.setAttribute('id', `item_${i}`);
      input.checked = item.checked;

      const label = document.createElement('label');
      label.setAttribute('class', 'todo-li');
      label.setAttribute('for', `item_${i}`);
      label.innerText = item.todo;

      const button = document.createElement('button');
      button.setAttribute('class', 'del');

      li.appendChild(input);
      li.appendChild(label);
      li.appendChild(button);
      todo.appendChild(li);
    });

    if (todoList.length > 0) {
      addListeners();
    }
  }
});
