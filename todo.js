const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');

// Load tasks from localStorage
const loadTodos = () => {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todos.forEach(({ task, completed }) => addTodoToDOM(task, completed));
};

// Save tasks to localStorage
const saveTodos = () => {
  const todos = Array.from(todoList.children).map(li => ({
    task: li.firstChild.textContent,
    completed: li.classList.contains('completed')
  }));
  localStorage.setItem('todos', JSON.stringify(todos));
};

// Add a task to DOM
const addTodoToDOM = (task, completed = false) => {
  const li = document.createElement('li');
  li.textContent = task;
  if (completed) li.classList.add('completed');

  const delBtn = document.createElement('button');
  delBtn.textContent = '✖';
  delBtn.onclick = () => {
    li.remove();
    saveTodos();
  };

  li.appendChild(delBtn);

  li.onclick = (e) => {
    if (e.target !== delBtn) {
      li.classList.toggle('completed');
      saveTodos();
    }
  };

  todoList.appendChild(li);
};

// Add new task
addTodoBtn.addEventListener('click', () => {
  const task = todoInput.value.trim();
  if (!task) return;

  addTodoToDOM(task);
  todoInput.value = '';
  saveTodos();
});

// Initialize
loadTodos();
