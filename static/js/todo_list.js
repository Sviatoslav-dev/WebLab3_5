
import { toast } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const addMessage = document.querySelector('.message'),
        addButton = document.querySelector('.add'),
        todo = document.querySelector('.todo'),
        logOut = document.querySelector('.log-out');

  logOut.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  });

  let todoList = [];

  const fetchOptions = {
    method: 'POST',
    cache: 'no-cache',
    headers: new Headers({
      'content-type': 'application/json',
    }) };

  function getMessages() {
    fetch('/todo_list/get_list', {
      ...fetchOptions,
      body: JSON.stringify({}),
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
        ...fetchOptions,
        body: JSON.stringify(newTodo),
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
        const id = parseInt(e.target.parentNode.dataset.id);
        deleteItem(id);
      });
    });

    const checkboxes = document.querySelectorAll('.checkboxes');
    checkboxes.forEach(item => {
      item.addEventListener('change', e => {
        const id = parseInt(e.target.parentNode.dataset.id);
        updateItem(id, item);
      });
    });
  }

  function updateItem(itemI, item) {
    fetch('/todo_list/update', {
      ...fetchOptions,
      body: JSON.stringify({ id: todoList[itemI]['id'], checked: !todoList[itemI]['checked'] }),
    }).then(() => {
      todoList[itemI]['checked'] = !todoList[itemI]['checked'];
    }).catch(e => {
      item.checked = todoList[itemI]['checked'];
      toast(e, false);
    });
  }

  function deleteItem(itemI) {
    fetch('/todo_list/delete', {
      ...fetchOptions,
      body: JSON.stringify({ id: todoList[itemI]['id'] }),
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
      li.setAttribute('data-id', `${i}`);

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
