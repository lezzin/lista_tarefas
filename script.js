const forms = {
    add: document.querySelector("#add_form"),
    edit: document.querySelector("#edit_form"),
    search: document.querySelector("#search_form"),
    filter: document.querySelector("#filter_form"),
    another: document.querySelector(".forms__grid"),
};

const todoList = document.querySelector(".todo");
const todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveStorage() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function toggleForms() {
    forms.edit.classList.toggle("hidden");
    forms.add.classList.toggle("hidden");
    forms.another.classList.toggle("hidden");
}

function renderTodoItem(element, index) {
    todoList.innerHTML += `
      <li class="todo__item ${element.completed ? "completed" : "incompleted"}">
          <p class="todo__item_description">${element.description}</p>
          <div>
              <button type="button" class="btn__check" onclick="changeTodoStatus(${index})"><i class="fa-solid fa-check"></i></button>
              <button type="button" class="btn__pen" onclick="editTodo(${index})"><i class="fa-solid fa-pen"></i></button>
              <button type="button" class="btn__xmark" onclick="removeTodo(${index})"><i class="fa-solid fa-xmark"></i></button>
          </div>
      </li>`;
}

function loadTodos() {
    todoList.innerHTML = "";
    todos.forEach((element, index) => renderTodoItem(element, index));
}

function editTodo(index) {
    toggleForms();
    const todo = todos[index];
    const input = forms.edit.querySelector("#edit_input");
    const inputHidden = forms.edit.querySelector("#edit_input_index");
    input.value = todo.description;
    inputHidden.value = index;
}

function changeTodoStatus(index) {
    todos[index].completed = !todos[index].completed;
    loadTodos();
}

function removeTodo(index) {
    todos.splice(index, 1);
    saveStorage();
    loadTodos();
}

forms.add.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = forms.add.querySelector("#add_input");
    const value = input.value;
    if (value) {
        const todo = { description: value, completed: false };
        todos.push(todo);
        input.focus();
        input.value = "";
        saveStorage();
        loadTodos();
    }
});

forms.edit.addEventListener("submit", function (e) {
    e.preventDefault();
    const newDescription = forms.edit.querySelector("#edit_input").value;
    const index = forms.edit.querySelector("#edit_input_index").value;
    if (newDescription) {
        todos[index].description = newDescription;
        loadTodos();
        saveStorage();
        toggleForms();
    }
});

forms.search.querySelector("#search_input").addEventListener("input", function () {
    const search = this.value.toLowerCase();
    todoList.querySelectorAll(".todo__item").forEach((element) => {
        element.classList.toggle("hidden", !element.querySelector(".todo__item_description").innerHTML.toLowerCase().includes(search));
    });
});

forms.filter.querySelector("#filter_select").addEventListener("change", function (e) {
    e.preventDefault();
    const filter = this.value.toLowerCase();
    todoList.querySelectorAll(".todo__item").forEach((element) => {
        element.classList.toggle("hidden", !element.classList.contains(filter));
    });
});

loadTodos();
