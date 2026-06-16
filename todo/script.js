// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompleted');
const deleteAllBtn = document.getElementById('deleteAll');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');

// State
let todos = [];
let currentFilter = 'all';
const STORAGE_KEY = 'todos';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    renderTodos();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);
    deleteAllBtn.addEventListener('click', deleteAll);
}

// Add Todo
function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    todos.unshift(todo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

// Toggle Todo Completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// Delete Todo
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

// Edit Todo
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const newText = prompt('Edit task:', todo.text);
    if (newText !== null && newText.trim() !== '') {
        todo.text = newText.trim();
        saveTodos();
        renderTodos();
    }
}

// Clear Completed Todos
function clearCompleted() {
    if (confirm('Are you sure you want to delete all completed tasks?')) {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        renderTodos();
    }
}

// Delete All Todos
function deleteAll() {
    if (todos.length === 0) {
        alert('No tasks to delete!');
        return;
    }
    if (confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
        todos = [];
        saveTodos();
        renderTodos();
    }
}

// Render Todos
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    todoList.innerHTML = '';

    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-text">No tasks yet. Add one to get started!</div>
            </div>
        `;
    } else {
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''} 
                       onchange="toggleTodo(${todo.id})">
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="edit-btn" onclick="editTodo(${todo.id})">Edit</button>
                <button class="delete-btn-item" onclick="deleteTodo(${todo.id})">Delete</button>
            `;
            todoList.appendChild(li);
        });
    }

    updateStats();
}

// Get Filtered Todos
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

// Update Stats
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    totalTasksSpan.textContent = total;
    completedTasksSpan.textContent = completed;
}

// Save Todos to LocalStorage
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Load Todos from LocalStorage
function loadTodos() {
    const saved = localStorage.getItem(STORAGE_KEY);
    todos = saved ? JSON.parse(saved) : [];
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
