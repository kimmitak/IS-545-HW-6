import { openDb, fetchTodos, createTodo, deleteTodo, editTodo } from './db.js'

// Get references to the form elements.
const newTodoForm = document.getElementById('new-todo-form')
const newTodoInput = document.getElementById('new-todo')
const todoList = document.getElementById('todo-items')

// Handle new todo item form submissions.
newTodoForm.onsubmit = function() {
  // Get the todo text.
  const text = newTodoInput.value

  // Check to make sure the text is not blank (or just spaces).
  if (text.replace(/ /g, '') !== '') {
    // Create the todo item.
    createTodo(text, function(todo) {
      refreshTodos()
    })
  }

  // Reset the input field.
  newTodoInput.value = ''

  // Don't send the form.
  return false
}

window.onload = function() {
  // Display the todo items.
  openDb(refreshTodos)
}

// Update the list of todo items.
function refreshTodos() {
  fetchTodos(function(todos) {
    todoList.innerHTML = ''

    for (let index = todos.length - 1; index >= 0; index--) {
      // Read the todo items backwards (most recent first).
      const todo = todos[index]

      addTodo(todo)
    }
  })
}

function addTodo(todo) {
  const li = document.createElement('li')
  li.id = 'todo-' + todo.timestamp
  const checkbox = document.createElement('input')
  checkbox.type = 'button'
  checkbox.className = 'todo-checkbox'
  checkbox.value = 'Delete'
  checkbox.setAttribute('data-id', todo.timestamp)

  li.appendChild(checkbox)

  const span = document.createElement('span')
  span.innerHTML = todo.text
  li.appendChild(span)

  const todoText = document.createElement('input')
  todoText.type = 'text'
  todoText.id = 'editText'
  todoText.value = todo.text
  todoText.setAttribute('data-id', todo.timestamp)


  todoList.appendChild(li)


  const editBtn = document.createElement('input')
  editBtn.type = 'button'
  editBtn.className = 'todo-edit'
  editBtn.value = 'Edit'
  editBtn.setAttribute('data-id', todo.timestamp)

  li.appendChild(editBtn)

  const saveBtn = document.createElement('input')
  saveBtn.type = 'button'
  saveBtn.className = 'todo-save'
  saveBtn.value = 'Save'
  saveBtn.setAttribute('data-id', todo.timestamp)



  // Setup an event listener for the checkbox.
  checkbox.addEventListener('click', function(e) {
    const id = parseInt(e.target.getAttribute('data-id'))

    deleteTodo(id, refreshTodos)
  })

  editBtn.addEventListener('click', function(e) {

    li.replaceChild(todoText, span)
    li.replaceChild(saveBtn, editBtn)
    
  })

    saveBtn.addEventListener('click', function(e) {
      const id = parseInt(e.target.getAttribute('data-id'))
      
      const updatedTodo = document.getElementById('editText')

        const newText = updatedTodo.value

      editTodo(id, newText, refreshTodos)
    })

}
