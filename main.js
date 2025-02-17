class Todo {
    id;
    #text;
    #status;
    constructor(text, status = "todo") {
        this.id = this.uuidv4();
        this.#text = text;
        this.#status = status;
    }

    set status(newStatus) {
        var validStatuses = ['todo', 'done', 'hold', 'inProgress'];
        if (validStatuses.includes(newStatus))
            this.#status = newStatus;
    }

    get status() {
        return this.#status;
    }

    get text() {
        return this.#text;
    }

    set text(text) {
        if (text.length > 0)
            this.#text = text;
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }
}

class TodoService {
    todos = [];
    constructor() { }

    updateTodoText(newText, id) {
        var elem = this.todos.find(item => item.id == id.split('id-')[1]);
        elem.text = newText;
    }

    updateTodoStatus(newStatus, id) {
        var elem = this.todos.find(item => item.id == id.split('id-')[1]);
        elem.status = newStatus;
    }

    removeTodo(id) {
        var elemIndex = this.todos.findIndex(item => item.id == id.split('id-')[1]);
        this.todos.splice(elemIndex, 1);
    }

    filterByText(text) {
        if (text.length > 0)
            return this.todos.filter(item => item.text.includes(text));

        return this.todos;
    }
}

class HTMLWorker {
    generateTodoHtml(todo) {
        return `<li class="list-group-item ${todo.status}">
                    <div class="d-flex justify-content-between align-items-center">
                        <span>${todo.text}</span>
                        <div id='id-${todo.id}'>
                            <button onclick='doneTodo(event)' type="button" class="btn btn-success">Done</button>
                            <button onclick='updateTodo(event)' type="button" class="btn btn-warning">Update</button>
                            <button onclick='removeTodo(event)' type="button" class="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </li>`
    }

    setHtmlToListElement(todo, container) {
        container.innerHTML += this.generateTodoHtml(todo);
    }

    changeTodoStatusTo(todoLiItem, status) {
        todoLiItem.className = `list-group-item ${status}`
    }

    generateTodos(todods, container) {
        container.innerHTML = "";
        todods.forEach(item => {
            this.setHtmlToListElement(item, container);
        });
    }
}

const todoInp = document.querySelector("#todo");
const saveBtn = document.querySelector("#save");
const todosList = document.querySelector(".todos-list");
var modalOpenBtn = document.querySelector("#modalOpener");
const updateTodoInp = document.querySelector("#updateTodo");
const statusSelect = document.querySelector("#status");
const updateBtn = document.querySelector("#update")
const searchTodosInp = document.querySelector("#search");
var todoService = new TodoService();
var htmlWorker = new HTMLWorker();


saveBtn.addEventListener("click", function () {
    var todo = new Todo(todoInp.value);
    todoService.todos.push(todo);
    htmlWorker.setHtmlToListElement(todo, todosList);
    todoInp.value = "";
});

updateBtn.addEventListener("click", function () {
    var todoNewText = updateTodoInp.value;
    var newStatus = statusSelect.value;

    var todoElem = document.querySelector(`#${this.id}`);
    if (todoNewText.length > 0)
        todoElem.previousSibling.previousSibling.textContent = todoNewText;

    htmlWorker.changeTodoStatusTo(todoElem.parentNode.parentNode, newStatus);
    todoService.updateTodoText(todoNewText, this.id);
    todoService.updateTodoStatus(newStatus, this.id)

    updateTodoInp.value = "";
});

searchTodosInp.addEventListener("input", function () {
    var filteredTodos = todoService.filterByText(this.value);
    htmlWorker.generateTodos(filteredTodos, todosList);
})

function doneTodo(event) {
    var parentElem = event.target.parentNode.parentNode.parentNode;
    htmlWorker.changeTodoStatusTo(parentElem, "done");
    todoService.updateTodoStatus("done", event.target.parentNode.id)
}

function removeTodo(event) {
    var liTag = event.target.parentNode.parentNode.parentNode;
    var ulTag = liTag.parentNode;
    ulTag.removeChild(liTag);
    todoService.removeTodo(event.target.parentNode.id)
}

function updateTodo(event) {
    modalOpenBtn.click();
    updateBtn.setAttribute("id", event.target.parentNode.id);
}