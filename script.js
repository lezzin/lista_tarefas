const STORAGE_KEY = "todos";

const forms = {
    add: document.querySelector("#add_form"),
    edit: document.querySelector("#edit_form"),
    search: document.querySelector("#search_form"),
    filter: document.querySelector("#filter_form"),
    another: document.querySelector(".forms__grid"),
};

const cancelEditBtn = document.querySelector("#cancel_edit_btn");

const todoList = document.querySelector(".todo");
const messageSpan = document.querySelector(".message__muted");
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function toggleForms() {
    forms.edit.classList.toggle("hidden");
    forms.add.classList.toggle("hidden");
    forms.another.classList.toggle("hidden");
}

function renderTodoItem(element, index) {
    const statusClass = element.completed ? "completed" : "incompleted";
    const itemHtml = `
        <li class="todo__item ${statusClass}">
            <p class="todo__item_description">${element.description}</p>
            <div>
                <button type="button" class="btn__check" onclick="changeTodoStatus(${index})">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button type="button" class="btn__pen" onclick="editTodo(${index})">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button type="button" class="btn__xmark" onclick="removeTodo(${index})">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </li>`;
    todoList.innerHTML += itemHtml;
}

function loadTodos() {
    todoList.innerHTML = "";
    todos.forEach((element, index) => renderTodoItem(element, index));

    messageSpan.innerHTML = todos.length ? `Tarefas encontradas: ${todos.length}` : ``;

    handleFilterTodo();
    handleSearchTodo();
}

function editTodo(index) {
    toggleForms();
    const { description } = todos[index];
    const input = forms.edit.querySelector("#edit_input");
    const inputHidden = forms.edit.querySelector("#edit_input_index");

    input.value = description;
    inputHidden.value = index;
    input.focus();
}

function changeTodoStatus(index) {
    todos[index].completed = !todos[index].completed;
    saveStorage();
    loadTodos();
}

function removeTodo(index) {
    todos.splice(index, 1);
    saveStorage();
    loadTodos();
}

function handleAddTodo() {
    const input = forms.add.querySelector("#add_input");
    const value = input.value;

    if (value) {
        const todo = { description: value, completed: false };
        todos.push(todo);

        input.value = "";
        input.focus();

        saveStorage();
        loadTodos();
    }
}

function handleEditTodo() {
    const newDescription = forms.edit.querySelector("#edit_input").value;
    const index = forms.edit.querySelector("#edit_input_index").value;

    if (newDescription) {
        todos[index].description = newDescription;
        loadTodos();
        saveStorage();
        toggleForms();
    }
}

function handleSearchTodo() {
    const search = forms.search.querySelector("#search_input").value.toLowerCase();
    let length = 0;

    todoList.querySelectorAll(".todo__item").forEach((element) => {
        const description = element.querySelector(".todo__item_description").innerHTML.toLowerCase();

        element.classList.toggle("hidden", !description.includes(search));
        !element.classList.contains("hidden") && length++;
    });

    messageSpan.innerHTML = `Tarefas encontradas: ${length}`;
}

function handleFilterTodo() {
    const filter = forms.filter.querySelector("#filter_select").value.toLowerCase();
    let length = 0;

    todoList.querySelectorAll(".todo__item").forEach((element) => {
        element.classList.toggle("hidden", !element.classList.contains(filter));
        !element.classList.contains("hidden") && length++;
    });

    messageSpan.innerHTML = `Tarefas encontradas: ${length}`;
}

function addEventListeners() {
    forms.add.addEventListener("submit", (e) => {
        e.preventDefault();
        handleAddTodo();
    });

    forms.edit.addEventListener("submit", (e) => {
        e.preventDefault();
        handleEditTodo();
    });

    forms.search.addEventListener("submit", (e) => {
        e.preventDefault();
        handleSearchTodo();
    });

    forms.search.querySelector("#search_input").addEventListener("input", handleSearchTodo);
    forms.filter.querySelector("#filter_select").addEventListener("change", handleFilterTodo);
    cancelEditBtn.addEventListener("click", toggleForms);
}

addEventListeners();
loadTodos();
