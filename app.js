function get(selection) {
  const element = document.querySelector(selection);
  if (element) {
    return element;
  } else {
    throw new Error(`check selection: ${selection}`);
  }
}

const form = get('form');
const alertText = get('.alert-text');
const clearBtn = get('.clear-all-btn');
const input = get('.input');
const submitBtn = get('.submit-btn');
const todosContainer = get('.todo-items-container');
const optionsContainer = get('.todo-options');
const optionsBtns = document.querySelectorAll('.option-btn');

let editFlag = false;
let editID;
let editElement;

//--------------------------------------form submit

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = new Date().getTime().toString();

  const todo = input.value;
  if (todo && !editFlag) {
    createTodo(todo, id);
    alert('item added', 'green');
    addToLS(id, todo);
    resetForm();
  } else if (todo && editFlag) {
    editElement.innerText = todo;
    alert('todo edited', 'green');
    editLS(editID, todo);
    resetForm();
  } else {
    alert('please enter a todo...', 'red');
  }
});

//---------------------------------------create todo

//create
const createTodo = (todo, id) => {
  const article = document.createElement('article');
  article.classList.add('todo-item', 'remaining');
  article.setAttribute('data-id', id);

  article.innerHTML = `          
            <p class="todo-text">${todo}</p>
            <div class="todo-btns">
              <button class="action-btn delete-btn">
                <i class="fas fa-trash-alt"></i>
              </button>
              <button class="action-btn edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn check-btn">
                <span class="completed-btn">
                  <i class="fas fa-check"></i>
                </span>
              </button>
            </div>
         `;

  todosContainer.append(article);
  clearBtn.style.visibility = 'visible';
  optionsContainer.style.visibility = 'visible';
  const delBtn = article.querySelector('.delete-btn');
  const editBtn = article.querySelector('.edit-btn');
  const checkBtn = article.querySelector('.check-btn');

  delBtn.addEventListener('click', delTodo);
  editBtn.addEventListener('click', editTodo);
  checkBtn.addEventListener('click', (e) => {
    checkTodo(e);
    resetForm();
  });
};

//-------------------------------------------------todo btns

//delete
function delTodo(e) {
  const todo = e.currentTarget.parentElement.parentElement;
  const id = todo.dataset.id;
  todo.remove();
  alert('item deleted', 'red');
  if (todosContainer.children.length === 0) {
    clearBtn.style.visibility = 'hidden';
    optionsContainer.style.visibility = 'hidden';
  }
  resetForm();

  delFromLS(id);
}

//edit
function editTodo(e) {
  editFlag = true;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  editID = editElement.parentElement.dataset.id;
  input.value = editElement.innerText;
  input.focus();
  submitBtn.innerText = 'Edit';
}

//check
function checkTodo(e) {
  const todo = e.currentTarget.parentElement.parentElement;
  const editBtn = e.currentTarget.previousElementSibling;
  todo.classList.toggle('completed');
  editBtn.classList.toggle('faded');
}

//---------------------------------------------------------------------
//reset form
function resetForm() {
  input.value = '';
  submitBtn.innerText = 'submit';
  editFlag = false;
  editElement = null;
  editID = '';
}

//show alert msg
function alert(text, alert) {
  alertText.innerText = text;
  alertText.classList.add(alert);

  setTimeout(() => {
    alertText.classList.remove(alert);
  }, 1500);
}

//clear all items
clearBtn.addEventListener('click', () => {
  const allTodos = document.querySelectorAll('.todo-item');
  allTodos.forEach((todo) => {
    todo.remove();
  });
  alert('todos deleted', 'green');
  clearBtn.style.visibility = 'hidden';
  optionsContainer.style.visibility = 'hidden';
  localStorage.clear();
});

//-------------------------------------------------show selections

//options btns eventListener
optionsContainer.addEventListener('click', (e) => {
  const id = e.target.dataset.id;
  if (id) {
    optionsBtns.forEach((btn) => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');
    filterTodos(id);
  }
});

//filter function
function filterTodos(id) {
  const todos = document.querySelectorAll('.todo-item');
  todos.forEach((todo) => {
    switch (id) {
      case 'all':
        todo.style.display = 'flex';
        break;

      case 'completed':
        if (todo.classList.contains('completed')) {
          todo.style.display = 'flex';
        } else {
          todo.style.display = 'none';
        }

        break;
      case 'remaining':
        if (
          todo.classList.contains('remaining') &&
          !todo.classList.contains('completed')
        ) {
          todo.style.display = 'flex';
        } else {
          todo.style.display = 'none';
        }
        break;
    }
  });
}

//-----------------------------------------------------
// localStorage
//-----------------------------------------------------
//get todos from ls
function getLS() {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];
}

//add todo to ls
function addToLS(id, todo) {
  let list = getLS();
  const todoItem = { id, todo };
  list.push(todoItem);
  localStorage.setItem('list', JSON.stringify(list));
}
//del todo from ls
function delFromLS(id) {
  let list = getLS();
  list = list.filter((todo) => {
    if (todo.id !== id) {
      return todo;
    }
  });
  localStorage.setItem('list', JSON.stringify(list));
}

//edit todo to ls
function editLS(id, value) {
  let list = getLS();
  let editItem = list.find((item) => item.id === id);
  editItem.todo = value;
  localStorage.setItem('list', JSON.stringify(list));
}

///////////////////////////////////////////////////////////

//create items from ls data
function setItems() {
  const list = getLS();
  if (list.length > 0) {
    list.forEach((item) => {
      createTodos(item.id, item.todo);
    });
    clearBtn.style.visibility = 'visible';
    optionsContainer.style.visibility = 'visible';
  }
}

//create function
function createTodos(id, value) {
  const article = document.createElement('article');
  article.classList.add('todo-item', 'remaining');
  article.setAttribute('data-id', id);
  article.innerHTML = `      <p class="todo-text">${value}</p>
            <div class="todo-btns">
              <button class="action-btn delete-btn">
                <i class="fas fa-trash-alt"></i>
              </button>
              <button class="action-btn edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn check-btn">
                <span class="completed-btn">
                  <i class="fas fa-check"></i>
                </span>
              </button>
            </div>`;
  const delBtn = article.querySelector('.delete-btn');
  const editBtn = article.querySelector('.edit-btn');
  const checkBtn = article.querySelector('.check-btn');

  delBtn.addEventListener('click', delTodo);
  editBtn.addEventListener('click', editTodo);
  checkBtn.addEventListener('click', (e) => {
    checkTodo(e);
    resetForm();
  });

  todosContainer.append(article);
}

// set items from ls on load
window.addEventListener('DOMContentLoaded', () => {
  setItems();
});
